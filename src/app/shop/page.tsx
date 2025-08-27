"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaTshirt, FaMagic, FaShoppingCart } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity?: number;
}

export default function ShopPage() {
  const { addToCart } = useCart();
  type Product = { 
    id: string; 
    name: string; 
    image: string; 
    image_url?: string; 
    price: number 
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products3')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        type ProductRaw = { 
          id: string; 
          name: string; 
          image?: string; 
          image_url?: string; 
          price: number 
        };
        
        const parsedData = (data as ProductRaw[]).map((item): Product => ({
          id: item.id,
          name: item.name,
          image: item.image || item.image_url || '',
          price: item.price,
        }));
        
        setProducts(parsedData);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: 'One Size',
      color: 'Default',
      quantity: 1
    };
    addToCart(cartItem);
    toast.success('Item added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <FaTshirt className="text-white animate-bounce" /> Our Collection
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Browse our exquisite collection of traditional Pakistani wear
          </p>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2 justify-center">
              <FaMagic className="text-purple-500 animate-spin-slow" /> Featured Outfits
            </h2>
            <p className="mt-2 text-lg text-gray-600">Select your favorite and try it on virtually or add to cart!</p>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
            </div>
          ) : (
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.08 }}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group relative"
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 40px 0 rgba(80,80,140,0.14)" }}
                >
                  <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      width={220} height={220}
                      className="object-contain h-56 rounded-lg drop-shadow-xl group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-lg font-semibold text-indigo-600 mb-3">
                      ${product.price.toFixed(2)}
                    </p>
                    <div className="flex flex-col gap-3 mt-auto">
                      <a
                        href={`/try-on?cloth_url=${encodeURIComponent(product.image)}`}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-indigo-600 text-indigo-700 rounded-md hover:bg-indigo-100 active:scale-[0.98] transition-all font-semibold shadow group"
                        style={{ textDecoration: 'none', cursor: 'pointer' }}
                        aria-label="Virtually Try On"
                      >
                        <FaMagic className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                        Virtually Try On
                      </a>
                      <a
                        // href={}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-indigo-600 text-indigo-700 rounded-md hover:bg-indigo-100 active:scale-[0.98] transition-all font-semibold shadow group"
                        style={{ textDecoration: 'none', cursor: 'pointer' }}
                        aria-label="Virtually Try On"
                      >
                        <FaShoppingCart className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                        Add to Cart
                      </a>
                      {/* <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="w-full flex items-center h-10 
                         justify-center gap-2 py-2 px-4 bg-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-700 active:scale-[0.98] transition-all font-semibold shadow group"
                      >
                        <FaShoppingCart className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                        Add to Cart
                      </button> */}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
