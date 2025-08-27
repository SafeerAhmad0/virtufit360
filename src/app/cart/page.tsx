"use client";
import React from "react";
import { useCart } from "../../context/CartContext";
import { toast } from 'react-hot-toast';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  // Router removed as it's not used

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared!');
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700 text-center">Your Cart</h1>
        {items.length === 0 ? (
          <div className="text-center text-gray-500">Your cart is empty.</div>
        ) : (
          <>
            <ul className="space-y-6 mb-10">
              {items.map((item) => (
                <li key={item.id} className="relative flex flex-col sm:flex-row items-center bg-gray-50 rounded-xl shadow p-4 sm:p-6">
                  <button
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow transition focus:outline-none"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    &times;
                  </button>
                  <div className="w-20 h-20 relative">
                    <Image
                      src={item.image || "/images/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg border"
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="font-bold text-lg text-gray-900">{item.name}</div>
                    <div className="text-indigo-600 font-semibold text-base">${item.price}</div>
                    <div className="flex items-center mt-1">
                      <button
                        className="w-8 h-8 flex items-center justify-center text-xl bg-white border border-gray-300 rounded-full hover:bg-indigo-50 hover:border-indigo-400 transition"
                        onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="mx-4 min-w-[2.5rem] text-lg text-gray-700 text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center text-xl bg-white border border-gray-300 rounded-full hover:bg-indigo-50 hover:border-indigo-400 transition"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 border-t pt-6">
              <div className="flex flex-col items-start gap-1">
                <span className="text-xl font-semibold text-gray-700">Total:</span>
                <span className="text-2xl font-bold text-indigo-700">${total.toFixed(2)}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/checkout" passHref legacyBehavior>
                  <Button
                    component="a"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ fontWeight: 600, fontSize: '1.1rem', borderRadius: '0.75rem', boxShadow: 2 }}
                  >
                    Buy Now
                  </Button>
                </Link>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  fullWidth
                  sx={{ fontWeight: 600, fontSize: '1.1rem', borderRadius: '0.75rem' }}
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
