import React from 'react';

const StandSelector = ({ stands, selectedStandId, onSelectStand }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Pilih Stand</h2>
      <div className="space-y-2">
        {stands.map((stand) => {
          const isSelected = stand.id === selectedStandId;
          return (
            <button
              key={stand.id}
              onClick={() => onSelectStand(stand.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                isSelected
                  ? 'bg-primary-blue text-white shadow-md' //
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {stand.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StandSelector;