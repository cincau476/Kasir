import React from 'react';

const StatCard = ({ title, value, icon, valueColor = 'text-gray-900' }) => {
  const IconComponent = icon;
  
  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <IconComponent size={20} className="text-accent-blue" />
      </div>
      <div className={`mt-2 text-3xl font-bold ${valueColor}`}>
        {value}
      </div>
    </div>
  );
};

export default StatCard;