// components/BarChart.tsx
'use client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface BarChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor?: string[];
}

export default function BarChart({ title, labels, data, backgroundColor }: BarChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: backgroundColor || ['#3b82f6'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        font: { size: 16 },
      },
    },
  };
  return <Bar data={chartData} options={options} />;
}
