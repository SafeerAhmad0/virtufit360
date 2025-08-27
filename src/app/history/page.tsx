"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

export default function HistoryPage() {
  const { user } = useAuth();
  type HistoryItem = {
    id: string;
    image_url: string;
    clothing_url: string;
    result_url: string;
    created_at: string;
  };
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchHistory() {
      setLoading(true);
      const { data } = await supabase
        .from("history")
        .select("id, image_url, clothing_url, result_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setHistory(data || []);
      setLoading(false);
    }
    fetchHistory();
  }, [user]);

  return (
    <div className="min-h-[80vh] bg-white flex flex-col items-center pt-12 pb-24 px-2">
      <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-8 tracking-tight">Try-On History</h1>
      {loading ? (
        <div className="text-lg text-gray-400 mt-16">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-lg text-gray-400 mt-16">No try-on history yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
          {history.map((item) => (
            <div key={item.id} className="rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-xl p-8 flex flex-col items-center transition-transform hover:scale-105 w-full max-w-2xl mx-auto">
              <div className="flex gap-8 items-center mb-4 justify-center">
                <div className="flex flex-col items-center">
                  <Image
                    src={item.image_url}
                    alt="User"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-indigo-200 shadow"
                  />
                  <span className="mt-1 text-xs text-indigo-600 font-semibold">You</span>
                </div>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M8 12h8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" opacity=".1"/></svg>
                <div className="flex flex-col items-center">
                  <Image
                    src={item.clothing_url}
                    alt="Clothing"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-purple-200 shadow"
                  />
                  <span className="mt-1 text-xs text-purple-600 font-semibold">Clothing</span>
                </div>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M8 12h8" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" opacity=".1"/></svg>
                <div className="flex flex-col items-center">
                  <Image
                    src={item.result_url}
                    alt="Result"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-xl object-cover border-2 border-green-200 shadow"
                  />
                  <span className="mt-1 text-xs text-green-600 font-semibold">Result</span>
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2">Tried on: {new Date(item.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
