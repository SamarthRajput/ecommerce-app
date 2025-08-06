import React from 'react';
import { Clock, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const AccountUnderReview = ({ email }: { email: string }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                {/* Icon */}
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                    <Clock className="w-8 h-8 text-orange-600 animate-pulse" />
                </div>

                {/* Main Content */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Account Under Review
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Thank you for submitting your application! Our team is carefully reviewing your account details to ensure everything meets our standards.
                </p>

                {/* Timeline */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Review Process
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Application submitted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            <span>Under review (current)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            <span>Account approval</span>
                        </div>
                    </div>
                </div>

                {/* Estimated Time */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-blue-800 mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium text-sm">Estimated Review Time</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                        Typically 1-3 business days
                    </p>
                </div>

                {/* Contact Info */}
                <div className="border-t pt-4">
                    <p className="text-gray-600 text-sm mb-3">
                        You'll receive an email notification once your account is approved.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-orange-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {email || 'your registered email'}
                        </span>
                    </div>
                </div>

                {/* Support Link */}
                {/* <div className="mt-6 pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2">
                        Have questions about your application?
                    </p>
                    <button className="text-orange-600 hover:text-orange-700 text-sm font-medium underline">
                        Contact Support
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default AccountUnderReview;