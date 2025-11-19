'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StatusStat } from './types';

interface StatusBarChartProps {
  data: StatusStat[];
}

const StatusBarChart = ({ data }: StatusBarChartProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';      // Amber
      case 'inProgress': return '#2563eb';   // Blue
      case 'resolved': return '#2a7d2f';     // Green
      default: return '#6b7280';             // Gray
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'pending': return 'from-[#f59e0b] to-[#d97706]';
      case 'inProgress': return 'from-[#2563eb] to-[#1d4ed8]';
      case 'resolved': return 'from-[#2a7d2f] to-[#1f6b2a]';
      default: return 'from-[#6b7280] to-[#4b5563]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#f59e0b] to-[#2563eb] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Reports by Status
          </h3>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#2a7d2f] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-[#f59e0b] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="status" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => {
                  const statusMap: { [key: string]: string } = {
                    'pending': 'Pending',
                    'inProgress': 'In Progress', 
                    'resolved': 'Resolved'
                  };
                  return statusMap[value] || value;
                }}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [
                  <span key={value} className="font-bold text-[#2563eb]">{value} reports</span>, 
                  'Count'
                ]}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
                labelFormatter={(label) => {
                  const statusMap: { [key: string]: string } = {
                    'pending': 'Pending Reports',
                    'inProgress': 'In Progress Reports',
                    'resolved': 'Resolved Reports'
                  };
                  return statusMap[label] || label;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${entry.status})`}
                  />
                ))}
              </Bar>
              
              <defs>
                {data.map((entry) => (
                  <linearGradient
                    key={entry.status}
                    id={`gradient-${entry.status}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={getStatusColor(entry.status)} stopOpacity={0.8}/>
                    <stop offset="100%" stopColor={getStatusColor(entry.status)} stopOpacity={0.4}/>
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom Legend */}
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          {data.map((entry, index) => (
            <div key={entry.status} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getStatusColor(entry.status) }}
              ></div>
              <span className="text-sm text-gray-600 capitalize">{entry.status}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StatusBarChart;