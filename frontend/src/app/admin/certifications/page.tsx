"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, Eye, FileText, User, Package, CreditCard, Upload, X } from "lucide-react";

interface Certification {
  id: string;
  seller: { firstName: string; lastName: string; email: string };
  product: { name: string };
  status: string;
  amount: number;
  paymentId?: string;
  issuedAt?: string;
  certificateUrl?: string;
}

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCert, setUploadingCert] = useState<string | null>(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certification/all`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch certifications');
        setCerts(await res.json());
      } catch (e: any) {
        setError(e.message);
      }
      setLoading(false);
    };
    fetchCerts();
  }, []);

  const handleFileUpload = async (id: string, file: File) => {
    setUploadingCert(id);
    setError(null); // Clear any previous errors
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('certificationId', id);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certification/issue`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (res.ok) {
        const result = await res.json();
        setCerts(certs => certs.map(c => c.id === id ? { 
          ...c, 
          status: 'ISSUED', 
          certificateUrl: result.certificateUrl || result.url,
          issuedAt: new Date().toISOString()
        } : c));
      } else {
        // Get error message from response
        let errorMessage = 'Failed to upload certificate';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Upload failed: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Failed to issue certificate:', error);
      setError(error.message || 'Failed to upload certificate. Please try again.');
    } finally {
      setUploadingCert(null);
    }
  };

  const handleIssue = (id: string) => {
    // Clear any previous errors
    setError(null);
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.png,.jpg,.jpeg';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Check file size (e.g., max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError('File size should be less than 10MB');
          return;
        }
        
        // Check file type
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          setError('Please upload a PDF or image file (PNG, JPG, JPEG)');
          return;
        }
        
        handleFileUpload(id, file);
      }
    };
    fileInput.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'PAID':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'ISSUED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PAID':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ISSUED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Certification Requests</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and issue certificates for seller products
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 ml-4 text-red-400 hover:text-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Seller</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <Package className="w-4 h-4" />
                    <span>Product</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certs.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cert.seller.firstName} {cert.seller.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {cert.seller.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={cert.product.name}>
                      {cert.product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(cert.status)}`}>
                      {getStatusIcon(cert.status)}
                      <span className="ml-1">{cert.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{cert.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {(cert.status === 'PENDING' || cert.status === 'PAID') && (
                        <button
                          onClick={() => handleIssue(cert.id)}
                          disabled={uploadingCert === cert.id}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white transition-colors ${
                            uploadingCert === cert.id
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                          }`}
                        >
                          {uploadingCert === cert.id ? (
                            <>
                              <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full mr-1"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3 mr-1" />
                              Upload Certificate
                            </>
                          )}
                        </button>
                      )}
                      {cert.status === 'ISSUED' && cert.certificateUrl && (
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Certificate
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {certs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No certification requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              No certification requests have been submitted yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}