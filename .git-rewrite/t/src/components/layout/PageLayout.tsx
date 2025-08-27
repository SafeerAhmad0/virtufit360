import React from 'react';
import { Geist_Sans, Geist_Mono } from 'geist/font';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  description, 
  children,
  className = '' 
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${Geist_Sans.variable} ${Geist_Mono.variable} font-sans`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-3xl mx-auto text-xl text-gray-600">
              {description}
            </p>
          )}
        </div>
        <div className={`bg-white shadow-xl rounded-2xl p-6 sm:p-8 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
