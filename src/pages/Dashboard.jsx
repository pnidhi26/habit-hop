import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../api/user';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const handleQuickAddClick = () => {
    navigate('/habits');
  };
  
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo(data);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(err.message || 'Something went wrong');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      <p className="text-center text-gray-600">
        {userInfo ? `Welcome to your main dashboard, ${userInfo.username}!` : 'Welcome to your main dashboard!'}
      </p>

      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-2">Today's Activity Overview</h2>
        <p className="text-gray-600">Summary of your planned habits for today.</p>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-2">Today's Completed Habits</h2>
        <p className="text-gray-600">List of habits you've completed today.</p>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-2">Weekly Progress</h2>
        <p className="text-gray-600">Your progress chart or streak for this week.</p>
      </div>

      <div className="flex justify-center pt-4">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl shadow"
          onClick={handleQuickAddClick}>
          Quick Add Habit
        </button>
      </div>
    </div>
  );
}
