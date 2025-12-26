'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DistrictStat } from './types';

interface DivisionDistrictChartProps {
  data: DistrictStat[];
}

const DivisionDistrictChart = ({ data }: DivisionDistrictChartProps) => {
  const sortedData = [...data].sort((a, b) => b.reports - a.reports).slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-linear-to-br from-[#2a7d2f] to-[#3a9d40] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Top Districts by Reports
          </h3>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Top 8
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="district"
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: unknown) => {
                  // Recharts `value` can be number | string | (number|string)[] | undefined
                  let displayNumber = 0;
                  if (Array.isArray(value)) {
                    const first = value[0];
                    displayNumber = Number(first) || 0;
                  } else {
                    displayNumber = Number(value) || 0;
                  }

                  return [
                    <span key={String(value ?? 'undefined')} className="font-bold text-[#2a7d2f]">{displayNumber} reports</span>,
                    'Count'
                  ];
                }}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(42, 125, 47, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
                labelFormatter={(label) => `District: ${label}`}
              />
              <Bar dataKey="reports" radius={[0, 4, 4, 0]}>
                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index < 3 ? '#2a7d2f' : '#3a9d40'}
                    opacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default DivisionDistrictChart;