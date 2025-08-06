'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SummaryData } from '@/lib/types/summary';
import BarChart from '@/src/components/BarChart';
import { FileDown, FileText, SlidersHorizontal, X, Download, Calendar, Filter } from 'lucide-react';
import { APIURL } from '@/src/config/env';

const API_BASE_URL = `${APIURL}/analytics`;

export default function ReportsPage() {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [customReportConfig, setCustomReportConfig] = useState({
    dateRange: 'last30days',
    reportType: 'all',
    format: 'pdf'
  });

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/summary`);
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

  // Function to generate PDF
  const downloadPDF = () => {
    if (!summaryData) return;

    // Create PDF content using window.print with specific styling
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reports Dashboard</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .no-print { display: none !important; }
            }
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .section { margin: 20px 0; page-break-inside: avoid; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; background: #f5f5f5; padding: 10px; }
            .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
            .metric { padding: 15px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
            .metric-title { font-weight: bold; color: #555; font-size: 14px; margin-bottom: 5px; }
            .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
            .summary-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .summary-table th, .summary-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .summary-table th { background-color: #f5f5f5; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reports Dashboard</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Summary Overview</div>
            <table class="summary-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Metric</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                <tr><td rowspan="4">RFQs</td><td>Pending</td><td>${summaryData.pendingRFQsCount || 0}</td></tr>
                <tr><td>Completed</td><td>${summaryData.completedRFQsCount || 0}</td></tr>
                <tr><td>Rejected</td><td>${summaryData.rejectedRFQsCount || 0}</td></tr>
                <tr><td>Forwarded</td><td>${summaryData.forwardedRFQsCount || 0}</td></tr>
                <tr><td rowspan="2">Trades</td><td>Completed</td><td>${summaryData.completedTradesCount || 0}</td></tr>
                <tr><td>In Progress</td><td>${summaryData.inprogressTradesCount || 0}</td></tr>
                <tr><td rowspan="6">Listings</td><td>Active</td><td>${summaryData.activeListingCount || 0}</td></tr>
                <tr><td>Approved</td><td>${summaryData.approvedListingCount || 0}</td></tr>
                <tr><td>Archived</td><td>${summaryData.archivedListingCount || 0}</td></tr>
                <tr><td>Inactive</td><td>${summaryData.inactiveListingCount || 0}</td></tr>
                <tr><td>Pending</td><td>${summaryData.pendingListingCount || 0}</td></tr>
                <tr><td>Rejected</td><td>${summaryData.rejectedListingCount || 0}</td></tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Key Metrics</div>
            <div class="metrics-grid">
              <div class="metric">
                <div class="metric-title">Total RFQs</div>
                <div class="metric-value">${(summaryData.pendingRFQsCount || 0) + (summaryData.completedRFQsCount || 0) + (summaryData.rejectedRFQsCount || 0) + (summaryData.forwardedRFQsCount || 0)}</div>
              </div>
              <div class="metric">
                <div class="metric-title">Total Trades</div>
                <div class="metric-value">${(summaryData.completedTradesCount || 0) + (summaryData.inprogressTradesCount || 0)}</div>
              </div>
              <div class="metric">
                <div class="metric-title">Total Listings</div>
                <div class="metric-value">${(summaryData.activeListingCount || 0) + (summaryData.approvedListingCount || 0) + (summaryData.archivedListingCount || 0) + (summaryData.inactiveListingCount || 0) + (summaryData.pendingListingCount || 0) + (summaryData.rejectedListingCount || 0)}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This report was automatically generated from the Reports Dashboard</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  // Function to generate custom report
  const generateCustomReport = () => {
    if (!summaryData) return;

    const { dateRange, reportType, format } = customReportConfig;

    // Filter data based on report type
    let filteredData = [];

    if (reportType === 'all' || reportType === 'rfqs') {
      filteredData.push(
        ['Pending RFQs', summaryData.pendingRFQsCount || 0],
        ['Completed RFQs', summaryData.completedRFQsCount || 0],
        ['Rejected RFQs', summaryData.rejectedRFQsCount || 0],
        ['Forwarded RFQs', summaryData.forwardedRFQsCount || 0]
      );
    }

    if (reportType === 'all' || reportType === 'trades') {
      filteredData.push(
        ['Completed Trades', summaryData.completedTradesCount || 0],
        ['In Progress Trades', summaryData.inprogressTradesCount || 0]
      );
    }

    if (reportType === 'all' || reportType === 'listings') {
      filteredData.push(
        ['Active Listings', summaryData.activeListingCount || 0],
        ['Approved Listings', summaryData.approvedListingCount || 0],
        ['Archived Listings', summaryData.archivedListingCount || 0],
        ['Inactive Listings', summaryData.inactiveListingCount || 0],
        ['Pending Listings', summaryData.pendingListingCount || 0],
        ['Rejected Listings', summaryData.rejectedListingCount || 0]
      );
    }

    if (format === 'csv') {
      const csvContent = [['Metric', 'Value'], ...filteredData].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `custom_report_${dateRange}_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate PDF for custom report using print functionality
      const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Custom Report - ${reportType.toUpperCase()}</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .no-print { display: none !important; }
              }
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
              .config-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
              .metric { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
              .metric-title { font-weight: bold; color: #333; }
              .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
              .summary-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              .summary-table th, .summary-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              .summary-table th { background-color: #f5f5f5; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Custom Report - ${reportType.toUpperCase()}</h1>
              <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <div class="config-info">
              <h3>Report Configuration</h3>
              <p><strong>Date Range:</strong> ${dateRange.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
              <p><strong>Report Type:</strong> ${reportType.toUpperCase()}</p>
              <p><strong>Format:</strong> PDF</p>
            </div>

            <div class="section">
              <table class="summary-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${filteredData.map(([title, value]) => `
                    <tr>
                      <td>${title}</td>
                      <td style="font-weight: bold; color: #2563eb;">${value}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p>This custom report was automatically generated from the Reports Dashboard</p>
            </div>

            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 100);
              }
            </script>
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
      }
    }

    setShowCustomReportModal(false);
  };

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
              labels: ['Pending', 'Completed', 'Rejected', 'Forwarded'],
              data: [
                summaryData?.pendingRFQsCount || 0,
                summaryData?.completedRFQsCount || 0,
                summaryData?.rejectedRFQsCount || 0,
                summaryData?.forwardedRFQsCount || 0,
              ],
              colors: ['#facc15', '#22c55e', '#ef4444', '#10b981'],
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
            <Button
              variant="outline"
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={downloadPDF}
            >
              <FileText className="w-4 h-4 mr-2" />
              Download as PDF
            </Button>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
              onClick={() => setShowCustomReportModal(true)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Generate Custom Report
            </Button>
          </div>
        </section>
      </div>

      {/* Custom Report Modal */}
      {showCustomReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Custom Report Configuration</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomReportModal(false)}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date Range
                </label>
                <select
                  value={customReportConfig.dateRange}
                  onChange={(e) => setCustomReportConfig({ ...customReportConfig, dateRange: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="last90days">Last 90 Days</option>
                  <option value="lastyear">Last Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-1" />
                  Report Type
                </label>
                <select
                  value={customReportConfig.reportType}
                  onChange={(e) => setCustomReportConfig({ ...customReportConfig, reportType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Data</option>
                  <option value="rfqs">RFQs Only</option>
                  <option value="trades">Trades Only</option>
                  <option value="listings">Listings Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Download className="w-4 h-4 inline mr-1" />
                  Format
                </label>
                <select
                  value={customReportConfig.format}
                  onChange={(e) => setCustomReportConfig({ ...customReportConfig, format: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={generateCustomReport}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Generate Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCustomReportModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}