"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaShoppingBag, FaUser, FaEnvelope, FaQuestionCircle } from "react-icons/fa";

import { FaMagic } from "react-icons/fa";
const navItems = [
  { name: "Home", href: "/", icon: <FaHome size={26} /> },
  { name: "Shop", href: "/shop", icon: <FaShoppingBag size={26} /> },
  { name: "Try-On", href: "/try-on", icon: <FaMagic size={26} /> },
  { name: "About", href: "/about-us", icon: <FaUser size={26} /> },
  { name: "Contact", href: "/contact-us", icon: <FaEnvelope size={26} /> },
  { name: "FAQs", href: "/faqs", icon: <FaQuestionCircle size={26} /> },
];

const HoveringNavbar = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-white/90 shadow-xl border border-gray-200 flex justify-between items-center px-10 py-2 max-w-3xl w-full backdrop-blur-sm"
      style={{
        boxShadow: "0 4px 32px 0 rgba(80, 80, 140, 0.10)",
      }}
    >
      <div
        className="pointer-events-auto flex justify-center items-center gap-1 sm:gap-4 px-8 py-2 rounded-2xl"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center px-3 sm:px-5 py-1 rounded-xl transition-colors duration-150
                ${isActive ? "bg-indigo-200/70 text-indigo-800 font-semibold shadow-md" : "text-gray-700 hover:bg-indigo-50/70 hover:text-indigo-700"}
              `}
              aria-label={item.name}
            >
              {item.icon}
              <span className="text-xs sm:text-sm mt-1 font-medium tracking-tight leading-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default HoveringNavbar;
