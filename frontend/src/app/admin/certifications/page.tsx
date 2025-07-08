"use client";
import React, { useEffect, useState } from "react";

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

  const handleIssue = async (id: string) => {
    const certUrl = prompt('Enter certificate URL (PDF/image):');
    if (!certUrl) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certification/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ certificationId: id, certificateUrl: certUrl }),
    });
    setCerts(certs => certs.map(c => c.id === id ? { ...c, status: 'ISSUED', certificateUrl: certUrl } : c));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Certification Requests</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2">Seller</th>
            <th className="border px-2">Product</th>
            <th className="border px-2">Status</th>
            <th className="border px-2">Amount</th>
            <th className="border px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {certs.map(cert => (
            <tr key={cert.id}>
              <td className="border px-2">{cert.seller.firstName} {cert.seller.lastName} <br />{cert.seller.email}</td>
              <td className="border px-2">{cert.product.name}</td>
              <td className="border px-2">{cert.status}</td>
              <td className="border px-2">{cert.amount}</td>
              <td className="border px-2">
                {cert.status === 'PENDING' || cert.status === 'PAID' ? (
                    <button 
                    onClick={() => handleIssue(cert.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                    Issue Certificate
                    </button>
                ) : null}
                {cert.status === 'ISSUED' && cert.certificateUrl && (
                    <a 
                    href={cert.certificateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded ml-2"
                    >
                    View Certificate
                    </a>
                )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
