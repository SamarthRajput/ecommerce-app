"use client";
import React from 'react';
import { Check } from 'lucide-react';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section5 from './Section5';
import useSignup from '@/hooks/useSellerSignup';

// Business type options
export const businessTypeOptions = [
    { value: 'individual', label: 'Individual' },
    { value: 'proprietorship', label: 'Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
    { value: 'private_limited', label: 'Private Limited Company' },
    { value: 'public_limited', label: 'Public Limited Company' },
    { value: 'ngo', label: 'NGO/Non-Profit' },
    { value: 'government_entity', label: 'Government Entity' },
    { value: 'other', label: 'Other' }
];

export const industryOptions = [
    'Agriculture', 'Manufacturing', 'Technology', 'Healthcare', 'Education',
    'Financial Services', 'Real Estate', 'Retail', 'Transportation', 'Energy',
    'Construction', 'Food & Beverage', 'Textiles', 'Chemicals', 'Automotive'
];

export const yearsInBusinessOptions = [
    { value: 1, label: 'Less than 1 year' },
    { value: 2, label: '1-3 years' },
    { value: 3, label: '3-5 years' },
    { value: 4, label: '5-10 years' },
    { value: 5, label: '10+ years' }
];

const SellerRegistrationForm = () => {
    const {
        formData,
        errors,
        loading,
        handleInputChange,
        handleFileUpload,
        currentSection,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        nextSection,
        prevSection,
        handleSubmit
    } = useSignup();

    const sectionTitles = [
        { title: 'Account Setup', subtitle: 'Create your seller account' },
        { title: 'Business Details', subtitle: 'Tell us about your business' },
        { title: 'Documentation', subtitle: 'Upload required documents' },
        { title: 'Profile Setup', subtitle: 'Complete your seller profile' },
        { title: 'Review & Submit', subtitle: 'Review and finalize registration' }
    ];

    const renderProgressBar = () => (
        <div className="mb-6 lg:mb-8">
            <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentSection - 1) / 4) * 100}%` }}
                    />
                </div>

                {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className="flex flex-col items-center relative">
                        <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-sm lg:text-base font-semibold border-2 transition-all duration-300 ${step < currentSection
                            ? 'bg-green-500 border-green-500 text-white shadow-lg'
                            : step === currentSection
                                ? 'bg-blue-500 border-blue-500 text-white shadow-lg ring-4 ring-blue-100'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            {step < currentSection ? <Check size={16} className="lg:text-lg" /> : step}
                        </div>

                        {/* Step labels - hidden on small screens, shown on medium+ */}
                        <div className="hidden md:block mt-3 text-center">
                            <div className={`text-xs lg:text-sm font-medium ${step <= currentSection ? 'text-gray-800' : 'text-gray-400'
                                }`}>
                                {sectionTitles[step - 1].title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile step indicator */}
            <div className="md:hidden mt-6 text-center">
                <div className="text-sm font-medium text-gray-600">
                    Step {currentSection} of 5
                </div>
                <div className="text-lg font-semibold text-gray-900 mt-1">
                    {sectionTitles[currentSection - 1].title}
                </div>
                <div className="text-sm text-gray-500">
                    {sectionTitles[currentSection - 1].subtitle}
                </div>
            </div>
        </div>
    );

    const renderCurrentSection = () => {
        switch (currentSection) {
            case 1: return <Section1 formData={formData} errors={errors} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} loading={loading} handleInputChange={handleInputChange} />;
            case 2: return <Section2 formData={formData} errors={errors} handleInputChange={handleInputChange} businessTypeOptions={businessTypeOptions} industryOptions={industryOptions} yearsInBusinessOptions={yearsInBusinessOptions} />;
            case 3: return <Section3 formData={formData} errors={errors} handleInputChange={handleInputChange} handleFileUpload={handleFileUpload} />;
            case 4: return <Section4 formData={{ ...formData, yearsInBusiness: typeof formData.yearsInBusiness === 'string' ? Number(formData.yearsInBusiness) : formData.yearsInBusiness }} errors={errors} handleInputChange={handleInputChange} industryOptions={industryOptions} yearsInBusinessOptions={yearsInBusinessOptions} />;
            case 5: return <Section5 formData={formData} errors={errors} handleInputChange={handleInputChange} businessTypeOptions={businessTypeOptions} />;
            default: return <Section1 formData={formData} errors={errors} showPassword={showPassword} setShowPassword={setShowPassword} showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword} loading={loading} handleInputChange={handleInputChange} />;
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                {/* Main content */}
                <main className="py-6 lg:py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Welcome section for desktop */}
                        <div className="hidden md:block text-center mb-8 lg:mb-12">
                            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
                                Join TradeConnect as a Seller
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Connect with thousands of buyers and grow your business with our trusted marketplace platform
                            </p>
                        </div>

                        {/* Registration form card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Card header - mobile friendly */}
                            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                                <div className="text-center">
                                    <div className="md:hidden mb-4">
                                        <h1 className="text-2xl font-bold text-white mb-2">TradeConnect</h1>
                                        <p className="text-blue-100 text-sm">Seller Registration</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                                            Seller Registration
                                        </h3>
                                        <p className="text-blue-100">
                                            Complete the steps below to become a verified seller
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress section */}
                            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 bg-gray-50 border-b border-gray-100">
                                {renderProgressBar()}
                            </div>

                            {/* Form content with better spacing */}
                            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                                <div className="max-w-3xl mx-auto">
                                    {renderCurrentSection()}
                                </div>
                            </div>

                            {/* Navigation with improved mobile layout */}
                            <div className="px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 border-t border-gray-100">
                                <div className="max-w-3xl mx-auto">
                                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                                        <button
                                            onClick={prevSection}
                                            disabled={currentSection === 1}
                                            className="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 focus:ring-2 focus:ring-gray-200"
                                        >
                                            Previous
                                        </button>

                                        {/* Progress text for mobile */}
                                        <div className="sm:hidden order-1 text-center">
                                            <span className="text-sm text-gray-500">
                                                Step {currentSection} of 5
                                            </span>
                                        </div>

                                        {currentSection === 5 ? (
                                            <button
                                                onClick={handleSubmit}
                                                disabled={loading || !formData.agreedToTerms}
                                                className="w-full sm:w-auto order-3 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 focus:ring-2 focus:ring-green-200 shadow-lg"
                                            >
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    'Submit Registration'
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={nextSection}
                                                className="w-full sm:w-auto order-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 focus:ring-2 focus:ring-blue-200 shadow-lg"
                                            >
                                                Continue
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sign in section with better styling */}
                        <div className="text-center mt-8 lg:mt-12">
                            <div className="bg-white rounded-xl border border-gray-200 px-6 py-4 inline-block shadow-sm">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <a
                                        href="/seller/signin"
                                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                                    >
                                        Sign in here
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-8 lg:mt-16">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Verified Sellers</h4>
                                    <p className="text-gray-600 text-sm">All sellers go through our verification process</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Fast Setup</h4>
                                    <p className="text-gray-600 text-sm">Get your store up and running in minutes</p>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h4>
                                    <p className="text-gray-600 text-sm">Our team is here to help you succeed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default SellerRegistrationForm;
