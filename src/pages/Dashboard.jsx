/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../api/user';
import CompletedHabitsBox from '../components/CompletedHabitsSection';
import WeeklyReport from '../components/WeeklyReport';
import TodaysActivityOverview from '../components/TodaysActivityOverview';

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
        {new Date().toLocaleString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
      <p className="text-center text-gray-600">
        {userInfo ? `Welcome to your main dashboard, ${userInfo.username}!` : 'Welcome to your main dashboard!'}
      </p>

      <TodaysActivityOverview />
      <CompletedHabitsBox />
      <WeeklyReport />

      <div className="flex justify-center pt-4">
        <button
          className="bg-purple-600 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl shadow"
          onClick={handleQuickAddClick}
        >
          Quick Add Habit
        </button>
      </div>
    </div>
  );
}
