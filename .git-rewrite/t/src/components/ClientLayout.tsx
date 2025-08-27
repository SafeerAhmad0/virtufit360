'use client';

import { useEffect, useState } from 'react';
import HoveringNavbar from '../components/HoveringNavbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <main className="flex-grow">
        {children}
      </main>
      <HoveringNavbar />
    </>
  );
}
