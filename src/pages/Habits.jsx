import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './css/Habits.css';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        console.log("Decoded userId:", userId);
        const response = await fetch(`https://habitstacker-821782230505.us-west1.run.app/api/getHabits/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();

        if (data.success) {
          setHabits(data.habits);
        } else {
          console.error('Failed to fetch habits:', data.message);
        }
      } catch (error) {
        console.error('Error fetching habits:', error);
      }
    };

    fetchHabits();
  }, []);

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
                    {habit.habitName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="bg-blue-500 text-white px-6 py-2 rounded shadow font-semibold hover:bg-blue-600">
            Join Habit
          </button>
        </div>

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
                    src={habit.habitImage}
                    alt={habit.habitName}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Back */}
                <div className="flip-back bg-white rounded shadow-lg p-4 flex flex-col justify-center items-center text-center">
                  <h3 className="text-md font-bold text-gray-800">{habit.habitName}</h3>
                  <p className="text-base text-gray-600 mt-2">{habit.habitDescription}</p>
                </div>
              </div>
            </div>

            {/* Habit Name BELOW Card */}
            <p className="mt-2 text-lg font-semibold text-center text-gray-800">{habit.habitName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
