"use client";
import React, { useState } from "react";

export default function RequestCertificationButton({ productId, amount }: { productId: string, amount: number }) {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    try {
        console.log(productId);
        console.log(amount);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certification/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, amount }),
      });
      if (!res.ok) throw new Error("Failed to request certification");
      setRequested(true);
      // Create PayPal payment
      const payRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certification/paypal/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ certificationId: (await res.json()).id }),
      });
      const payData = await payRes.json();
      setPaymentUrl(payData.approvalUrl);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  // This would be replaced by PayPal SDK logic in production
  const handlePaymentSuccess = async () => {
    setPaid(true);
    // Call backend to mark as paid (simulate PayPal callback)
    // ...
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (paid) return <div className="text-green-600">Certification paid! Awaiting admin approval.</div>;
  if (paymentUrl) return (
    <div>
      <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Pay with PayPal</a>
      <button onClick={handlePaymentSuccess} className="ml-2 btn btn-success">Simulate Payment Success</button>
    </div>
  );
  if (requested) return <div>Certification requested. Proceed to payment.</div>;
  return (
    <button onClick={handleRequest} disabled={loading} className="btn btn-primary">
      {loading ? "Requesting..." : "Request Certification"}
    </button>
  );
}
