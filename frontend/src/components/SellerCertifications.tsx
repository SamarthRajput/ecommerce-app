import React, { useEffect, useState } from "react";
import { ExternalLink, Award, Clock, CheckCircle } from "lucide-react";

interface Certification {
  id: string;
  product: { name: string };
  status: string;
  certificateUrl?: string;
}

export default function SellerCertifications({ sellerId }: { sellerId: string }) {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certification/seller/${sellerId}`);
        if (res.ok) {
          setCerts(await res.json());
        } else {
          setError('Failed to load certificates');
        }
      } catch (err) {
        setError('Error fetching certificates');
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
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
          Product Certificates
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!certs.length) {
    return (
      <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          Product Certificates
        </h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-lg">No certificates issued yet</p>
          <p className="text-gray-500 text-sm mt-1">Certificates will appear here once products are verified</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-blue-600" />
        Product Certificates
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          {certs.length}
        </span>
      </h2>
      
      <div className="space-y-4">
        {certs.map(cert => (
          <div key={cert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(cert.status)}
                <div>
                  <h3 className="font-medium text-gray-900">{cert.product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cert.status)}`}>
                      {cert.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              {cert.certificateUrl && (
                <a
                  href={cert.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Certificate
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}