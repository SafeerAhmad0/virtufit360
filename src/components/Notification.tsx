"use client";
import { useEffect } from "react";

interface NotificationProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function Notification({ message, show, onClose }: NotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 1800);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-6 left-6 z-[100]">
      <div className="flex items-center gap-3 px-5 py-3 bg-indigo-600 text-white rounded-xl shadow-lg animate-slide-in-left">
        <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="font-semibold text-base">{message}</span>
      </div>
      <style jsx>{`
        .animate-slide-in-left {
          animation: slideInLeft 0.5s cubic-bezier(0.39, 0.575, 0.565, 1) both;
        }
        @keyframes slideInLeft {
          0% { transform: translateX(-60px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
