"use client";

import { toast } from 'sonner';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ModernModal } from "./ModernModal";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  created_at: string;
}

const STORAGE_BUCKET = 'product-images'; // Your Supabase storage bucket name

// Toast component removed as it's not being used

export default function AdminStockPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Array<{
    id: string;
    name: string;
    price: number;
    image_url: string;
    description: string;
    created_at: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image_url: "",
  });
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState<{
    id: string;
    name: string;
    price: number;
    image_url: string;
    description: string;
    created_at: string;
  } | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    image_url: "",
    description: ""
  });
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  // Toast state - Commented out as it's not being used
  // const [toast, setToast] = useState<{ message: string, open: boolean }>({ message: '', open: false });
  // const showToast = (message: string) => {
  //   setToast({ message, open: true });
  //   setTimeout(() => setToast(t => ({ ...t, open: false })), 2500);
  // };
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    if (!loading && (!profile || !(profile.role === 'admin' || profile.is_admin))) {
      router.push('/');
    } else {
      fetchProducts();
    }
  }, [profile, loading, router]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products3')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    
    if (data) setProducts(data as Product[]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Simulate progress since Supabase doesn't support it directly
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) clearInterval(progressInterval);
          return newProgress;
        });
      }, 200);

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw error;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);
      if (!publicUrlData?.publicUrl) throw new Error('No public URL returned');
      console.log('Image upload public URL:', publicUrlData.publicUrl);
      setFormData(prev => ({ ...prev, image_url: publicUrlData.publicUrl }));
      // Optionally show user feedback here (toast/snackbar) for successful upload.
    } catch (err: unknown) {
      console.error('Error uploading image:', err);
      let message = 'Error uploading image. Please try again.';
      if (err instanceof Error) {
        message = `Upload failed: ${err.message}`;
      }
      toast.error(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Shared insert function for both form and test button
  const handleProductInsert = async (insertPayload: { name: string; price: number; image_url: string }) => {
    try {
      // Get current user (for logging purposes)
      const userResult = await supabase.auth.getUser();
      console.log('Current Supabase user:', userResult);
      console.log('Insert Data:', insertPayload);
      
      // Insert the new product
      const { error } = await supabase
        .from('products3')
        .insert([insertPayload])
        .select()
        .single();

      if (error) throw error;
      
      // Show success message
      toast.success('Product added successfully!');
      
      // Refresh the products list
      await fetchProducts();
      
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`Failed to add product: ${errorMessage}`);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    
    // Validate form data
    if (!formData.name || typeof formData.name !== 'string' || !formData.name.trim()) {
      toast.error('Please enter a product name');
      return;
    }
    if (isNaN(price) || price <= 0) {
      toast.error('Price must be a valid number greater than 0');
      return;
    }
    if (!formData.image_url || typeof formData.image_url !== 'string' || !formData.image_url.trim()) {
      toast.error('Please upload an image first');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const insertPayload = {
        name: formData.name.trim(),
        price,
        image_url: formData.image_url.trim()
      };
      
      await handleProductInsert(insertPayload);
      // Reset form and close modal on successful insert
      setFormData({ name: "", price: "", image_url: "" });
      setShowAddModal(false);
    } catch (error) {
      // Error is already handled in handleProductInsert
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };



  const handleDelete = async (id: string) => {
    setDeleteProductId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteProductId) return;
    setIsDeleteLoading(true);
    await supabase.from('products3').delete().eq('id', deleteProductId);
    setIsDeleteLoading(false);
    setShowDeleteModal(false);
    setDeleteProductId(null);
    fetchProducts();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteProductId(null);
  };

  if (loading || !profile) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }

  // Edit handlers
  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price.toString(),
      image_url: product.image_url,
      description: product.description || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    
    if (!editFormData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    
    const price = parseFloat(editFormData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    setIsEditSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('products3')
        .update({
          name: editFormData.name.trim(),
          price: price,
          image_url: editFormData.image_url
        })
        .eq('id', editProduct.id);
      
      if (error) {
        // If error is an empty object, show a helpful message
        if (typeof error === 'object' && error !== null && Object.keys(error).length === 0) {
          console.error('Supabase returned empty error object:', error);
          throw new Error('Failed to update product. Please check your permissions or try again.');
        }
        throw error;
      }
      
      toast.success('Product updated successfully!');
      setShowEditModal(false);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      // Log the full error for debugging
      console.error('Error updating product (full objesct):', err);
      let message = 'Failed to update product';
      if (err instanceof Error && err.message) {
        message = err.message;
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as { message?: unknown }).message === 'string'
      ) {
        message = (err as { message: string }).message;
      } else if (typeof err === 'object' && err !== null && Object.keys(err).length === 0) {
        message = 'Failed to update product. Please check your permissions or try again.';
      }
      toast.error(message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) clearInterval(progressInterval);
          return newProgress;
        });
      }, 200);
      
      // Upload file to storage
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (error) throw error;
      
      // Get public URL
      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);
      
      if (!data?.publicUrl) throw new Error('Could not get public URL');
      
      // Update form data with new image URL
      setEditFormData(prev => ({
        ...prev,
        image_url: data.publicUrl
      }));
      
    } catch (err: unknown) {
      console.error('Error uploading image:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(`Error uploading image: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-25">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Add New Product
          </a>
        </div>

        {products.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image_url && (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${parseFloat(product.price.toString()).toFixed(2)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(product);
                        }}
                      >
                        Edit
                      </a>
                      <a
                        href="#"
                        className="text-red-600 hover:text-red-900"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(product.id);
                        }}
                      >
                        Delete
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4.5L4 7m16 0l-8 4.5M4 7v10l8 4.5m0-10.5v10.5m8-10.5v10l-8 4.5V22" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new product.</p>
            <div className="mt-6">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setShowAddModal(true); }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Product
              </a>
            </div>
          </div>
        )}
        {showAddModal && (
          <ModernModal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
            <div className="p-6 bg-white rounded-2xl shadow-xl">
              <motion.a 
                className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight drop-shadow-lg"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.04 }}
              >
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Add New Product</span>
              </motion.a>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-black">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black placeholder-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Product Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      {formData.image_url ? 'Change Image' : 'Upload Image'}
                    </a>
                    {isUploading && (
                      <motion.div
                        className="ml-4 w-full max-w-xs"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-full bg-gray-300 rounded-full h-2.5 border border-black overflow-hidden">
                          <motion.div
                            className="bg-black h-2.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.4 }}
                          ></motion.div>
                        </div>
                        <motion.p
                          className="text-xs text-black mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          Uploading: {Math.round(uploadProgress)}%
                        </motion.p>
                      </motion.div>
                    )}
                  </div>
                  {formData.image_url && (
                    <div className="mt-2">
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                <motion.div 
                  className="flex justify-end space-x-4 pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                >
                  <motion.a
                    href="#"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAddModal(false);
                    }}
                    className="inline-flex items-center px-5 py-2.5 rounded-full font-semibold text-base shadow-md border-2 border-transparent bg-gradient-to-r from-gray-200 via-gray-100 to-white text-gray-700 hover:from-pink-100 hover:to-pink-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    Cancel
                  </motion.a>
                  <motion.a
                    href="#"
                    role="button"
                    tabIndex={0}
                    aria-disabled={isSubmitting}
                    onClick={e => {
                      e.preventDefault();
                      if (!isSubmitting) {
                        const form = e.currentTarget.closest('form');
                        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                      }
                    }}
                    className={`inline-flex items-center px-6 py-2.5 rounded-full font-bold text-base shadow-lg border-2 border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${isSubmitting ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Add Product
                      </>
                    )}
                  </motion.a>
                </motion.div>
              </form>
            </div>
          </ModernModal>
        )}
      </div>
    {/* Edit Modal */}
    {showEditModal && editProduct && (
      <ModernModal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="p-6 bg-white rounded-2xl shadow-xl">
          <motion.a 
            className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight drop-shadow-lg"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04 }}
          >
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Edit Product</span>
          </motion.a>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-black">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="edit-name"
                required
                value={editFormData.name}
                onChange={handleEditInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              />
            </div>
            <div>
              <label htmlFor="edit-price" className="block text-sm font-medium text-black">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                id="edit-price"
                step="0.01"
                min="0"
                required
                value={editFormData.price}
                onChange={handleEditInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black placeholder-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Product Image
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  onChange={handleEditImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="edit-image-upload"
                />
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('edit-image-upload')?.click();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editFormData.image_url ? 'Change Image' : 'Upload Image'}
                </a>
                {isUploading && (
                  <motion.div className="ml-4 w-full max-w-xs">
                    <div className="w-full bg-gray-300 rounded-full h-2.5 border border-black overflow-hidden">
                      <motion.div
                        className="bg-black h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.4 }}
                      ></motion.div>
                    </div>
                    <motion.p className="text-xs text-black mt-1">
                      Uploading: {Math.round(uploadProgress)}%
                    </motion.p>
                  </motion.div>
                )}
              </div>
              {editFormData.image_url && (
                <div className="mt-2">
                  <Image
                    src={editFormData.image_url}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <motion.div 
              className="flex justify-end space-x-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              <motion.a
                whileHover={{ scale: 1.07, background: 'linear-gradient(90deg, #ff6a00, #ee0979)' }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowEditModal(false);
                  setEditProduct(null);
                }}
                className="inline-flex items-center px-5 py-2.5 rounded-full font-semibold text-base shadow-md border-2 border-transparent bg-gradient-to-r from-gray-200 via-gray-100 to-white text-gray-700 hover:from-pink-100 hover:to-pink-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Cancel
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.07, background: 'linear-gradient(90deg, #6366f1, #a21caf)' }}
                whileTap={{ scale: 0.96 }}
                href="#"
                role="button"
                tabIndex={0}
                aria-disabled={isEditSubmitting}
                onClick={e => {
                  e.preventDefault();
                  if (!isEditSubmitting) {
                    const form = e.currentTarget.closest('form');
                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  }
                }}
                className={`inline-flex items-center px-6 py-2.5 rounded-full font-bold text-base shadow-lg border-2 border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${isEditSubmitting ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
              >
                {isEditSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Save Changes
                  </>
                )}
              </motion.a>
            </motion.div>
          </form>
        </div>
      </ModernModal>
    )}
    
    
    {/* Delete Confirmation Modal */}
    {showDeleteModal && (
      <ModernModal isOpen={showDeleteModal} onClose={cancelDelete}>
        <div className="p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center">
          <svg className="w-14 h-14 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9zm-9-4h.01" /></svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Delete Product?</h3>
          <p className="mb-6 text-gray-600 text-center">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex space-x-4 mt-2">
            <a
              href="#"
              role="button"
              tabIndex={0}
              aria-disabled={isDeleteLoading}
              onClick={e => {
                e.preventDefault();
                if (!isDeleteLoading) cancelDelete();
              }}
              className={`inline-flex items-center px-5 py-2.5 rounded-full font-semibold text-base shadow-md border-2 border-transparent bg-gradient-to-r from-gray-200 via-gray-100 to-white text-gray-700 hover:from-pink-100 hover:to-pink-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 ${isDeleteLoading ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
            >
              Cancel
            </a>
            <a
              href="#"
              role="button"
              tabIndex={0}
              aria-disabled={isDeleteLoading}
              onClick={e => {
                e.preventDefault();
                if (!isDeleteLoading) confirmDelete();
              }}
              className={`inline-flex items-center px-6 py-2.5 rounded-full font-bold text-base shadow-lg border-2 border-transparent bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 ${isDeleteLoading ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
            >
              {isDeleteLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              )}
              Delete
            </a>
          </div>
        </div>
      </ModernModal>
    )}
  </div>
);
}