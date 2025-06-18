"use client"
import { useEffect, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { SummaryData } from '@/src/lib/types/summary';

export default function ReportsPage() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/analytics/summary');
        const data = await response.json();
        
        if (data.message === "Summary Cards data fetched successfully") {
          setSummaryData(data.data);
        } else {
          setError(data.message || 'Failed to fetch summary data');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden"></span>
          </div>
          <p className="mt-2">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">View Reports</h1>
        <p className="text-gray-600 mb-8">Analytics and performance reports</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Listings</h3>
            <p className="text-3xl font-bold text-blue-600">
              {summaryData?.activeListingCount || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Currently available products</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending RFQs</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {summaryData?.pendingRFQsCount || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Requests awaiting response</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed RFQs</h3>
            <p className="text-3xl font-bold text-green-500">
              {summaryData?.completedRFQsCount || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Successfully processed requests</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Trades</h3>
            <p className="text-3xl font-bold text-green-500">
              {summaryData?.completedTradesCount || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Successful transactions</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">In Progress Trades</h3>
            <p className="text-3xl font-bold text-blue-500">
              {summaryData?.inprogressTradesCount || 0}
            </p>
            <p className="text-sm text-gray-500 mt-2">Ongoing transactions</p>
          </div>
        </div>
        
        {/* Export Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Export Reports</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
              Download as CSV
            </Button>
            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
              Download as PDF
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-50">
              Generate Custom Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}