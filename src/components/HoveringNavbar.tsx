"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaShoppingBag, FaUser, FaEnvelope, FaQuestionCircle, FaShoppingCart, FaMagic, FaPalette } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaCrown, FaBoxOpen, FaPlusSquare } from "react-icons/fa";
import { useState } from "react";
const navItems = [
  { name: "Home", href: "/", icon: <FaHome size={26} /> },
  { name: "Shop", href: "/shop", icon: <FaShoppingBag size={26} /> },
  { name: "Cart", href: "/cart", icon: <FaShoppingCart size={26} /> },
  { name: "Try\u2011On", href: "/try-on", icon: <FaMagic size={26} /> },
  { name: "StyleMatch", href: "/stylematch", icon: <FaPalette size={26} /> },
  { name: "About", href: "/about-us", icon: <FaUser size={26} /> },
  { name: "Contact", href: "/contact-us", icon: <FaEnvelope size={26} /> },
  { name: "FAQs", href: "/faqs", icon: <FaQuestionCircle size={26} /> },
];

const HoveringNavbar = () => {
  const { user, profile, loading, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const isAdmin = profile && (profile.role === 'admin' || profile.is_admin);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug output to help diagnose admin/profile issues
  if (typeof window !== 'undefined') {
    console.log('NAVBAR DEBUG:', { user, profile, loading });
  }
  if (loading) return null; // Don't render navbar until profile is loaded

  // Signup handler
  const handleEmailSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setError("");
    try {
      const { signUpWithEmail } = await import("../lib/auth");
      const { error } = await signUpWithEmail(email, password);
      if (error) setError(error.message);
      else {
        setShowLogin(false);
        setShowSignup(false);
      }
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
    
  };

  // Import auth logic dynamically to avoid SSR issues
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    try {
      const { signInWithEmail } = await import("../lib/auth");
      const { error } = await signInWithEmail(email, password);
      if (error) setError(error.message);
      else setShowLogin(false);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
    
  };

  const handleGoogleLogin = async () => {
    
    setError("");
    try {
      const { signInWithGoogle } = await import("../lib/auth");
      await signInWithGoogle();
      setShowLogin(false);
    } catch (err: any) {
      setError(err.message || "Google login failed");
    }
    
  };


  return (
    <>
      {/* Top left login/logout */}
      <div className="fixed top-10 left-6 z-50">
        {user ? (
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-xl border border-indigo-100 transition-all">
            <span className="flex items-center gap-2 text-indigo-700 font-semibold text-base">
              <span className="bg-gradient-to-br from-indigo-400 via-purple-400 to-indigo-600 rounded-full w-8 h-8 flex items-center justify-center shadow">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff" opacity=".25"/><path d="M12 12c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="#6366f1"/><path d="M12 14c-2.67 0-8 1.337-8 4v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.663-5.33-4-8-4z" fill="#6366f1" opacity=".3"/></svg>
              </span>
              <span className="truncate max-w-[90px]">
                {user.user_metadata?.name
                  ? user.user_metadata.name
                  : user.email?.split('@')[0]}
              </span>
            </span>
            <a
              className="ml-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white text-xs font-bold shadow hover:scale-105 hover:from-indigo-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer select-none"
              tabIndex={0}
              onClick={() => setShowLogoutModal(true)}
              role="button"
            >Logout</a>
          </div>
        ) : (
          <a
            className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 text-white text-base font-bold shadow-2xl hover:scale-105 hover:from-indigo-500 hover:to-purple-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer select-none glassy-navbar-login"
            tabIndex={0}
            onClick={() => setShowLogin(true)}
            role="button"
            aria-label="Open login/signup modal"
          >
            <svg className="inline-block" width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#a5b4fc" opacity="0.3"/><path d="M12 12c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="#fff"/><path d="M12 14c-2.67 0-8 1.337-8 4v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.663-5.33-4-8-4z" fill="#fff" opacity=".3"/></svg>
            <span className="drop-shadow font-extrabold tracking-tight">Login / Signup</span>
          </a>
        )}
      </div>
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-white/90 via-indigo-50/90 to-purple-100/90 rounded-3xl p-8 shadow-2xl w-[370px] border border-indigo-100 flex flex-col items-center animate-fade-in">
            <a
              className="absolute top-3 right-3 text-indigo-400 hover:text-indigo-700 bg-white/70 rounded-full p-1.5 shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
              tabIndex={0}
              onClick={() => setShowLogin(false)}
              aria-label="Close login/signup modal"
              role="button"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </a>
            <div className="flex justify-center items-center w-full mb-5 gap-2">
              <a
                className={`flex-1 text-center py-2 rounded-xl font-bold text-lg transition-all duration-300 cursor-pointer select-none ${!showSignup ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 text-white shadow-lg scale-105' : 'text-indigo-500 bg-white/70'}`}
                tabIndex={0}
                onClick={() => setShowSignup(false)}
                role="tab"
                aria-selected={!showSignup}
              >Login</a>
              <a
                className={`flex-1 text-center py-2 rounded-xl font-bold text-lg transition-all duration-300 cursor-pointer select-none ${showSignup ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 text-white shadow-lg scale-105' : 'text-indigo-500 bg-white/70'}`}
                tabIndex={0}
                onClick={() => setShowSignup(true)}
                role="tab"
                aria-selected={showSignup}
              >Signup</a>
            </div>
            <div className="w-full transition-all duration-500">
              {!showSignup ? (
                <form className="flex flex-col gap-3 w-full" onSubmit={e => { e.preventDefault(); handleEmailLogin(e); }}>
                  <input type="email" placeholder="Email" className="border border-indigo-200 bg-white/70 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-300 outline-none transition-all text-indigo-900 placeholder-indigo-300" value={email} onChange={e => setEmail(e.target.value)} required />
                  <input type="password" placeholder="Password" className="border border-indigo-200 bg-white/70 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-300 outline-none transition-all text-indigo-900 placeholder-indigo-300" value={password} onChange={e => setPassword(e.target.value)} required />
                  <a
                    className="block text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white rounded-xl px-3 py-2 mt-2 font-bold shadow hover:scale-105 hover:from-indigo-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-60 cursor-pointer select-none"
                    tabIndex={0}
                    role="button"
                    onClick={handleEmailLogin}
                  >{loading ? 'Logging in...' : 'Login'}</a>
                  {error && <span className="text-red-500 text-xs text-center mt-1">{error}</span>}
                </form>
              ) : (
                <form className="flex flex-col gap-3 w-full" onSubmit={e => { e.preventDefault(); handleEmailSignup(e); }}>
                  <input type="email" placeholder="Email" className="border border-indigo-200 bg-white/70 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-300 outline-none transition-all text-indigo-900 placeholder-indigo-300" value={email} onChange={e => setEmail(e.target.value)} required />
                  <input type="password" placeholder="Password" className="border border-indigo-200 bg-white/70 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-300 outline-none transition-all text-indigo-900 placeholder-indigo-300" value={password} onChange={e => setPassword(e.target.value)} required />
                  <a
                    className="block text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white rounded-xl px-3 py-2 mt-2 font-bold shadow hover:scale-105 hover:from-indigo-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-60 cursor-pointer select-none"
                    tabIndex={0}
                    role="button"
                    onClick={handleEmailSignup}
                  >{loading ? 'Signing up...' : 'Signup'}</a>
                  {error && <span className="text-red-500 text-xs text-center mt-1">{error}</span>}
                </form>
              )}
            </div>
            <div className="my-4 text-center text-gray-500 text-sm font-medium w-full flex items-center gap-2">
              <span className="flex-1 border-t border-indigo-100"></span>
              or
              <span className="flex-1 border-t border-indigo-100"></span>
            </div>
            <a
              className="w-full bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 text-white rounded-xl px-3 py-2 font-bold shadow-lg hover:scale-105 hover:from-red-500 hover:to-yellow-500 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-200 cursor-pointer select-none"
              tabIndex={0}
              onClick={handleGoogleLogin}
              role="button"
            >
              <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.37 1.53 7.83 2.81l5.77-5.77C34.36 3.54 29.68 1.5 24 1.5 14.82 1.5 6.97 7.94 3.44 16.03l6.85 5.32C12.06 15.27 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.44-4.74H24v9.04h12.44c-.54 2.9-2.17 5.36-4.62 7.01l7.1 5.51C43.9 37.4 46.1 31.41 46.1 24.55z"/><path fill="#FBBC05" d="M10.29 28.09c-1.01-2.97-1.01-6.21 0-9.18l-6.85-5.32C1.28 17.68 0 20.72 0 24s1.28 6.32 3.44 10.41l6.85-5.32z"/><path fill="#EA4335" d="M24 46.5c6.48 0 11.92-2.14 15.9-5.84l-7.1-5.51c-1.98 1.34-4.51 2.14-8.8 2.14-6.44 0-11.94-5.77-13.71-13.85l-6.85 5.32C6.97 40.06 14.82 46.5 24 46.5z"/></g></svg>
              Continue with Google
            </a>
          </div>
        </div>
      )}
      <nav
        className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-1/2 md:-translate-x-1/2 z-50 rounded-t-3xl md:rounded-3xl bg-gradient-to-r from-indigo-100/90 via-white/90 to-purple-100/90 shadow-2xl border border-gray-200 flex flex-col md:flex-row items-center justify-between px-4 py-2 md:px-8 md:py-1.5 w-full md:max-w-6xl backdrop-blur-xl"
        style={{
          boxShadow: "0 8px 36px 0 rgba(80, 80, 140, 0.15)",
        }}
      >
        {/* Mobile Header */}
        <div className="w-full flex items-center justify-between md:hidden">
          <Link href="/" className="flex items-center gap-2 select-none group">
            <span className="text-xl font-extrabold text-indigo-700 tracking-tight group-hover:scale-105 transition-transform">VirtuFit360</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-indigo-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} flex-col w-full md:hidden mt-4 space-y-4 pb-4`}>
          {navItems.concat(user ? [{ name: "History", href: "/history", icon: <FaMagic size={26} /> }] : []).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                  isActive
                    ? "text-indigo-700 bg-white shadow-md"
                    : "text-gray-600 hover:text-indigo-700 hover:bg-white/50"
                }`}
              >
                <div className="relative">
                  {item.name === "Cart" && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                  {item.icon}
                </div>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2 select-none group">
          <span className="text-2xl font-extrabold text-indigo-700 tracking-tight group-hover:scale-105 transition-transform">VirtuFit360</span>
        </Link>
        <div className="flex-grow flex items-center justify-center space-x-1">
          {navItems.concat(user ? [{ name: "History", href: "/history", icon: <FaMagic size={26} /> }] : []).map((item) => {
            const isActive = pathname === item.href;
            if (item.name === "Cart") {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex flex-col items-center px-3 sm:px-5 py-1 rounded-xl transition-all duration-150
                    ${isActive ? "bg-indigo-200/80 text-indigo-800 font-bold shadow-lg scale-105" : "text-gray-700 hover:bg-indigo-100/60 hover:text-indigo-700"}
                  `}
                  aria-label={item.name}
                >
                  <span className="relative">
                    {item.icon}
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                        {cartCount}
                      </span>
                    )}
                  </span>
                  <span className="text-xs sm:text-sm mt-1 font-semibold tracking-tight leading-none">
                    {item.name}
                  </span>
                </Link>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center px-3 sm:px-5 py-1 rounded-xl transition-all duration-150
                  ${isActive ? "bg-indigo-200/80 text-indigo-800 font-bold shadow-lg scale-105" : "text-gray-700 hover:bg-indigo-100/60 hover:text-indigo-700"}
                `}
                aria-label={item.name}
              >
                {item.icon}
                <span className="text-xs sm:text-sm mt-1 font-semibold tracking-tight leading-none whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            );
          })}
          {/* Admin Dropdown */}
          {isAdmin && (
            <div className="relative ml-2">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                onClick={() => setShowAdminMenu((v) => !v)}
                aria-haspopup="true"
                aria-expanded={showAdminMenu}
              >
                <FaCrown className="text-black mr-1" size={22} />
                <p className="text-black">Admin</p>
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {showAdminMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-indigo-100 rounded-xl shadow-2xl z-50 animate-fade-in">
                  <Link
                    href="/admin/stock"
                    className="flex items-center gap-2 px-4 py-3 text-indigo-700 hover:bg-indigo-50 rounded-t-xl font-semibold transition-all"
                    onClick={() => setShowAdminMenu(false)}
                  >
                    <FaBoxOpen className="text-indigo-500" />
                    Manage Stock
                  </Link>
                  <Link
                    href="/admin/add-image"
                    className="flex items-center gap-2 px-4 py-3 text-indigo-700 hover:bg-indigo-50 font-semibold transition-all"
                    onClick={() => setShowAdminMenu(false)}
                  >
                    <FaPlusSquare className="text-purple-500" />
                    Add Images to Shop
                  </Link>
                  {/* Add more admin links here */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </nav>
      {/* Spacer to prevent overlap with floating navbar */}
      <div className="h-20 bg-transparent" aria-hidden="true"></div>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <a
                tabIndex={0}
                role="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition cursor-pointer select-none"
              >
                Cancel
              </a>
              <a
                tabIndex={0}
                role="button"
                onClick={() => { setShowLogoutModal(false); logout(); }}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow hover:scale-105 transition cursor-pointer select-none"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HoveringNavbar;
