'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { MonthlyStat } from './types';

interface TrendLineChartProps {
  data: MonthlyStat[];
}

const TrendLineChart = ({ data }: TrendLineChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-linear-to-br from-[#2563eb] to-[#2a7d2f] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Monthly Trends
          </h3>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-[#2563eb] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#2a7d2f] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-[#f59e0b] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2a7d2f" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2a7d2f" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={false}
              />
              <YAxis 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
                formatter={(value: number) => [
                  <span key={value} className="font-bold">{value}</span>, 
                  ''
                ]}
              />
              
              <Area 
                type="monotone" 
                dataKey="reports" 
                stroke="none"
                fill="url(#colorReports)" 
                fillOpacity={1}
              />
              
              <Area 
                type="monotone" 
                dataKey="completed" 
                stroke="none"
                fill="url(#colorCompleted)" 
                fillOpacity={1}
              />
              
              <Line 
                type="monotone" 
                dataKey="reports" 
                stroke="#2563eb" 
                strokeWidth={4}
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 6, stroke: 'white' }}
                activeDot={{ r: 8, fill: '#1d4ed8', stroke: 'white', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#2a7d2f" 
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#2a7d2f', strokeWidth: 2, r: 5, stroke: 'white' }}
                activeDot={{ r: 7, fill: '#1f6b2a', stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-8 mt-6">
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <div className="w-4 h-4 bg-[#2563eb] rounded-full shadow-lg"></div>
            <span className="text-sm font-medium text-gray-700">Total Reports</span>
          </div>
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <div className="w-4 h-4 bg-[#2a7d2f] rounded-full shadow-lg"></div>
            <span className="text-sm font-medium text-gray-700">Completed</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrendLineChart;