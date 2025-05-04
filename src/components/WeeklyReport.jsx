import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WeeklyReport() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/analytics');
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-6 border-2 border-black-500 cursor-pointer hover:shadow-lg transition"
    >
      <h2 className="text-2xl text-purple-500 mb-4">Weekly Report</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <svg className="w-24 h-24">
              <circle
                cx="48"
                cy="48"
                r="36"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="48"
                cy="48"
                r="36"
                fill="none"
                stroke="#9333ea"
                strokeWidth="8"
                strokeDasharray="226.2"
                strokeDashoffset="5"
                transform="rotate(-90 48 48)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-purple-500">98.7%</span>
            </div>
          </div>
          <p className="text-center text-purple-400 mt-2">Habits Completed</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-purple-200 flex items-center justify-center">
            <span className="text-3xl font-bold text-purple-500">6</span>
          </div>
          <p className="text-center text-purple-400 mt-2">New Habits</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-purple-200 flex items-center justify-center">
            <span className="text-3xl font-bold text-purple-500">4</span>
          </div>
          <p className="text-center text-purple-400 mt-2">In Progress</p>
        </div>
      </div>
    </div>
  );
}