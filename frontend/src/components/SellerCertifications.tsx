import React, { useEffect, useState } from "react";

interface Certification {
  id: string;
  product: { name: string };
  status: string;
  certificateUrl?: string;
}

export default function SellerCertifications({ sellerId }: { sellerId: string }) {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certification/seller/${sellerId}`);
      if (res.ok) setCerts(await res.json());
      setLoading(false);
    };
    fetchCerts();
  }, [sellerId]);

  if (loading) return <div>Loading certificates...</div>;
  if (!certs.length) return <div>No certificates issued yet.</div>;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Product Certificates</h2>
      <ul>
        {certs.map(cert => (
          <li key={cert.id} className="mb-2">
            <span className="font-medium">{cert.product.name}</span> - {cert.status}
            {cert.certificateUrl && (
              <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">View Certificate</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
