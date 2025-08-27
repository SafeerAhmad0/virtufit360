'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Footer = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Don't show footer on certain pages if needed
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact Us', href: '/contact-us' },
    { name: 'FAQs', href: '/faqs' },
  ];

  const legalLinks = [
    { name: 'Terms & Conditions', href: '/terms-conditions' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
  ];

  const currentYear = new Date().getFullYear();

  // Don't render anything on the server
  if (!mounted) {
    return null;
  }

  return (
    <footer className={`bg-gray-900 text-white ${isMobile ? 'fixed bottom-0 left-0 right-0' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Footer */}
        {!isMobile && (
          <div className="py-12 md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:order-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-300 hover:text-white transition-colors ${
                    pathname === item.href ? 'font-semibold text-white' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; {currentYear} VirtuFit360. All rights reserved.
              </p>
              <div className="flex justify-center space-x-6 mt-2">
                {legalLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Footer */}
        {isMobile && (
          <div className="py-3">
            <div className="flex justify-around">
              {navigation.slice(0, 3).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center text-xs px-2 py-1 ${
                    pathname === item.href ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <span className="block text-center">
                    {item.name}
                  </span>
                </Link>
              ))}
              <div className="relative group">
                <button className="flex flex-col items-center text-xs px-2 py-1 text-gray-400">
                  <span>More</span>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-gray-800 rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                  {navigation.slice(3).concat(legalLinks).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-4 py-2 text-sm ${
                        pathname === item.href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">
              &copy; {currentYear} VirtuFit360
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
