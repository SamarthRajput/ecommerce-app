import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Shield, CheckCircle, Mail, Phone, AlertCircle, Clock, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Section1Props = {
    formData: {
        email: string;
        password: string;
        confirmPassword: string;
        phone: string;
        countryCode: string;
    };
    errors: { [key: string]: string };
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (show: boolean) => void;
    loading: boolean;
    handleInputChange: (field: string, value: any) => void;
};

// Email validation
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone validation
const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

// Password strength validation
const validatePassword = (password: string) => {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score, isValid: score >= 4 };
};

const Section1: React.FC<Section1Props> = ({
    formData,
    errors,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    handleInputChange,
}) => {
    const [emailValid, setEmailValid] = useState(false);
    const [phoneValid, setPhoneValid] = useState(false);
    type PasswordChecks = {
        length: boolean;
        uppercase: boolean;
        lowercase: boolean;
        number: boolean;
        special: boolean;
    };
    const [passwordStrength, setPasswordStrength] = useState<{ checks: PasswordChecks; score: number; isValid: boolean }>({
        checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false,
        },
        score: 0,
        isValid: false,
    });

    const countryOptions = [
        { value: "+91", label: "🇮🇳 +91", country: "India" },
        { value: "+1", label: "🇺🇸 +1", country: "USA" },
        { value: "+44", label: "🇬🇧 +44", country: "UK" },
        { value: "+971", label: "🇦🇪 +971", country: "UAE" },
        { value: "+65", label: "🇸🇬 +65", country: "Singapore" },
    ];

    // Email validation effect
    useEffect(() => {
        setEmailValid(validateEmail(formData.email));
    }, [formData.email]);

    // Phone validation effect
    useEffect(() => {
        setPhoneValid(validatePhone(formData.phone));
    }, [formData.phone]);

    // Password strength effect
    useEffect(() => {
        setPasswordStrength(validatePassword(formData.password));
    }, [formData.password]);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                    <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Account & Verification</h2>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Create your secure seller account and verify your contact information
                    </p>
                </div>
            </div>

            {/* Email Section */}
            <div className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Email Address</h3>

                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Business Email Address *
                    </Label>
                    <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full pr-10 ${errors.email
                                ? 'border-red-500 focus:ring-red-500'
                                : emailValid
                                    ? 'border-green-500 focus:ring-green-500'
                                    : 'focus:ring-blue-500'
                                }`}
                            placeholder="Enter your business email address"
                        />

                    </div>
                    {errors.email && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.email}</AlertDescription>
                        </Alert>
                    )}
                    {!emailValid && formData.email && !errors.email && (
                        <p className="text-sm text-amber-600">Please enter a valid email address</p>
                    )}
                </div>
            </div>

            {/* Phone Verification Section */}
            <div className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Phone Verification</h3>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-1">
                        <Label htmlFor="countryCode" className="text-sm font-medium text-gray-700">
                            Country Code
                        </Label>
                        <select
                            id="countryCode"
                            value={formData.countryCode}
                            onChange={(e) => handleInputChange('countryCode', e.target.value)}
                            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm 
                                }`}
                        >
                            {countryOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="lg:col-span-3">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Phone Number *
                        </Label>
                        <div className="relative">
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={`w-full pr-10 ${errors.phone
                                    ? 'border-red-500 focus:ring-red-500'
                                    : phoneValid
                                        ? 'border-green-500 focus:ring-green-500'
                                        : 'focus:ring-blue-500'
                                    }`}
                                placeholder="Enter your 10-digit phone number"
                                maxLength={10}
                            />
                        </div>
                    </div>
                </div>

                {errors.phone && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.phone}</AlertDescription>
                    </Alert>
                )}
                {!phoneValid && formData.phone && !errors.phone && (
                    <p className="text-sm text-amber-600">Please enter a valid 10-digit phone number</p>
                )}
            </div>

            {/* Password Section */}
            <div className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Password Setup</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password *
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`w-full pr-10 ${errors.password
                                    ? 'border-red-500 focus:ring-red-500'
                                    : passwordStrength.isValid
                                        ? 'border-green-500 focus:ring-green-500'
                                        : 'focus:ring-blue-500'
                                    }`}
                                placeholder="Create a strong password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                        {errors.password && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.password}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                            Confirm Password *
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className={`w-full pr-10 ${errors.confirmPassword
                                    ? 'border-red-500 focus:ring-red-500'
                                    : formData.confirmPassword && formData.password === formData.confirmPassword
                                        ? 'border-green-500 focus:ring-green-500'
                                        : 'focus:ring-blue-500'
                                    }`}
                                placeholder="Re-enter your password"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700"
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                        {errors.confirmPassword && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.confirmPassword}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-3">Password Strength:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className={`flex items-center ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                At least 8 characters
                            </div>
                            <div className={`flex items-center ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Uppercase letter
                            </div>
                            <div className={`flex items-center ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Lowercase letter
                            </div>
                            <div className={`flex items-center ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Number
                            </div>
                            <div className={`flex items-center ${passwordStrength.checks.special ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Special character
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="flex w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.score <= 2 ? 'bg-red-500' :
                                        passwordStrength.score <= 3 ? 'bg-yellow-500' :
                                            'bg-green-500'
                                        }`}
                                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs mt-1 text-gray-600">
                                Strength: {
                                    passwordStrength.score <= 2 ? 'Weak' :
                                        passwordStrength.score <= 3 ? 'Medium' :
                                            'Strong'
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Section1;