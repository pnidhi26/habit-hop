import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Habits.css';

const habits = [
  { name: 'Yoga', img: '/images/yoga.jpg', description: 'Improve flexibility and calm your mind through controlled poses and breathing.' },
  { name: 'Gym', img: '/images/gym.jpg', description: 'Build strength and stamina with weight training and cardio workouts.' },
  { name: 'Meditation', img: '/images/meditation.jpg', description: 'Reduce stress and improve focus through mindful breathing.' },
  { name: 'Walking', img: '/images/walking.jpg', description: 'Boost heart health and clear your mind with daily walks.' },
  { name: 'Reading', img: '/images/reading.jpg', description: 'Expand your knowledge and unwind with a good book.' },
  { name: 'Stretching', img: '/images/stretching.jpg', description: 'Loosen tight muscles and prevent injuries through daily stretching.' },
  { name: 'Earthing', img: '/images/earthing.jpg', description: 'Reconnect with nature by walking barefoot on natural ground.' },
  { name: 'Cycling', img: '/images/cycling.jpg', description: 'Strengthen your legs and enjoy the outdoors with cycling.' },
  { name: 'Dancing', img: '/images/dancing.jpg', description: 'Lift your mood and stay active with fun dance routines.' },
  { name: 'Drinking water', img: '/images/water.jpg', description: 'Stay hydrated to improve energy and focus.' },
  { name: 'Journaling', img: '/images/journaling.jpg', description: 'Organize your thoughts and reflect through writing.' },
  { name: 'Skincare', img: '/images/skincare.jpg', description: 'Nourish your skin with a consistent self-care routine.' },
  { name: 'Digital Detox', img: '/images/detox.jpg', description: 'Take a break from screens to refresh your mind and body.' },
  { name: 'Cleaning/Chores', img: '/images/chores.jpg', description: 'Create a tidy, stress-free space with regular cleaning.' },
  { name: 'Cooking', img: '/images/cooking.jpg', description: 'Fuel your body and creativity through homemade meals.' },
];

export default function Habits() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const navigate = useNavigate();

  const toggleFlip = (idx) => {
    setFlippedCards((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="p-6">
      {/* Top Buttons Section */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        {/* Left Side: Select + Join Habit */}
        <div className="flex gap-4 items-start relative">
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

          <button className="bg-blue-500 text-white px-6 py-2 rounded shadow font-semibold hover:bg-blue-600">
            Join Habit
          </button>
        </div>

        {/* Right Side: Add New Habit Button */}
        <button
          onClick={() => navigate('/add-habit')}
          className="bg-indigo-500 text-white px-6 py-2 rounded shadow font-semibold hover:bg-indigo-600"
        >
          + Add New Habit
        </button>
      </div>

      {/* Habit Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {habits.map((habit, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className="flip-card w-full h-48 cursor-pointer"
              onClick={() => toggleFlip(idx)}
            >
              <div className={`flip-inner ${flippedCards[idx] ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="flip-front rounded shadow-lg overflow-hidden bg-white">
                  <img
                    src={habit.img}
                    alt={habit.name}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Back */}
                <div className="flip-back bg-white rounded shadow-lg p-4 flex flex-col justify-center items-center text-center">
                  <h3 className="text-md font-bold text-gray-800">{habit.name}</h3>
                  <p className="text-base text-gray-600 mt-2">{habit.description}</p>
                </div>
              </div>
            </div>

            {/* Habit Name BELOW Card */}
            <p className="mt-2 text-lg font-semibold text-center text-gray-800">{habit.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}