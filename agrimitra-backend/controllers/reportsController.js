import { sendSuccess, asyncHandler } from '../utils/helpers.js';

// @route   GET /api/reports
// @access  Public / Private
export const getReportsSummary = asyncHandler(async (req, res) => {
  const yieldTrend = [
    { month: 'Jan', value: 18 },
    { month: 'Feb', value: 22 },
    { month: 'Mar', value: 19 },
    { month: 'Apr', value: 26 },
    { month: 'May', value: 21 },
    { month: 'Jun', value: 28 },
    { month: 'Jul', value: 24 },
  ];

  const topCrops = [
    { name: 'Wheat', value: '35.2 Quintal/Acre', pct: 88 },
    { name: 'Rice', value: '28.1 Quintal/Acre', pct: 70 },
    { name: 'Soybean', value: '22.4 Quintal/Acre', pct: 56 },
    { name: 'Tomato', value: '18.7 Quintal/Acre', pct: 46 },
  ];

  const expenses = [
    { name: 'Seed', value: 20, color: '#2E90E5' },
    { name: 'Fertilizer', value: 30, color: '#3FA34D' },
    { name: 'Irrigation', value: 15, color: '#F0A93B' },
    { name: 'Labor', value: 20, color: '#E8664B' },
    { name: 'Others', value: 15, color: '#8B8FA3' },
  ];

  const summaryStats = [
    { label: 'Average Yield', value: '22.5', unit: 'Quintal / Acre', trend: '↑ 10%' },
    { label: 'Water Used', value: '6500', unit: 'Liter / Week', trend: '↓ 8%' },
    { label: 'Fertilizer Used', value: '120', unit: 'kg / Acre', trend: '↑ 5%' },
    { label: 'Income', value: '₹1,25,000', unit: 'This Season', trend: '↑ 15%' },
  ];

  sendSuccess(
    res,
    200,
    { yieldTrend, topCrops, expenses, summaryStats },
    'Reports summary fetched.'
  );
});
