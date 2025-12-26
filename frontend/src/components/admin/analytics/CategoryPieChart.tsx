'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, PieLabelRenderProps } from 'recharts';
import { CategoryStat } from './types';

interface CategoryPieChartProps {
  data: CategoryStat[];
}

const COLORS = [
  '#2563eb', '#2a7d2f', '#f59e0b', '#dc2626',
  '#7c3aed', '#0891b2', '#ea580c', '#65a30d'
];

const CategoryPieChart = ({ data }: CategoryPieChartProps) => {
  // Recharts expects a 'name' property for each data item
  const chartData = data.map(item => ({ ...item, name: item.category }));
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-linear-to-br from-[#2563eb] to-[#2a7d2f] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Reports by Category
          </h3>
          <div className="w-3 h-3 bg-[#2563eb] rounded-full animate-pulse"></div>
        </div>

        <div className="h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
                animationBegin={200}
                animationDuration={1500}
                label={(props: PieLabelRenderProps) => {
                  const percent = typeof props.percent === 'number' ? props.percent : 0;
                  let name = '';

                  if (props && 'payload' in props) {
                    const payload = props.payload as Record<string, unknown> | undefined;
                    if (payload && typeof payload.name === 'string') {
                      name = payload.name;
                    }
                  }

                  return name ? `${name}: ${(percent * 100).toFixed(1)}%` : '';
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
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
                    <span key={String(value)} className="font-bold text-[#2563eb]">{displayNumber} reports</span>,
                    'Count'
                  ];
                }}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {data.reduce((sum, item) => sum + item.count, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryPieChart;