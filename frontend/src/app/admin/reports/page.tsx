'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SummaryData } from '@/src/lib/types/summary';
import BarChart from '@/src/components/BarChart';
import { FileDown, FileText, SlidersHorizontal } from 'lucide-react';

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
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 text-lg">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500 space-y-4">
          <p className="text-lg font-medium">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Reports Dashboard</h1>
          <p className="text-gray-500 text-lg">Review analytics and performance metrics</p>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Pending RFQs', value: summaryData?.pendingRFQsCount, color: 'text-yellow-500' },
            { title: 'Completed RFQs', value: summaryData?.completedRFQsCount, color: 'text-green-500' },
            { title: 'Completed Trades', value: summaryData?.completedTradesCount, color: 'text-green-600' },
            { title: 'In Progress Trades', value: summaryData?.inprogressTradesCount, color: 'text-blue-500' },
            { title: 'Active Listings', value: summaryData?.activeListingCount, color: 'text-blue-600' },
          ].map(({ title, value, color }) => (
            <div key={title} className="bg-white rounded-2xl shadow p-6 space-y-2">
              <h3 className="text-gray-700 font-medium">{title}</h3>
              <p className={`text-4xl font-bold ${color}`}>{value ?? 0}</p>
              <p className="text-sm text-gray-500">Latest stats</p>
            </div>
          ))}
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'RFQ Summary',
              labels: ['Pending', 'Completed', 'Rejected'],
              data: [
                summaryData?.pendingRFQsCount || 0,
                summaryData?.completedRFQsCount || 0,
                summaryData?.rejectedRFQsCount || 0,
              ],
              colors: ['#facc15', '#22c55e', '#ef4444'],
            },
            {
              title: 'Listing Status',
              labels: ['Active', 'Approved', 'Archived', 'Inactive', 'Pending', 'Rejected'],
              data: [
                summaryData?.activeListingCount || 0,
                summaryData?.approvedListingCount || 0,
                summaryData?.archivedListingCount || 0,
                summaryData?.inactiveListingCount || 0,
                summaryData?.pendingListingCount || 0,
                summaryData?.rejectedListingCount || 0,
              ],
              colors: ['#3b82f6', '#10b981', '#6b7280', '#f59e0b', '#6366f1', '#ef4444'],
            },
            {
              title: 'Trades Overview',
              labels: ['Completed', 'In Progress'],
              data: [
                summaryData?.completedTradesCount || 0,
                summaryData?.inprogressTradesCount || 0,
              ],
              colors: ['#22c55e', '#3b82f6'],
            },
          ].map(({ title, labels, data, colors }) => (
            <div key={title} className="bg-white rounded-2xl shadow p-6">
              <BarChart title={title} labels={labels} data={data} backgroundColor={colors} />
            </div>
          ))}
        </section>

        {/* Export Section */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Export Reports</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
              <FileDown className="w-4 h-4 mr-2" />
              Download as CSV
            </Button>
            <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
              <FileText className="w-4 h-4 mr-2" />
              Download as PDF
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Generate Custom Report
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
