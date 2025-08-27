'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ClientPage from './client-page';
import { motion } from 'framer-motion';
import { FaMagic, FaSmileBeam, FaUserCheck, FaStar, FaRegSmileWink, FaUserFriends, FaTshirt, FaMobileAlt } from 'react-icons/fa';

const Home = () => {
  return (
    <ClientPage>
      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight flex items-center gap-3">
                  <FaMagic className="text-indigo-500 animate-pulse" /> Experience Traditional Pakistani Wear
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  Try on beautiful Pakistani outfits virtually with our AI-powered platform. 
                  See how you&apos;ll look before you buy!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center justify-center px-6 py-3 sm:px-8 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-lg transition-colors duration-200 shadow-lg"
                  >
                    <FaTshirt className="mr-2 text-xl" /> Start Shopping
                  </Link>
                  <Link 
                    href="/about-us" 
                    className="inline-flex items-center justify-center px-6 py-3 sm:px-8 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-3 md:text-lg transition-colors duration-200"
                  >
                    <FaUserFriends className="mr-2 text-xl" /> Learn More
                  </Link>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="relative h-80 md:h-96 bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center p-6 md:p-8">
                    <div className="text-5xl md:text-6xl mb-3 md:mb-4 animate-bounce flex justify-center">
                      <Image 
                        src="/images/Logo1.png" 
                        alt="VirtuFit360 Logo"
                        width={80}
                        height={80}
                        className="mx-auto"
                        priority
                      />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Virtual Try-On</h3>
                    <p className="text-gray-600 mt-1 md:mt-2">See yourself in traditional attire instantly</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10 md:mb-12 flex items-center justify-center gap-2">
              <FaMagic className="text-indigo-500" /> How VirtuFit360 Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FaSmileBeam className="text-4xl text-yellow-400" />,
                  title: 'Upload Your Photo',
                  description: 'Snap or upload your photo. Our system will map your body for a perfect try-on experience.'
                },
                {
                  icon: <FaTshirt className="text-4xl text-indigo-500" />,
                  title: 'Pick Your Outfit',
                  description: 'Browse our curated collection and choose any style you love.'
                },
                {
                  icon: <FaUserCheck className="text-4xl text-green-500" />,
                  title: 'See The Magic',
                  description: 'Virtually try on the outfit and view yourself in 3D instantly!'
                }
              ].map((step, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 * idx }} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center">
                  {step.icon}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-3">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10 md:mb-12 flex items-center justify-center gap-2">
              <FaStar className="text-yellow-400" /> How to use VirtualFit360?
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
              <div className="flex flex-col items-center">
                <video src="/images/vid.mp4" controls className="rounded-xl shadow-lg max-w-xs mb-3" poster="/images/Pic.jpg">
                  Your browser does not support the video tag.
                </video>
                <span className="text-gray-700 text-center text-sm">Stand straight,Use good lighting and keep arms at side</span>
              </div>
              <div className="flex flex-col items-center">
                <Image 
                  src="/images/Pic.jpg" 
                  alt="Sample front-facing photo" 
                  width={320} 
                  height={240}
                  className="rounded-xl shadow-lg max-w-xs mb-3 object-cover"
                />
                <span className="text-gray-700 text-center text-sm">Upload a clear, front-facing photo standing straight</span>
              </div>
            </div>
            
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} className="py-16 md:py-20 bg-gradient-to-br from-purple-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10 md:mb-12 flex items-center justify-center gap-2">
              <FaStar className="text-yellow-400" /> Why Choose VirtuFit360?
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: <FaMagic className="text-4xl text-indigo-500" />,
                  title: 'Instant Virtual Try-On',
                  desc: 'See yourself in any outfit before you buy. Try on clothing virtually with AI-powered technology.'
                },
                {
                  icon: <FaTshirt className="text-4xl text-purple-500" />,
                  title: 'Wide Range of Styles',
                  desc: 'Browse a curated collection of traditional and modern Pakistani wear for every occasion.'
                },
                {
                  icon: <FaSmileBeam className="text-4xl text-pink-500" />,
                  title: 'Personalized Color Recommendations',
                  desc: 'We recommend outfit colors that match your skin tone for your best look.'
                },

                {
                  icon: <FaRegSmileWink className="text-4xl text-yellow-400" />,
                  title: 'Share Your Look',
                  desc: 'Easily share your virtual try-on with friends and family.'
                },
                {
                  icon: <FaMobileAlt className="text-4xl text-blue-500" />,
                  title: 'Mobile Friendly',
                  desc: 'Try on and shop from any device, anywhere.'
                }
              ].map((f, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 * idx }} className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center">
                  <div className="mb-3">{f.icon}</div>
                  <h3 className="text-lg font-bold text-indigo-700 mb-1 text-center">{f.title}</h3>
                  <p className="text-gray-600 text-center">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        

        {/* CTA Section */}
        <section className="bg-indigo-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Try It Yourself?</h2>
            <p className="text-xl mb-8 text-indigo-100 max-w-3xl mx-auto">
              Join thousands of satisfied customers who found their perfect fit with VirtuFit360.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
            >
              Start Your Virtual Fitting
            </Link>
          </div>
        </section>
      </div>
    </ClientPage>
  );
};

export default Home;
