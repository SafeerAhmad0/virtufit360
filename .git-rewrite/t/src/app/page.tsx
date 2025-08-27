import React from 'react';
import Link from 'next/link';
import ClientPage from './client-page';

const Home = () => {
  return (
    <ClientPage>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Experience Traditional Pakistani Wear in 3D
                </h1>
                <p className="text-lg md:text-xl text-gray-600">
                  Try on beautiful Pakistani outfits virtually with our AI-powered platform. 
                  See how you'll look before you buy!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center justify-center px-6 py-3 sm:px-8 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-lg transition-colors duration-200"
                  >
                    Start Shopping
                  </Link>
                  <Link 
                    href="/about-us" 
                    className="inline-flex items-center justify-center px-6 py-3 sm:px-8 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-3 md:text-lg transition-colors duration-200"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="relative h-80 md:h-96 bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center p-6 md:p-8">
                    <div className="text-5xl md:text-6xl mb-3 md:mb-4">👗</div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Virtual Try-On</h3>
                    <p className="text-gray-600 mt-1 md:mt-2">See yourself in traditional attire instantly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10 md:mb-12">
              Why Choose VirtuFit360?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '✨',
                  title: 'Realistic Visualization',
                  description: 'Our advanced AI shows you exactly how outfits will look on your body type.'
                },
                {
                  icon: '📱',
                  title: 'Easy to Use',
                  description: 'Simple interface that works on any device. No special equipment needed.'
                },
                {
                  icon: '🔄',
                  title: 'Reduce Returns',
                  description: 'Know exactly what you\'re getting, leading to fewer returns and happier customers.'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
