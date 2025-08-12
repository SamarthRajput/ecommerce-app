import { showError, showInfo, showSuccess } from '@/lib/toast';
import { APIURL } from '@/src/config/env';
import { useAuth } from '@/src/context/AuthContext';
import { IndustryMasterDataTypes } from '@/src/types/masterdata';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const useSignup = () => {
    const [currentSection, setCurrentSection] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
    const [industry, setIndustry] = useState<IndustryMasterDataTypes[]>([]);
    const router = useRouter();
    const { user, isSeller, authLoading } = useAuth();

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
        industryId: string;
        yearsInBusiness: string;
        keyProducts: string[];

        agreedToTerms: boolean;
    }>({
        // Section 1: Account & Verification
        email: 'dummy@example.com',
        password: '1',
        confirmPassword: '1',
        phone: '2',
        countryCode: '+91',

        // Section 2: Business Details
        firstName: 'farzi',
        lastName: 'malik',
        businessName: 'farzi enterprises',
        businessType: 'individual',
        registrationNo: 'fake',
        taxId: 'jgfnbc',
        panOrTin: 'nzgfcb',
        country: 'gfnxb',
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        zipCode: '12345',
        website: 'https://farzi-enterprises.com',
        linkedIn: '',

        // Section 3: Documents
        govIdUrl: 'https://example.com/gov-id',
        gstCertUrl: null,
        businessDocUrl: 'https://example.com/business-doc',
        otherDocsUrl: null,

        // Section 4: Business Profile
        companyBio: 'ethdbv',
        industryId: '',
        yearsInBusiness: '23',
        keyProducts: [],

        // Section 5: Terms
        agreedToTerms: false
    });

    useEffect(() => {
        if (authLoading) return;
        if (user && isSeller) {
            showInfo('You are already logged in as a seller');
            router.push('/seller/dashboard');
        }
    }, [user, isSeller, authLoading]);
    
    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const response = await fetch(`${APIURL}/public/master-data`);
                if (!response.ok) {
                    throw new Error('Failed to fetch industries');
                }
                const data = await response.json();
                setIndustry(data.data.industries ?? []);
            } catch (error) {
                console.error('Error fetching industries:', error);
            }
        };

        fetchIndustries();
    }, []);

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
            const response = await fetch(`${APIURL}/seller/upload-documents`, {
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
                showSuccess('File uploaded successfully');
            } else {
                setErrors(prev => ({
                    ...prev,
                    [field]: 'No file URL returned from server.'
                }));
            }
        } catch (error: any) {
            setErrors(prev => ({
                ...prev,
                [field]: error instanceof Error ? error.message : 'File upload failed'
            }));
            showError(error instanceof Error ? error.message : 'File upload failed');
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
                if (formData.password.length < 4) newErrors.password = 'Password must be at least 4 characters';
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
                if (!formData.industryId) {
                    newErrors.industryId = 'Please select an industry';
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
            const response = await fetch(`${APIURL}/seller/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            setLoading(false);
            if (!response.ok) {
                setErrors(data.message || 'An error occurred');
                if (data.errors) {
                    setFieldErrors(data.errors);
                }
                showError(data.message || 'An error occurred');
                return;
            }
            if (data.seller) {
                toast.success('Registration successful! Please wait for approval.');
                router.push('/seller/dashboard');
            }
        } catch (error) {
            setLoading(false);
            showError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };
    return {
        formData,
        industry,
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