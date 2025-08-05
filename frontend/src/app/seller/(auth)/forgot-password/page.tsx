"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { toast } from 'sonner';
import { APIURL } from '@/src/config/env';

const API_BASE_URL = `${APIURL}/seller`;

const ForgotPassword = () => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { authenticated, isSeller } = useAuth();

    useEffect(() => {
        // toast.success('If you have an account, please enter your email to receive a password reset link.');
        if (authenticated && isSeller) {
            window.location.href = '/seller/dashboard';
        }
    }, [authenticated, isSeller]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/forgotPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Reset link sent. Please check your email.');
                setEmail('');
            } else {
                setMessage(data.message || 'An error occurred. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred while sending the reset link. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
                    {/* Link to go back to login page */}
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                        Remembered your password?{' '}
                        <a href="/seller/login" className="text-blue-600 hover:underline">
                            Login
                        </a>
                    </p>
                    <form onSubmit={handleSubmit} aria-busy={loading}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                disabled={loading}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                    {message && (
                        <p className="mt-4 text-green-600 dark:text-green-400" role="alert">
                            {message}
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ForgotPassword;
