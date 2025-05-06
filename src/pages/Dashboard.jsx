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
  const [loading, setLoading] = useState(false);
  const [updatingActivity, setUpdatingActivity] = useState(null);

  const handleQuickAddClick = () => {
    navigate('/habits');
  };

  const fetchPlansFromServer = async (userId, token) => {
    setLoading(true);
    try {
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
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
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

  const handleToggle = async (activityId, dateIndex) => {
    // Set which activity is being updated to prevent multiple clicks
    const updateKey = `${activityId}-${dateIndex}`;
    if (updatingActivity === updateKey) return;
    setUpdatingActivity(updateKey);
    
    try {
      // Find the selected plan
      const plan = plans.find(p => p.planName === selectedPlan);
      if (!plan) {
        setUpdatingActivity(null);
        return;
      }

      // Find the activity by activityId
      const activity = plan.activities.find(a => a.activityId === activityId);
      if (!activity || !activity.status) {
        setUpdatingActivity(null);
        return;
      }

      const currentStatus = activity.status[dateIndex];
      const newStatus = !currentStatus;

      console.log(`Toggling activity ${activityId} date ${dateIndex} from ${currentStatus} to ${newStatus}`);

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
            activityId: activityId,
            dateIndex: dateIndex,
            newStatus: newStatus
          })
        }
      );

      const result = await res.json();
      console.log("API response:", result);
      
      if (result.success) {
        // Update local state to reflect the change immediately
        setPlans(prevPlans => {
          // Create a deep copy of the plans array to avoid mutation
          const newPlans = JSON.parse(JSON.stringify(prevPlans));
          
          // Find the plan and update the specific activity status
          const planIndex = newPlans.findIndex(p => p.planName === selectedPlan);
          if (planIndex >= 0) {
            const activityIndex = newPlans[planIndex].activities.findIndex(a => a.activityId === activityId);
            if (activityIndex >= 0) {
              newPlans[planIndex].activities[activityIndex].status[dateIndex] = newStatus;
            }
          }
          
          return newPlans;
        });
      } else {
        alert(result.message || 'Failed to update status');
        // Refresh plans from server to ensure consistency
        await fetchPlansFromServer(userInfo._id, token);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert('Error updating status: ' + err.message);
      
      // Refresh plans from server on error
      const token = localStorage.getItem('authToken');
      await fetchPlansFromServer(userInfo._id, token);
    } finally {
      setUpdatingActivity(null);
    }
  };

  // Extract today's activities from the selected plan
  const getTodayActivities = () => {
    if (!selectedPlan) return [];
    
    const planData = plans.find(plan => plan.planName === selectedPlan);
    if (!planData) return [];
    
    const activities = [];
    
    planData.activities.forEach(activity => {
      activity.dates.forEach((date, dateIndex) => {
        if (date === today) {
          activities.push({
            activityId: activity.activityId,
            habit: activity.habit,
            date,
            dateIndex,
            status: activity.status ? activity.status[dateIndex] : false
          });
        }
      });
    });
    
    return activities;
  };

  const todayActivities = getTodayActivities();

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
            disabled={loading}
          >
            {plans.map(plan => (
              <option key={plan.planName} value={plan.planName}>
                {plan.planName}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-gray-600 mt-6">Loading activities...</p>
        ) : todayActivities.length > 0 ? (
          <ul className="list-disc pl-5 mt-6 text-gray-800 space-y-2">
            {todayActivities.map((entry) => {
              const updateKey = `${entry.activityId}-${entry.dateIndex}`;
              const isUpdating = updatingActivity === updateKey;
              
              return (
                <li
                  key={updateKey}
                  className="flex items-center justify-between py-1 border-b border-gray-200"
                >
                  <div>
                    <span className="font-semibold text-purple-600">{entry.habit.habitName}</span> – {entry.habit.habitDescription}
                    <span className={`ml-2 text-sm font-semibold ${
                      entry.status ? 'text-green-600' : 'text-red-500'
                    }`}>
                      ({entry.status ? 'Completed' : 'Incomplete'})
                      {isUpdating && ' - Updating...'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={entry.status}
                    onChange={() => handleToggle(entry.activityId, entry.dateIndex)}
                    disabled={isUpdating}
                    className="ml-4 w-6 h-6 text-purple-500 focus:ring-purple-400 border-gray-300 rounded transition-transform duration-200 ease-in-out transform hover:scale-110 active:scale-95"
                  />
                </li>
              );
            })}
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
          disabled={loading}
        >
          Quick Add Habit
        </button>
      </div>
    </div>
  );
}