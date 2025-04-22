import React from 'react';

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
  return (
    <div className="p-6">
      {/* Buttons Row */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-4">
          <button className="bg-gray-200 px-6 py-2 rounded shadow text-black font-semibold">
            Select ▼
          </button>
          <button className="bg-blue-500 text-white px-6 py-2 rounded shadow font-semibold hover:bg-blue-600">
            Join Habit
          </button>
        </div>

        <button className="bg-indigo-500 text-white px-6 py-2 rounded shadow font-semibold hover:bg-indigo-600">
          + Add New Habit
        </button>
      </div>


      {/* Grid of Habits */}
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
