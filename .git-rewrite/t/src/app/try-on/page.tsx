"use client";

import { useState, useRef, useEffect } from 'react';
import { FaUpload, FaTshirt, FaMagic, FaUser, FaSync, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function TryOnPage() {
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const clothingInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImage: (value: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clothingImage || !avatarImage) {
      setError('Please upload both images');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const clothingFile = clothingInputRef.current?.files?.[0];
      const avatarFile = avatarInputRef.current?.files?.[0];

      if (!clothingFile || !avatarFile) {
        throw new Error('Files not found');
      }

      const formData = new FormData();
      formData.append('clothing_image', clothingFile);
      formData.append('avatar_image', avatarFile);

      const response = await fetch('https://virtufit360.fly.dev/try-on', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process images');
      }

      const result = await response.json();
      if (result.success && result.image) {
        setResultImage(result.image);
      } else {
        throw new Error('No image data received');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset success state when images change
  useEffect(() => {
    if (clothingImage && avatarImage) {
      setIsSuccess(false);
      setResultImage(null);
    }
  }, [clothingImage, avatarImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Virtual Try-On
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            See how the outfit looks on you before buying
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Input Section */}
            <div className="p-8 md:w-1/2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Clothing Image */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FaTshirt className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-medium text-gray-900">Upload Clothing</h2>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-50 hover:border-indigo-300 rounded-xl transition-all duration-200 ease-in-out cursor-pointer">
                        <div className="flex flex-col items-center justify-center pt-7">
                          <FaUpload className="w-8 h-8 text-gray-400 group-hover:text-indigo-600" />
                          <p className="pt-1 text-sm tracking-wider text-gray-500">
                            {clothingImage ? 'Change file' : 'Select clothing image'}
                          </p>
                        </div>
                        <input
                          type="file"
                          ref={clothingInputRef}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setClothingImage)}
                          className="opacity-0 absolute"
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                    {clothingImage && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3"
                      >
                        <div className="relative group">
                          <img 
                            src={clothingImage} 
                            alt="Clothing preview" 
                            className="h-48 w-full object-contain rounded-lg border border-gray-200"
                          />
                          <button 
                            type="button"
                            onClick={() => setClothingImage(null)}
                            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Avatar Image */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FaUser className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-medium text-gray-900">Your Photo</h2>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-50 hover:border-indigo-300 rounded-xl transition-all duration-200 ease-in-out cursor-pointer">
                        <div className="flex flex-col items-center justify-center pt-7">
                          <FaUpload className="w-8 h-8 text-gray-400 group-hover:text-indigo-600" />
                          <p className="pt-1 text-sm tracking-wider text-gray-500">
                            {avatarImage ? 'Change file' : 'Select your photo'}
                          </p>
                        </div>
                        <input
                          type="file"
                          ref={avatarInputRef}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, setAvatarImage)}
                          className="opacity-0 absolute"
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                    {avatarImage && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3"
                      >
                        <div className="relative group">
                          <img 
                            src={avatarImage} 
                            alt="Avatar preview" 
                            className="h-48 w-full object-cover rounded-lg border border-gray-200"
                          />
                          <button 
                            type="button"
                            onClick={() => setAvatarImage(null)}
                            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading || !clothingImage || !avatarImage}
                    className={`w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-base font-medium text-white transition-all duration-200 ease-in-out
                      ${isLoading || !clothingImage || !avatarImage
                        ? 'bg-indigo-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <FaSync className="animate-spin mr-2 h-5 w-5" />
                        Processing...
                      </>
                    ) : isSuccess ? (
                      <>
                        <FaCheck className="mr-2 h-5 w-5" />
                        Try Again
                      </>
                    ) : (
                      <>
                        <FaMagic className="mr-2 h-5 w-5" />
                        Try It On
                      </>
                    )}
                  </button>
                </div>
              </form>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Result Section */}
            <div className="bg-gray-50 p-8 md:w-1/2 flex flex-col">
              <div className="flex items-center space-x-2 mb-6">
                <FaMagic className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-medium text-gray-900">Your Virtual Try-On</h2>
              </div>
              
              <div className="flex-1 flex items-center justify-center bg-white rounded-xl border-2 border-dashed border-gray-300 p-6">
                {isLoading ? (
                  <div className="text-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <FaSync className="h-6 w-6 text-indigo-600 animate-spin" />
                      </div>
                      <p className="text-gray-600">Generating your look...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                    </div>
                  </div>
                ) : resultImage ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <img 
                      src={resultImage} 
                      alt="Try-on result" 
                      className="max-h-[500px] w-auto rounded-lg shadow-md"
                      onLoad={() => setIsSuccess(true)}
                    />
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 mb-4">
                      <FaTshirt className="h-12 w-12 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Your result will appear here</h3>
                    <p className="text-gray-500">Upload your images and click "Try It On"</p>
                  </div>
                )}
              </div>

              {resultImage && (
                <div className="mt-6 flex justify-center">
                  <a 
                    href={resultImage} 
                    download="virtual-try-on-result.jpg"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Result
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
