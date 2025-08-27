"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaUpload, FaTshirt, FaMagic, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";

function SaveToHistoryButton({ avatarImage, clothingImage, resultImage }: { avatarImage: string | null, clothingImage: string | null, resultImage: string | null }) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Helper to upload a base64 image to Supabase Storage, returns public URL
  async function uploadImage(base64: string, path: string): Promise<string | null> {
    try {
      const base64Response = await fetch(base64);
      const blob = await base64Response.blob();
      const { error: uploadError } = await supabase.storage
        .from('tryon-images')
        .upload(path, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: blob.type || 'image/jpeg',
        });
      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }
      const { data: { publicUrl } } = supabase.storage
        .from('tryon-images')
        .getPublicUrl(path);
      return publicUrl;
    } catch {
      console.error('Error in uploadImage');
      return null;
    }
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setMsg("Please log in to save to history");
      return;
    }
    if (!avatarImage || !clothingImage || !resultImage) {
      setMsg("Missing required images");
      return;
    }
    
    setSaving(true);
    setMsg("Uploading images...");
    try {
      const ts = Date.now();
      const userId = user.id;
      // Upload all images to storage with proper error handling
      const uploadPromises = [
        uploadImage(avatarImage, `${userId}/avatar_${ts}.png`),
        uploadImage(clothingImage, `${userId}/clothing_${ts}.png`),
        uploadImage(resultImage, `${userId}/result_${ts}.jpg`),
      ];
      console.log('Starting upload of images to storage...');
      const [avatarUrl, clothingUrl, resultUrl] = await Promise.all(uploadPromises);
      // Check if all uploads were successful
      if (!avatarUrl || !clothingUrl || !resultUrl) {
        console.error('One or more uploads failed:', { avatarUrl, clothingUrl, resultUrl });
        throw new Error("Failed to upload one or more images. Please try again.");
      }
      console.log('All images uploaded successfully:', {
        avatarUrl,
        clothingUrl,
        resultUrl
      });
      // Insert into history table
      const { error } = await supabase.from("history").insert({
        user_id: userId,
        image_url: avatarUrl,
        clothing_url: clothingUrl,
        result_url: resultUrl,
        created_at: new Date().toISOString(),
      });
      if (error) {
        console.error("Database error:", error);
        throw new Error("Failed to save to history. Please try again.");
      }
      setMsg("Successfully saved to history!");
    } catch {
      setMsg("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  if (!user) return null;
  if (!avatarImage || !clothingImage || !resultImage) return null;
  return (
    <>
      <a
        role="button"
        tabIndex={0}
        aria-label="Save to history"
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
        style={{ minWidth: 160, justifyContent: 'center' }}
        onClick={saving ? undefined : handleSave}
        aria-disabled={saving}
      >
        {saving ? "Saving..." : "Save to History"}
      </a>
      {msg && <div className="mt-2 text-sm text-indigo-500 font-medium">{msg}</div>}
    </>
  );
}

export default function TryOnPage() {
  const [clothingImage, setClothingImage] = useState<string | null>(null);

  // Only run this client-side
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cloth = params.get('cloth');
    const clothUrl = params.get('cloth_url');
    
    if (cloth) {
      setClothingImage(`/images/${cloth}`);
    } else if (clothUrl) {
      // If we have a full URL from Supabase, use it directly
      setClothingImage(clothUrl);
    }
  }, []);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fallbackResultImage, setFallbackResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clothingInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ───────────────────────────────────────── helpers
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (v: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clothingImage || !avatarImage) {
      setError("Please upload both images.");
      return;
    }

    console.log('Starting try-on process...');
    console.log('Clothing image:', clothingImage);
    console.log('Avatar image exists:', !!avatarImage);
    
    setIsLoading(true);
    setError(null);
    setResultImage(null);
    setFallbackResultImage(null);

    try {
      let clothingFile = clothingInputRef.current?.files?.[0];
      const avatarFile = avatarInputRef.current?.files?.[0];
      // If no file uploaded but clothingImage is a URL, use our API to fetch it
      if (!clothingFile && clothingImage) {
        try {
          const imageUrl = clothingImage;
          console.log('Processing image URL:', imageUrl);
          
          // If it's a Supabase URL, use our API to download it
          if (clothingImage.includes('supabase.co')) {
            console.log('Downloading from Supabase via API...');
            const response = await fetch(`/api/download-image?url=${encodeURIComponent(clothingImage)}`);
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.error('API Error:', errorData);
              throw new Error(
                errorData.details || 
                `Failed to fetch image (${response.status}): ${response.statusText}`
              );
            }
            
            const blob = await response.blob();
            console.log('Received blob with type:', blob.type, 'size:', blob.size);
            
            const filename = clothingImage.split('/').pop() || 'cloth.png';
            const fileType = response.headers.get('content-type') || blob.type || 'image/jpeg';
            
            clothingFile = new File([blob], filename, { type: fileType });
            console.log('Created File object:', {
              name: clothingFile.name,
              size: clothingFile.size,
              type: clothingFile.type
            });
          } else {
            // For local images
            console.log('Downloading local image...');
            const response = await fetch(clothingImage);
            if (!response.ok) {
              throw new Error(`Failed to fetch local image: ${response.status} ${response.statusText}`);
            }
            
            const blob = await response.blob();
            console.log('Local image blob:', { type: blob.type, size: blob.size });
            
            const filename = clothingImage.split('/').pop() || 'cloth.png';
            const fileType = blob.type || 'image/jpeg';
            
            clothingFile = new File([blob], filename, { type: fileType });
          }
        } catch (error) {
          console.error('Error processing image:', error);
          setError('Failed to process the clothing image. Please try again.');
          setIsLoading(false);
          return;
        }
      }
      if (!clothingFile || !avatarFile) throw new Error("Files not found");

      try {
        // Prepare form data with the image files
        const formData = new FormData();
        formData.append('clothing_image', clothingFile);
        formData.append('avatar_image', avatarFile);

        // Call the VirtuFit360 API
        const response = await fetch('https://virtufit360.fly.dev/try-on', {
          method: 'POST',
          // Don't set Content-Type header - let the browser set it with the correct boundary
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to process virtual try-on');
        }

        const result = await response.json();
        console.log('API Response:', result);
        
        // Handle the response - check for different possible response formats
        if (result.image_url) {
          setResultImage(result.image_url);
        } else if (result.url) {
          setResultImage(result.url);
        } else if (result.image) {
          setResultImage(result.image);
        } else {
          console.error('Unexpected API response format:', result);
          throw new Error('No valid image URL in response');
        }
      } catch (apiError) {
        console.error('Error with VirtuFit360 API:', apiError);
        setError("An error occurred while processing your request. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError("An error occurred while processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // reset previous result if either source image changes
  useEffect(() => {
    setResultImage(null);
  }, [clothingImage, avatarImage]);

  // ───────────────────────────────────────── UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* ───── title ───── */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Virtual Try-On
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            See how the outfit looks on you before buying
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* ========== LEFT COLUMN – uploads & button ========== */}
            <section className="p-8 md:w-1/2 flex flex-col h-full overflow-y-auto">
              <form
                onSubmit={handleSubmit}
                className="space-y-8 flex flex-col flex-1"
              >
                {/* Clothing image */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FaTshirt className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-medium text-gray-900">
                      Upload Clothing
                    </h2>
                  </div>

                  <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-50 hover:border-indigo-300 rounded-xl cursor-pointer transition-all">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <FaUpload className="w-8 h-8 text-gray-400 group-hover:text-indigo-600" />
                      <p className="pt-1 text-sm tracking-wider text-gray-500">
                        {clothingImage
                          ? "Change file"
                          : "Select clothing image"}
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

                  {clothingImage && (
                    <div className="w-full h-48 max-h-48 flex items-center justify-center rounded-lg border border-gray-300 bg-white mt-3 overflow-hidden">
                      <Image
                        src={clothingImage}
                        alt="Clothing preview"
                        width={192}
                        height={192}
                        className="object-contain max-w-full max-h-full"
                        unoptimized={clothingImage.includes('supabase.co')}
                      />
                    </div>
                  )}
                </div>

                {/* Avatar image */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FaUser className="h-5 w-5 text-indigo-600" />
                    <h2 className="text-lg font-medium text-gray-900">
                      Your Photo
                    </h2>
                  </div>

                  <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-50 hover:border-indigo-300 rounded-xl cursor-pointer transition-all">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <FaUpload className="w-8 h-8 text-gray-400 group-hover:text-indigo-600" />
                      <p className="pt-1 text-sm tracking-wider text-gray-500">
                        {avatarImage ? "Change file" : "Select your photo"}
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

                  {avatarImage && (
                    <Image
                      src={avatarImage}
                      alt="Avatar preview"
                      width={192}
                      height={192}
                      className="w-full h-48 max-h-48 object-contain rounded-lg border border-gray-300 bg-white mt-3 transition-all duration-200"
                    />
                  )}
                </div>

                {/* Sticky Submit button at the bottom */}
                <div className="sticky bottom-0 left-0 w-full bg-white pt-4 pb-2 z-20">
  <a
    href="#"
    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (!(isLoading || !clothingImage || !avatarImage)) handleSubmit(e as unknown as React.FormEvent);
    }}
    className={`w-full flex items-center justify-center rounded-xl font-bold text-lg py-3 transition-all duration-200 border shadow-md select-none \
      ${isLoading || !clothingImage || !avatarImage
        ? "bg-white text-gray-400 border-gray-300 pointer-events-none"
        : "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 hover:border-indigo-800 hover:scale-105 cursor-pointer"}
    `}
    tabIndex={isLoading || !clothingImage || !avatarImage ? -1 : 0}
    aria-disabled={isLoading || !clothingImage || !avatarImage}
  >
    {isLoading
      ? "Processing…"
      : resultImage
      ? "Try Again"
      : "Try It On"}
  </a>
</div>
              </form>

        

              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md"
                  >
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* ========== RIGHT COLUMN – result ========== */}
            <section className="bg-gray-50 p-8 md:w-1/2 flex flex-col">
              <div className="flex items-center space-x-2 mb-6">
                <FaMagic className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-medium text-gray-900">
                  Your Virtual Try-On
                </h2>
              </div>

              <div className="mt-6 flex flex-col items-center justify-center gap-8">
                <div className="border-2 border-dashed border-indigo-200 rounded-xl p-4 w-full max-w-lg min-h-[220px] flex flex-col items-center justify-center bg-white">
                  <div className="w-full">
                    <div className="mb-2 text-sm font-semibold text-gray-700">Your Try-on Result</div>
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
                        <div className="mt-4 text-indigo-400 font-semibold text-lg">Processing your virtual try-on...</div>
                      </div>
                    ) : resultImage || fallbackResultImage ? (
                      <>
                        <Image
                          src={resultImage || fallbackResultImage || ''}
                          alt="Try-on result"
                          width={320}
                          height={256}
                          className="w-full h-64 object-contain rounded-lg shadow-md"
                        />
                        <div className="flex flex-row gap-4 mt-4 justify-center">
                          <a
                            href={(resultImage || fallbackResultImage) ?? ''}
                            download="virtual-try-on-result.jpg"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <svg
                              className="-ml-1 mr-2 h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                            Download Result
                          </a>
                          <SaveToHistoryButton
                            avatarImage={avatarImage ?? ''}
                            clothingImage={clothingImage ?? ''}
                            resultImage={(resultImage || fallbackResultImage) ?? ''}
                          />
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400">No try-on result available</span>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>  
        </div>
      </motion.div>
    </div>
  );
}