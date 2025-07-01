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
  ChartOptions,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface BarChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  options?: Partial<ChartOptions<'bar'>>;
}

export default function BarChart({
  title,
  labels,
  data,
  backgroundColor,
  options = {},
}: BarChartProps) {
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

  const mergedOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        font: { size: 16 },
      },
      ...options.plugins,
    },
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
          ...(options?.scales?.y as any)?.ticks,
        },
        ...(options?.scales?.y as any),
      },
      x: {
        type: 'category',
        ...options?.scales?.x as any,
      },
    },
  };

  return <Bar data={chartData} options={mergedOptions} />;
}
