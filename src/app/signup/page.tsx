"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signUp } from "@/lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password, confirmPassword, terms, firstName, lastName, username, avatar);
      router.push("/chat");
    } catch (err: any) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="relative w-full max-w-md p-0 rounded-3xl shadow-2xl bg-transparent flex items-center justify-center" style={{ minHeight: 'auto', height: 'auto' }}>
        {/* Animated gradient border */}
        <div className="pointer-events-none absolute -inset-1 rounded-3xl z-0 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 opacity-70 blur-sm animate-pulse" />
        {/* Animated gradient accent bar */}
        <div className="absolute left-8 right-8 top-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-pulse rounded-b-xl opacity-80 z-10" />
        <div className="relative z-10 w-full p-6 bg-gray-900/80 backdrop-blur-xl rounded-3xl flex flex-col items-center gap-4 border border-white/10" style={{ minHeight: 'auto', height: 'auto' }}>
          <span className="mb-2">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="signup-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="#60A5FA" /><stop offset="1" stopColor="#818CF8" /></linearGradient></defs><rect x="6" y="6" width="36" height="36" rx="10" fill="url(#signup-gradient)" /><path d="M24 14v14m0 0l-7-7m7 7l7-7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 mb-2 tracking-tight drop-shadow-lg">Sign Up for DataWhiz</h1>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">First Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Username <span className="text-gray-400 text-xs">(optional)</span></label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
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
                className="w-full px-3 py-2 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Avatar <span className="text-gray-400 text-xs">(optional)</span></label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 rounded-2xl bg-gray-800/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 shadow-inner transition"
                onChange={handleAvatarChange}
                disabled={loading}
              />
              {avatar && <div className="mt-2 text-cyan-300 font-medium">Selected: {avatar.name}</div>}
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={e => setTerms(e.target.checked)}
                className="mr-2 accent-blue-600"
                required
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm">I agree to the <span className="underline">terms and conditions</span></label>
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
              className="w-full py-3 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-200 border-none focus:outline-none"
              disabled={loading || !terms}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-2 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-400 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 