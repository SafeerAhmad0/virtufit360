"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaPalette, FaUpload, FaMagic, FaCheck } from "react-icons/fa";

// Available colors in the store (matching your images folder)
const STORE_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Dark Green', hex: '#006400' },
  { name: 'Light Blue', hex: '#ADD8E6' },
  { name: 'Light Green', hex: '#90EE90' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Yellow', hex: '#FFFF00' },
];

export default function StyleMatchPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  // Function to extract dominant color from image
  // Helper: Find closest color from STORE_COLORS
  const findClosestColor = (color: string) => {
    const hexToRgb = (hex: string) => [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];
    const colorDistance = (c1: number[], c2: number[]) => Math.sqrt((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2);
    const target = hexToRgb(color);
    let minDist = Infinity;
    let closest = STORE_COLORS[0];
    for (const c of STORE_COLORS) {
      const dist = colorDistance(target, hexToRgb(c.hex));
      if (dist < minDist) { minDist = dist; closest = c; }
    }
    return closest;
  };
// Remove any other findClosestColor declarations below this line

  const getDominantColor = (img: HTMLImageElement): {name: string, hex: string} => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return STORE_COLORS[0];
      
      // Set canvas size to image size (limit size for performance)
      const maxSize = 400;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height / width) * maxSize;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width / height) * maxSize;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Sample pixels to find dominant color
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // Count color frequencies (sample up to 1000 pixels for performance)
      const colorCount: Record<string, number> = {};
      const sampleSize = Math.min(1000, data.length / 4);
      
      for (let i = 0; i < sampleSize; i++) {
        // Randomly sample pixels
        const idx = Math.floor(Math.random() * (data.length / 4)) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // Skip transparent/white/black pixels
        if ((r > 230 && g > 230 && b > 230) || (r < 25 && g < 25 && b < 25) || data[idx + 3] < 100) {
          continue;
        }
        
        // Group similar colors
        const key = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
        colorCount[key] = (colorCount[key] || 0) + 1;
      }
      
      // Find the most common color
      let maxCount = 0;
      let dominantColor = [0, 0, 0];
      
      for (const [key, count] of Object.entries(colorCount)) {
        if (count > maxCount) {
          const [r, g, b] = key.split(',').map(Number);
          dominantColor = [r, g, b];
          maxCount = count;
        }
      }
      
      // Convert to hex and find closest match in store colors
      const toHex = (c: number) => Math.round(c).toString(16).padStart(2, '0');
      const detectedColor = `#${toHex(dominantColor[0])}${toHex(dominantColor[1])}${toHex(dominantColor[2])}`.toUpperCase();
      return findClosestColor(detectedColor);
    } catch (error) {
      console.error('Error detecting color:', error);
      // Return a random color from store if detection fails
      return STORE_COLORS[Math.floor(Math.random() * STORE_COLORS.length)];
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult(null);
    setError(null);
    
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
      
      // Create image element for color extraction
      const img = new window.Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => setImageElement(img);
      
      // Clean up when component unmounts or file changes
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreview(null);
      setImageElement(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    
    if (!imageElement) {
      setError("Please upload an image first");
      setLoading(false);
      return;
    }

    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get dominant color
      const colorObj = getDominantColor(imageElement);
      console.log('Extracted color:', colorObj);
      setResult(colorObj.hex);
    } catch (err) {
      console.error('Error extracting color:', err);
      setError('Failed to extract color from image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <FaPalette className="text-3xl text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">StyleMatch AI</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your photo and let our AI recommend the perfect outfit colors that match your style and skin tone.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              <label className="cursor-pointer ">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 transition-colors hover:border-indigo-400 mb-2">
                {preview ? (
                  <div className="relative w-full max-w-md h-64 mb-6 overflow-hidden rounded-lg">
                    <Image 
                      src={preview} 
                      alt="Preview" 
                      fill 
                      className="object-contain w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="bg-indigo-50 p-4 rounded-full mb-4">
                    <FaUpload className="text-4xl text-indigo-500" />
                  </div>
                )}
                
                
                  <span className="text-indigo-600 font-medium">
                    {preview ? 'Change image' : 'Upload your photo'}
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                
                <p className="text-sm text-gray-500 mt-1">
                  {preview ? 'or drag and drop' : 'JPG, PNG up to 5MB'}
                </p>
              </div>
            </label>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (file && !loading) {
                    handleSubmit(e);
                  }
                }}
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                  !file || loading
                    ? 'bg-gray-300 cursor-not-allowed pointer-events-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                }`}
              >
                {loading ? (
                  'Analyzing...'
                ) : (
                  <>
                    <FaMagic className="mr-2" />
                    Find My Colors
                  </>
                )}
              </a>
            </form>

            {/* Results */}
            {result && (
              <div className="mt-8 space-y-6">
                {/* AI Recommended Color */}
                <div className="p-6 bg-indigo-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <FaMagic className="inline mr-2 text-indigo-600" />
                    AI Recommended Color
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-lg shadow-md border-2 border-indigo-200"
                      style={{ backgroundColor: result }}
                    />
                    <div>
                      <p className="font-mono text-lg font-bold">{result}</p>
                      <p className="text-sm text-gray-600">This color complements you best!</p>
                    </div>
                  </div>
                </div>

                {/* Available Colors */}
                <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    <FaPalette className="inline mr-2 text-indigo-600" />
                    Available Colors in Store
                  </h3>
                  <div className="flex justify-center gap-8">
                    {STORE_COLORS.map((color, index) => {
                      const isRecommended = color.hex.toLowerCase() === result?.toLowerCase();
                      return (
                        <div 
                          key={index}
                          className={`relative group cursor-pointer transition-transform hover:scale-110`}
                          title={color.name}
                          onClick={() => setResult(color.hex)}
                        >
                          <div 
                            className={`w-16 h-16 rounded-full mx-auto shadow-md border-2 ${isRecommended ? 'border-indigo-500' : 'border-gray-200'}`}
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="text-center mt-2 font-medium">
                            {color.name}
                          </div>
                          {isRecommended && (
                            <div className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full p-1.5">
                              <FaCheck className="text-xs" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
