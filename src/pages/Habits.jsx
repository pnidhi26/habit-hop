import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/Habits.css';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [deleteMode, setDeleteMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        setUserId(userId);
        const response = await fetch(`http://localhost:8080/api/getHabits/${userId}`, {
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

  const handleDelete = async (habitId) => {
    const confirmed = window.confirm('Are you sure you want to delete this habit?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `http://localhost:8080/api/removeHabit/${userId}/${habitId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setHabits((prev) => prev.filter((h) => h.habitId !== habitId));
        setDeleteMessage('Habit deleted successfully');
        setTimeout(() => setDeleteMessage(''), 5000);
      } else {
        throw new Error(data.message || 'Failed to delete habit');
      }
    } catch (err) {
      alert('Error deleting habit: ' + err.message);
    }
  };


  return (
    <div className="p-6">
      {deleteMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
          {deleteMessage}
        </div>
      )}
      {/* Top Buttons Section */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div className="flex gap-4 items-start relative">
          <div className="relative">
            <button
              onClick={() => setDeleteMode((prev) => !prev)}
              className={`px-6 py-2 rounded shadow font-semibold text-white ${
                deleteMode ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              {deleteMode ? 'Exit Delete Mode' : 'Delete Habit'}
            </button>
          </div>
            {/* <button className="bg-blue-500 text-white px-6 py-2 rounded shadow font-semibold hover:bg-blue-600">
              Join Habit
            </button>*/}
        </div>

        <button
          onClick={() => navigate('/add-habit')}
          className="bg-indigo-500 text-white px-6 py-2 rounded shadow font-semibold hover:bg-indigo-600"
        >
          + Add New Habit
        </button>
      </div>

      {/* Habit Grid */}
      <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
        {habits.map((habit, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className="flip-card w-48 h-48 cursor-pointer sm:w-56 sm:h-56 md:w-60 md:h-60"
              onClick={() => toggleFlip(idx)}
            >
              <div className={`flip-inner ${flippedCards[idx] ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="flip-front rounded shadow-lg overflow-hidden bg-white">
                  <img
                    src={habit.habitImage}
                    alt={habit.habitName}
                    className="w-full h-full object-cover"
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
            {deleteMode && (
              <button
                onClick={() => handleDelete(habit.habitId)}
                className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
