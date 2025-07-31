import React, { useEffect, useState } from "react";
import { ExternalLink, Award, Clock, CheckCircle, Download, Eye, Shield, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  // Add other product properties as needed
}

interface Certification {
  id: string;
  product: { id: string; name: string };
  status: string;
  certificateUrl?: string;
}

export default function SellerCertifications({ sellerId }: { sellerId: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<string | null>(null); // To handle per-product loading

  const fetchProductsAndCerts = async () => {
    try {
        // Fix this 
      const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/seller/${sellerId}`, {
        credentials: 'include'
      });
      const certRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certification/seller/${sellerId}`);

      if (productRes.ok && certRes.ok) {
        setProducts(await productRes.json());
        setCerts(await certRes.json());
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCerts();
  }, [sellerId]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'issued':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Award className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'issued':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileType = (url: string) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  const handleViewCertificate = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadCertificate = (url: string, productName: string) => {
    const fileType = getFileType(url);
    const fileName = `${productName.replace(/[^a-zA-Z0-9]/g, '_')}_certificate.${fileType}`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleRequestCertification = async (productId: string, amount: number) => {
    setCreating(productId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certification/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, amount }),
      });
      if (!res.ok) throw new Error("Failed to request certification");
      
      // After a successful request, re-fetch the data to update the UI
      await fetchProductsAndCerts();
    } catch (e) {
      setError("Failed to create certification request.");
    } finally {
      setCreating(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          Product Certifications
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          Product Certifications
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">No products found for this seller.</p>
          <p className="text-gray-500 text-sm mt-1">Please add products to your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-blue-600" />
        Product Certifications
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          {certs.filter(c => c.status === 'ISSUED').length} of {products.length}
        </span>
      </h2>
      
      <div className="space-y-4">
        {products.map(product => {
          const cert = certs.find(c => c.product.id === product.id);
          
          return (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {cert ? getStatusIcon(cert.status) : <Shield className="w-5 h-5 text-gray-400" />}
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    {cert ? (
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                          {cert.status.toUpperCase()}
                        </span>
                        {cert.certificateUrl && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {getFileType(cert.certificateUrl).toUpperCase()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="mt-1 text-xs text-gray-500">Not certified</span>
                    )}
                  </div>
                </div>
                
                {cert && cert.certificateUrl ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewCertificate(cert.certificateUrl!)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadCertificate(cert.certificateUrl!, product.name)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRequestCertification(product.id, 100)} // Set your desired certification amount here
                    disabled={creating === product.id}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating === product.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                    {creating === product.id ? "Requesting..." : "Request Certification"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}