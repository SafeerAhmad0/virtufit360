"use client";
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import Button from '@mui/material/Button';
import Link from 'next/link';
import { sendOrderEmail } from '../../utils/sendEmail';
import Notification from '../../components/Notification';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      // Prepare order data
      const orderData = {
        name,
        email,
        address,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || ''
        })),
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      
      // Send order confirmation email
      await sendOrderEmail(orderData);
      
      // Clear cart and show success message
      setSuccess("Order placed! Confirmation email sent.");
      clearCart();
      
      // Redirect to shop after a short delay
      setTimeout(() => router.push("/shop"), 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setError(errorMessage);
      console.error('Checkout error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Notification message="Order Confirmed!" show={!!success} onClose={() => setSuccess("")} />
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700 text-center">Checkout</h1>
        {items.length === 0 ? (
          <div className="text-center text-gray-500">Your cart is empty.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 text-black"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 text-black"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Shipping Address</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 text-black"
              />
            </div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h2>
              <ul className="divide-y divide-gray-200 mb-2">
                {items.map(item => (
                  <li key={item.id} className="flex justify-between py-2 text-black">
                    <span>{item.name} x {item.quantity}</span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold text-indigo-700">
                <span>Total:</span>
                <span>Rs. {total}</span>
              </div>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={submitting}
              sx={{ fontWeight: 600, fontSize: '1.1rem', borderRadius: '0.75rem', boxShadow: 2 }}
            >
              {submitting ? "Placing Order..." : "Place Order & Receive Email"}
            </Button>
            <Link href="/shop" passHref legacyBehavior>
              <Button
                component="a"
                variant="outlined"
                color="secondary"
                size="large"
                fullWidth
                sx={{ fontWeight: 600, fontSize: '1.1rem', borderRadius: '0.75rem', mt: 2 }}
              >
                Back to Shop
              </Button>
            </Link>
            {success && <div className="text-green-600 text-center mt-4">{success}</div>}
            {error && <div className="text-red-600 text-center mt-4">{error}</div>}
          </form>
        )}
      </div>
    </main>
  );
}
