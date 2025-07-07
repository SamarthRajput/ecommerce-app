"use client";
import React, { useState } from "react";

const ResetSellerPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
  const API_BASE_URL = `${API_BACKEND_URL}/seller`;

  // Get token from URL safely (works only on client)
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setToken(searchParams.get("token"));
      setMounted(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

        try {
          const response = await fetch(`${API_BASE_URL}/resetPassword?token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword: password }),
          });
    
          const data = await response.json();
          if (response.ok) {
            setMessage(data.message || "Password reset successful.");
            setSuccess(true);
            setPassword("");
            setConfirmPassword("");
          } else {
            setMessage(data.error || "An error occurred. Please try again.");
          }
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };
      
      if (!mounted) {
        return null;
      }
    
      if (!token) {
        return (
          <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Invalid Token</h2>
              <p className="text-red-500">Invalid Url</p>
              <p className="text-sm mt-4">
                Please{" "}
                <a href="/seller/forgot-password" className="text-blue-600 hover:underline">
                  request a new password reset link
                </a>
                .
              </p>
            </div>
          </section>
        );
      }
    
      return (
        <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  autoComplete="new-password"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  minLength={8}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  autoComplete="new-password"
                />
              </div>
              {message && (
                <p className={`text-sm mb-4 ${success ? "text-green-600" : "text-red-500"}`}>{message}</p>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={success || loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </section>
      );
    }
  

export default ResetSellerPassword;
