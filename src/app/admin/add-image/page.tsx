"use client";
import React, { useState, useEffect } from "react";
import { toast } from 'sonner';

import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  image?: string;
  description?: string;
}

// Shows a confirmation toast with Yes/No buttons and resolves to true/false
function confirmDeleteToast(): Promise<boolean> {
  return new Promise((resolve) => {
    toast.info(
      <span>
        Are you sure you want to delete this product?
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button
            style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px', marginRight: 8 }}
            onClick={() => {
              toast.dismiss();
              resolve(true);
            }}
          >Yes</button>
          <button
            style={{ background: '#e5e7eb', color: '#111', border: 'none', borderRadius: 6, padding: '4px 12px' }}
            onClick={() => {
              toast.dismiss();
              resolve(false);
            }}
          >No</button>
        </div>
      </span>,
      { duration: 10000 }
    );
  });
}

export default function AdminAddImagePage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!profile || profile.role !== "admin") {
      router.replace("/");
    } else {
      fetchProducts();
    }
    // eslint-disable-next-line
  }, [profile]);

  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (!error && data) setProducts(data);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    let image_url = "";
    try {
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, image);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
        image_url = publicUrlData.publicUrl;
      } else {
        throw new Error("Image is required");
      }
      const { error: insertError } = await supabase.from("products").insert([
        { name, price, description, image_url }
      ]);
      if (insertError) throw insertError;
      toast.success("Product added!");
      setName("");
      setPrice(0);
      setDescription("");
      setImage(null);
      fetchProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to add product");
      } else {
        toast.error("Failed to add product");
      }
    }
    setLoading(false);
  }

  async function handleDeleteProduct(id: string) {
    const confirmed = await confirmDeleteToast();
    if (!confirmed) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { error: deleteError } = await supabase.from("products").delete().eq("id", id);
      if (deleteError) throw deleteError;
      toast.success("Product deleted!");
      fetchProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to delete product");
      } else {
        toast.error("Failed to delete product");
      }
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin: Add Product</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
      <form onSubmit={handleAddProduct} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block font-semibold mb-1">Product Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Price</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Product Image</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} required className="w-full" />
        </div>
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded font-bold hover:bg-indigo-700 disabled:opacity-60">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
      <hr className="my-8" />
      <h2 className="text-xl font-bold mb-4">Current Products</h2>
      <ul className="space-y-4">
        {products.map(product => (
          <li key={product.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow">
            <Image src={product.image || product.image_url || ''} alt={product.name} width={80} height={80} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold">{product.name}</div>
              <div className="text-gray-600">Rs. {product.price}</div>
              <div className="text-gray-500 text-sm">{product.description}</div>
            </div>
            <button onClick={() => handleDeleteProduct(product.id)} disabled={loading} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-60">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

