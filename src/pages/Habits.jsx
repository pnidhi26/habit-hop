import React, { useState } from 'react';

const habits = [
  { name: 'Yoga', img: '/images/yoga.jpg' },
  { name: 'Gym', img: '/images/gym.jpg' },
  { name: 'Meditation', img: '/images/meditation.jpg' },
  { name: 'Walking', img: '/images/walking.jpg' },
  { name: 'Reading', img: '/images/reading.jpg' },
  { name: 'Stretching', img: '/images/stretching.jpg' },
  { name: 'Earthing', img: '/images/earthing.jpg' },
  { name: 'Cycling', img: '/images/cycling.jpg' },
  { name: 'Dancing', img: '/images/dancing.jpg' },
  { name: 'Drinking water', img: '/images/water.jpg' },
  { name: 'Journaling', img: '/images/journaling.jpg' },
  { name: 'Skincare', img: '/images/skincare.jpg' },
  { name: 'Digital Detox', img: '/images/detox.jpg' },
  { name: 'Cleaning/Chores', img: '/images/chores.jpg' },
  { name: 'Cooking', img: '/images/cooking.jpg' },
];

export default function Habits() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="p-6">
      {/* Top Buttons Section */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        {/* Left Side: Select + Join Habit */}
        <div className="flex gap-4 items-start relative">
          {/* Select Button with Arrow Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-gray-200 px-6 py-2 rounded shadow text-black font-semibold flex items-center"
            >
              Select {showDropdown ? '▲' : '▼'}
            </button>

            {showDropdown && (
              <ul className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                {habits.map((habit, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {habit.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Join Habit */}
          <button className="bg-blue-500 text-white px-6 py-2 rounded shadow font-semibold hover:bg-blue-600">
            Join Habit
          </button>
        </div>

        {/* Right Side: Add New Habit */}
        <button className="bg-indigo-500 text-white px-6 py-2 rounded shadow font-semibold hover:bg-indigo-600">
          + Add New Habit
        </button>
      </div>

      {/* Grid of Habit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {habits.map((habit, idx) => (
          <div key={idx} className="text-center">
            <img
              src={habit.img}
              alt={habit.name}
              className="w-full h-48 object-cover rounded shadow-lg"
            />
            <p className="mt-2 text-lg font-medium">{habit.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
