import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

// Fungsi untuk format Rupiah di label chart
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

// Warna gradasi untuk bar
const barColors = [
  "#1E40AF", // Biru Paling Tua
  "#1D4ED8",
  "#2563EB",
  "#3B82F6", // Biru Tengah
  "#60A5FA"  // Biru Paling Muda
];

const TopStandChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>Tidak ada data performa stand.</p>;
  }

  // Balik urutan data agar Bude (tertinggi) ada di atas
  const chartData = [...data].reverse();

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Stand Terlaris Hari Ini
      </h3>
      
      {/* Container ini WAJIB untuk Recharts agar responsif */}
      <div style={{ width: '100%', height: `${chartData.length * 50}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 0, right: 100, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: '#374151' }} // Warna teks nama stand
              width={100}
            />
            <Tooltip
              cursor={{ fill: '#f3f4f6' }}
              formatter={(value) => [formatRupiah(value), 'Pendapatan']}
            />
            <Bar dataKey="revenue" minPointSize={5} radius={[0, 8, 8, 0]}>
              {/* Label Rp di sebelah kanan bar */}
              <LabelList 
                dataKey="revenue" 
                position="right" 
                formatter={formatRupiah}
                offset={10}
                style={{ fontSize: 14, fill: '#F5A623' }} // Warna Oren
              />
              {/* Memberi warna berbeda untuk setiap bar */}
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopStandChart;