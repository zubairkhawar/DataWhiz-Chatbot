"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "@/lib/auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="relative w-full max-w-md p-0 rounded-3xl shadow-2xl bg-transparent">
        {/* Animated gradient border */}
        <div className="pointer-events-none absolute -inset-1 rounded-3xl z-0 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 opacity-70 blur-sm animate-pulse" />
        {/* Animated gradient accent bar */}
        <div className="absolute left-8 right-8 top-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse rounded-b-xl opacity-80 z-10" />
        <div className="relative z-10 w-full p-10 bg-gray-900/80 backdrop-blur-xl rounded-3xl flex flex-col items-center gap-6 border border-white/10">
          <span className="mb-2">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="signin-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="#60A5FA" /><stop offset="1" stopColor="#818CF8" /></linearGradient></defs><rect x="6" y="6" width="36" height="36" rx="10" fill="url(#signin-gradient)" /><path d="M24 34V14M24 14l-7 7m7-7l7 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 mb-2 tracking-tight drop-shadow-lg">Sign In to DataWhiz</h1>
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>
            <AnimatePresence>
              {error && (
                <motion.div
                  className="text-red-500 text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white font-bold text-lg shadow-lg transition-all duration-200 border-none flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <motion.span
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-label="Loading"
                />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <p className="mt-2 text-center text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-400 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 