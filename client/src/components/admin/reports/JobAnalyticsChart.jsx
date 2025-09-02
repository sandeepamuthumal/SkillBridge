// client/src/components/admin/reports/JobAnalyticsChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const JobAnalyticsChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.title),
    datasets: [
      {
        label: 'Applied',
        data: data.map(item => item.appliedCount),
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // blue
      },
      {
        label: 'Shortlisted',
        data: data.map(item => item.shortlistedCount),
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // green
      },
      {
        label: 'Rejected',
        data: data.map(item => item.rejectedCount),
        backgroundColor: 'rgba(239, 68, 68, 0.6)', // red
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default JobAnalyticsChart;