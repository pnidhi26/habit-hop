/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import WeeklyReport from '../components/WeeklyReport';
import TodaysActivityOverview from '../components/TodaysActivityOverview';

const today = new Date().toLocaleDateString('sv-SE');

export default function Dashboard() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleQuickAddClick = () => {
    navigate('/habits');
  };

  const fetchPlansFromServer = async (userId, token) => {
    const url = `https://habitstacker-821782230505.us-west1.run.app/api/getPlans/${userId}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const result = await res.json();
    if (result.success) {
      setPlans(result.plans);
      if (!selectedPlan && result.plans.length > 0) {
        setSelectedPlan(result.plans[0].planName);
      }
    } else {
      throw new Error(result.message || 'Failed to fetch plans');
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        const username = decoded.username;

        setUserInfo({ _id: userId, username });
        await fetchPlansFromServer(userId, token);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      }
    };

    fetchPlans();
  }, []);

  const handleToggle = async (activityIndex, dateIndex) => {
    const plan = plans.find(p => p.planName === selectedPlan);
    if (!plan) return;

    const activity = plan.activities[activityIndex];
    if (!activity || !activity.status) return;

    const currentStatus = activity.status[dateIndex];
    const newStatus = !currentStatus;

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(
        `https://habitstacker-821782230505.us-west1.run.app/api/updateActivityStatus/${userInfo._id}/${plan.planId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            activityId: activity.activityId,
            dateIndex,
            newStatus
          })
        }
      );

      const result = await res.json();
      if (result.success) {
        await fetchPlansFromServer(userInfo._id, token);
      } else {
        alert(result.message || 'Update failed');
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const selectedPlanData = plans.find(plan => plan.planName === selectedPlan);
  const planIndex = plans.findIndex(plan => plan.planName === selectedPlan);

  const todayActivities = selectedPlanData
    ? selectedPlanData.activities.flatMap((activity, activityIndex) =>
        activity.dates.map((date, dateIndex) => ({
          activityIndex,
          habit: activity.habit,
          date,
          dateIndex
        }))
      ).filter(entry => entry.date === today)
    : [];

  const getStatus = (activityIndex, dateIndex) => {
    const plan = plans[planIndex];
    if (!plan) return false;
    const activity = plan.activities[activityIndex];
    return activity?.status?.[dateIndex] ?? false;
  };

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

      <TodaysActivityOverview userId={userInfo?._id} plans={plans} />

      {/* Habits Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black-500 relative cursor-default">
        <h2 className="text-2xl text-purple-500 mb-4">Today's Completed Habits</h2>

        <div className="absolute top-6 right-6">
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="border border-purple-300 rounded px-3 py-1 text-sm text-purple-700 bg-white shadow-sm hover:border-purple-400"
          >
            {plans.map(plan => (
              <option key={plan.planName} value={plan.planName}>
                {plan.planName}
              </option>
            ))}
          </select>
        </div>

        {todayActivities.length > 0 ? (
          <ul className="list-disc pl-5 mt-6 text-gray-800 space-y-2">
            {todayActivities.map((entry, idx) => (
              <li
                key={`${entry.activityIndex}-${entry.dateIndex}`}
                className="flex items-center justify-between py-1 border-b border-gray-200"
              >
                <div>
                  <span className="font-semibold text-purple-600">{entry.habit.habitName}</span> – {entry.habit.habitDescription}
                  <span className={`ml-2 text-sm font-semibold ${
                    getStatus(entry.activityIndex, entry.dateIndex) ? 'text-green-600' : 'text-red-500'
                  }`}>
                    ({getStatus(entry.activityIndex, entry.dateIndex) ? 'Completed' : 'Incomplete'})
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={getStatus(entry.activityIndex, entry.dateIndex)}
                  onChange={() => handleToggle(entry.activityIndex, entry.dateIndex)}
                  className="ml-4 w-6 h-6 text-purple-500 focus:ring-purple-400 border-gray-300 rounded transition-transform duration-200 ease-in-out transform hover:scale-110 active:scale-95"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mt-6">No habits scheduled for today in "{selectedPlan}".</p>
        )}
      </div>

      <WeeklyReport userId={userInfo?._id} plans={plans} />

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
