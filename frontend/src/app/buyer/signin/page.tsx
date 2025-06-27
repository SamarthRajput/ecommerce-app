// components/BuyerLogin.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';

const API_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const API_BASE_URL = `${API_BACKEND_URL}/buyer`;

interface LoginFormData {
  email: string;
  password: string;
}

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface LoginResponse {
  message: string;
  buyer: User;
  token: string;
}

const BuyerLogin = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: 'rohitkuyada@gmail.com',
    password: '12345678',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { refetch } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('buyerToken', data.token);
      localStorage.setItem('buyerId', data.buyer._id);

      refetch();
      router.push('/buyer/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/buyer/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/buyer/signup');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center mb-6">
            <button
              onClick={handleBackToHome}
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <span className="text-blue-600">Trade</span>Connect
            </button>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Buyer Portal Login
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={handleSignUp}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Register as a buyer
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyerLogin;