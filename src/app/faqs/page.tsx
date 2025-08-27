'use client';

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

type FAQItem = {
  question: string;
  answer: React.ReactNode;
  category: 'general' | 'technical' | 'account' | 'orders';
};

const faqs: FAQItem[] = [
  {
    question: 'What is VirtuFit360?',
    answer: 'VirtuFit360 is an innovative virtual try-on platform that uses advanced AI and computer vision to let you see how traditional Pakistani outfits will look on you before making a purchase. Our technology provides a realistic preview of how the clothing will fit and drape on your body.',
    category: 'general',
  },
  {
    question: 'How does the virtual try-on work?',
    answer: 'Our platform uses sophisticated computer vision algorithms to map your body measurements from photos or videos. The AI then applies the selected clothing items to your image in real-time, accounting for factors like fabric drape, fit, and movement to give you a realistic preview.',
    category: 'technical',
  },
  {
    question: 'What do I need to use VirtuFit360?',
    answer: 'To get started, you\'ll need a smartphone or computer with a camera and an internet connection. For best results, ensure good lighting, stand against a plain background, and wear form-fitting clothing when taking reference photos or videos.',
    category: 'technical',
  },
  {
    question: 'How accurate are the virtual try-ons?',
    answer: 'Our AI provides highly accurate visualizations, typically within 95-98% accuracy for fit and drape. However, please note that colors may appear slightly different on various screens. We recommend checking the size guide for each item and reading product descriptions carefully.',
    category: 'technical',
  },
  {
    question: 'Is my personal data secure?',
    answer: 'Absolutely. We take your privacy seriously. All images and measurements are encrypted and stored securely. We comply with global data protection regulations and will never share your personal information with third parties without your explicit consent.',
    category: 'account',
  },
  {
    question: 'How do I create an account?',
    answer: 'Creating an account is easy! Click on the "Sign Up" button in the top-right corner, enter your email address, create a password, and follow the verification steps. You can also sign up using your Google or Facebook account for faster access.',
    category: 'account',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 14-day return policy for unworn, unwashed items with original tags attached. Due to hygiene reasons, certain items like innerwear and accessories are not eligible for return unless they are defective. Please refer to our Returns & Exchanges page for detailed information.',
    category: 'orders',
  },
  {
    question: 'How long does shipping take?',
    answer: 'For domestic orders within Pakistan, delivery typically takes 3-5 business days. International shipping times vary by destination but generally take 7-14 business days. You\'ll receive tracking information once your order ships.',
    category: 'orders',
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Section Header */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Frequently Asked Questions</h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto opacity-90">
            Find answers to the most common questions about VirtuFit360, our technology, and your orders.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4">
          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto space-y-7">
            {faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 border-2 ${
                    activeIndex === index ? 'border-indigo-400 bg-white/95 ring-2 ring-indigo-200' : 'border-gray-200 bg-white hover:shadow-xl'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between px-7 py-6 text-left focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors group"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={activeIndex === index}
                    aria-controls={`faq-${index}`}
                  >
                    <span className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                      {faq.question}
                    </span>
                    <span className={`transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-indigo-600' : 'text-gray-400'}`}>
                      <FiChevronDown className="w-7 h-7" />
                    </span>
                  </button>
                  <div
                    id={`faq-${index}`}
                    className={`px-7 transition-all duration-300 ease-in-out overflow-hidden text-gray-700 ${
                      activeIndex === index ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                    }`}
                    aria-hidden={activeIndex !== index}
                  >
                    <div className="prose prose-indigo max-w-none">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600">We couldn&apos;t find any questions in this category.</p>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-indigo-50 rounded-2xl p-8 md:p-12 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Our support team is here to help you with any questions you might have about our platform or services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact-us"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@virtufit360.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
