"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@mui/material/Button";
import { FaPalette } from "react-icons/fa";

export default function ColorMatchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult(null);
    setError(null);
    if (f) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    if (!file) {
      setError("Please upload an image.");
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/cool-color", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.color) {
        setResult(data.color);
      } else {
        setError(data.error || "No color recommendation found.");
      }
    } catch (error) {
      setError("Error contacting AI service.");
      console.error('Color match error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl border border-indigo-100 p-8 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2 flex items-center gap-3">
          <FaPalette className="text-4xl md:text-5xl text-indigo-400 drop-shadow" /> ColorMatch AI
        </h1>
        <p className="text-gray-600 text-lg mb-6 text-center">Discover which colors from our designer palette suit you best. Upload your photo and let AI recommend the perfect shade!</p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {preview && (
            <div className="flex justify-center mb-2">
              <Image src={preview} alt="preview" width={180} height={180} className="rounded-lg object-cover border-2 border-indigo-200 shadow-md" />
            </div>
          )}
          <Button type="submit" variant="contained" color="primary" disabled={loading} style={{ borderRadius: 999 }}>
            {loading ? "Asking AI..." : "Ask AI for Color"}
          </Button>
          {result && (
            <div className="mt-6 text-center animate-fade-in">
              <div className="text-lg font-semibold text-indigo-700 mb-2">Recommended Color:</div>
              <div className="w-14 h-14 rounded-full mx-auto my-2 border-4 border-indigo-200 shadow-lg animate-pop" style={{ background: result }} />
              <div className="text-gray-700 font-bold text-xl">{result}</div>
            </div>
          )}
          {error && <div className="text-red-600 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}
