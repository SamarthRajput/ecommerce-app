import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api/v1';
const API_URL = `${BACKEND_URL}/seller`;

const useSignup = () => {
    const [currentSection, setCurrentSection] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    const [formData, setFormData] = useState<{
        email: string;
        password: string;
        confirmPassword: string;
        phone: string;
        countryCode: string;

        firstName: string;
        lastName: string;
        businessName: string;
        businessType: string;
        registrationNo: string;
        taxId: string;
        panOrTin: string;
        country: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        website: string;
        linkedIn: string;

        govIdUrl: string | null;
        gstCertUrl: string | null;
        businessDocUrl: string | null;
        otherDocsUrl: string | null;

        companyBio: string;
        industryTags: string[];
        yearsInBusiness: string;
        keyProducts: string[];

        agreedToTerms: boolean;
    }>({
        // Section 1: Account & Verification
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        countryCode: '+91',

        // Section 2: Business Details
        firstName: '',
        lastName: '',
        businessName: '',
        businessType: 'individual',
        registrationNo: '',
        taxId: '',
        panOrTin: '',
        country: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        website: '',
        linkedIn: '',

        // Section 3: Documents
        govIdUrl: null,
        gstCertUrl: null,
        businessDocUrl: null,
        otherDocsUrl: null,

        // Section 4: Business Profile
        companyBio: '',
        industryTags: [],
        yearsInBusiness: '',
        keyProducts: [],

        // Section 5: Terms
        agreedToTerms: false
    });

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleFileUpload = async (field: string, file: File | null) => {
        if (!file) return;

        const validFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validFileTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                [field]: 'Invalid file type. Only JPG, PNG, and PDF are allowed.'
            }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setErrors(prev => ({
                ...prev,
                [field]: 'File size exceeds 5MB limit.'
            }));
            return;
        }

        setErrors(prev => ({
            ...prev,
            [field]: ''
        }));

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/upload-documents`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors(prev => ({
                    ...prev,
                    [field]: data.message || 'File upload failed'
                }));
                return;
            }

            if (data.error) {
                setErrors(prev => ({
                    ...prev,
                    [field]: data.error
                }));
                return;
            }

            setFieldErrors(prev => ({
                ...prev,
                [field]: ''
            }));

            if (data.url) {
                handleInputChange(field, data.url);
            } else {
                setErrors(prev => ({
                    ...prev,
                    [field]: 'No file URL returned from server.'
                }));
            }
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [field]: error instanceof Error ? error.message : 'File upload failed'
            }));
        } finally {
            setLoading(false);
        }
    };

    const validateSection = (section: number) => {
        const newErrors: { [key: string]: string } = {};

        switch (section) {
            case 1:
                if (!formData.email) newErrors.email = 'Email is required';
                if (!formData.password) newErrors.password = 'Password is required';
                if (formData.password !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Passwords do not match';
                }
                if (!formData.phone) newErrors.phone = 'Phone number is required';
                break;

            case 2:
                if (!formData.firstName) newErrors.firstName = 'First name is required';
                if (!formData.lastName) newErrors.lastName = 'Last name is required';
                if (!formData.businessName) newErrors.businessName = 'Business name is required';
                if (!formData.taxId) newErrors.taxId = 'Tax ID is required';
                if (!formData.street) newErrors.street = 'Street address is required';
                if (!formData.city) newErrors.city = 'City is required';
                if (!formData.state) newErrors.state = 'State is required';
                if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
                break;

            case 3:
                if (!formData.govIdUrl) newErrors.govIdUrl = 'Government ID is required';
                if (formData.businessType !== 'individual' && !formData.businessDocUrl) {
                    newErrors.businessDocUrl = 'Business registration document is required';
                }
                break;

            case 4:
                if (!formData.companyBio) newErrors.companyBio = 'Company bio is required';
                if (formData.industryTags.length === 0) {
                    newErrors.industryTags = 'Please select at least one industry';
                }
                break;

            case 5:
                if (!formData.agreedToTerms) {
                    newErrors.agreedToTerms = 'You must agree to the terms and conditions';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextSection = () => {
        if (validateSection(currentSection)) {
            setCurrentSection(prev => Math.min(prev + 1, 5));
        }
    };

    const prevSection = () => {
        setCurrentSection(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateSection(5)) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            alert(data.message);
            setLoading(false);
            if (!response.ok) {
                setErrors(data.message || 'An error occurred');
                if (data.errors) {
                    setFieldErrors(data.errors);
                }

                return;
            }
            if (data.seller) {
                alert('Registration successful! Please wait for approval.');
                router.push('/seller/dashboard');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error during registration:', error);
            alert(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
            alert(`${errors}`);
        }
    };
    return {
        formData,
        errors,
        fieldErrors,
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
    };
}

export default useSignup;