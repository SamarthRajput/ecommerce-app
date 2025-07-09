"use client";
import { AlertCircle, CheckCircle, CreditCard, ExternalLink, Loader2, Shield } from "lucide-react";
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
    <div>
      {/* <button onClick={handleRequest} disabled={loading} className="btn btn-primary">
        {loading ? "Requesting..." : "Request Certification"}
      </button> */}
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Certification Section */}
      <div className="border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Product Certification</h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Certification Fee</span>
                  <span className="text-lg font-bold text-gray-900">${amount}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">One-time payment • No recurring fees</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {error && (
                <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {paid && (
                <div className="w-full p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</p>
                  <p className="text-sm text-green-700">
                    Certification request submitted. Our team will review your product within 2-3 business days.
                  </p>
                </div>
              )}

              {paymentUrl && !paid && (
                <div className="w-full space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-800 mb-2">Complete Payment</p>
                    <p className="text-xs text-blue-700">Secure payment processing via PayPal</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <a
                      href={paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <CreditCard className="w-5 h-5" />
                        Pay with PayPal
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    
                    <button
                      onClick={handlePaymentSuccess}
                      className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                          Simulate Payment Success
                    </button>
                  </div>
                </div>
              )}

              {requested && !paymentUrl && !paid && (
                <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                  <Loader2 className="w-8 h-8 text-yellow-600 mx-auto mb-2 animate-spin" />
                  <p className="text-sm font-medium text-yellow-800">Processing Request...</p>
                  <p className="text-xs text-yellow-700">Setting up payment gateway</p>
                </div>
              )}

              {!requested && !paid && (
                <button
                  onClick={handleRequest}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Request Certification
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>



  );
}
