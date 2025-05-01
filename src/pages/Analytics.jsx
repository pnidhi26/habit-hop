/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Activity } from 'lucide-react';

export default function Analytics() {
  const [selectedHabit, setSelectedHabit] = useState('All');
  const [hoveredDay, setHoveredDay] = useState(null);
  
  // Sample data for demonstration
  const habits = ['All', 'Habit 1', 'Habit 2', 'Habit 3', 'Habit 4', 'Habit 5'];
  
  const habitData = {
    'All': [
      { day: 'Mon', value: 85 },
      { day: 'Tue', value: 70 },
      { day: 'Wed', value: 90 },
      { day: 'Thu', value: 88 },
      { day: 'Fri', value: 95 },
      { day: 'Sat', value: 97 },
      { day: 'Sun', value: 85 },
    ],
    'Habit 1': [
      { day: 'Mon', value: 90 },
      { day: 'Tue', value: 85 },
      { day: 'Wed', value: 95 },
      { day: 'Thu', value: 90 },
      { day: 'Fri', value: 88 },
      { day: 'Sat', value: 92 },
      { day: 'Sun', value: 94 },
    ],
    // Add data for other habits...
  };
  
  // Generate 5 years of calendar data
  const generateCalendarData = () => {
    const years = [2021, 2022, 2023, 2024, 2025];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const calendarData = {};
    
    years.forEach(year => {
      calendarData[year] = {};
      months.forEach(month => {
        calendarData[year][month] = {};
        days.forEach(day => {
          // Generate random completion (mostly completed for visual effect)
          calendarData[year][month][day] = Math.random() > 0.15;
        });
      });
    });
    
    return calendarData;
  };
  
  const calendarData = generateCalendarData();
  
  // Sample habit completion data for popup
  const habitCompletionData = {
    "2025-May-Mon": {
      date: "Month Day, Year",
      habits: [
        { name: "Drank 2 gallons of water", completed: true },
        { name: "Ran 6 miles", completed: true },
        { name: "Meditated for 30 minutes", completed: true }
      ]
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-purple-600">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Lifetime Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black-500">
          <div className="flex items-start mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              <div className="w-full h-full bg-gray-300"></div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl text-purple-700">Prakash Nidhi Verma</h1>
              <p className="text-sm text-gray-500">Student @ CSU Chico</p>
            </div>
          </div>
          
          <p className="text-lg text-purple-400 mb-2">Lifetime statistics</p>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded-lg p-4 text-center border border-purple-200">
              <h3 className="text-2xl font-bold text-purple-500">12</h3>
              <p className="text-purple-400">Days</p>
              <p className="text-xs text-gray-500">Longest Streak</p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 text-center border border-purple-200">
              <h3 className="text-2xl font-bold text-purple-500">782</h3>
              <p className="text-xs text-gray-500">Habits Completed</p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 text-center border border-purple-200">
              <h3 className="text-2xl font-bold text-purple-500">95.4%</h3>
              <p className="text-xs text-gray-500">Completion Rate</p>
            </div>
          </div>
        </div>
        
        {/* Personal Report */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black-500">
          <h2 className="text-2xl text-purple-500 mb-4">Personal Report Highlights</h2>
          
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-purple-400">
              Last Friday was your lowest percentage of habits completed at 67%
            </li>
            <li className="text-purple-400">
              If you completed your Friday habits, you would have had a 96% completion rate!
            </li>
            <li className="text-purple-400">
              You tend to skip your morning habits!
            </li>
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Habit Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black-500">
          <div className="flex mb-4">
            {habits.map((habit) => (
              <button
                key={habit}
                className={`mr-2 px-3 py-1 rounded ${
                  selectedHabit === habit 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedHabit(habit)}
              >
                {habit}
              </button>
            ))}
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={habitData[selectedHabit] || habitData['All']}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} hide />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: "#EF4444" }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Weekly Report */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black-500">
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
      </div>
      
      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black-500 mb-6">
        <div className="flex justify-center mb-4 space-x-4">
          {[2021, 2022, 2023, 2024, 2025].map(year => (
            <button
              key={year}
              className={`px-4 py-2 rounded ${
                year === 2025 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1"></div>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
            <div key={month} className="col-span-1 text-center text-sm text-gray-500">
              {month}
            </div>
          ))}
          
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <React.Fragment key={day}>
              <div className="col-span-1 text-sm text-gray-500">{day}</div>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                <div key={`${day}-${month}`} className="col-span-1 flex justify-center">
                  <div 
                    className={`w-6 h-6 rounded-sm ${calendarData[2025][month][day] ? 'bg-green-500' : 'bg-gray-200'}`}
                    onMouseEnter={() => setHoveredDay(`2025-${month}-${day}`)}
                    onMouseLeave={() => setHoveredDay(null)}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        
        {/* Popup for calendar hover */}
        {hoveredDay === "2025-May-Mon" && (
          <div className="absolute bg-gray-300 rounded p-4 shadow-lg w-64 z-10" style={{ top: '80%', left: '50%', transform: 'translateX(-50%)' }}>
            <h3 className="font-bold mb-2">3 Habits Completed on<br />Month Day, Year</h3>
            <ul className="list-disc pl-5">
              <li>Drank 2 gallons of water</li>
              <li>Ran 6 miles</li>
              <li>Meditated for 30 minutes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}