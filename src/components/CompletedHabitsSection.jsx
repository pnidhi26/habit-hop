import React, { useState, useEffect } from 'react';

const today = new Date().toLocaleDateString('sv-SE'); // e.g., "2025-05-03"

export default function CompletedHabitsBox({ plans, onToggleStatus }) {
  const [selectedPlan, setSelectedPlan] = useState('');

  useEffect(() => {
    if (plans.length > 0) {
      setSelectedPlan(plans[0].planName);
    }
  }, [plans]);

  const handleSelectPlan = (e) => {
    setSelectedPlan(e.target.value);
  };

  const selectedPlanData = plans.find(plan => plan.planName === selectedPlan);
  const planIndex = plans.findIndex(plan => plan.planName === selectedPlan);

  const todayActivities = selectedPlanData
  ? selectedPlanData.activities.flatMap((activity, activityIndex) =>
      activity.dates.map((date, dateIndex) => ({
        activityIndex, // 👈加上这个
        activityId: activity.activityId,
        habit: activity.habit,
        date,
        dateIndex,
        status: activity.status[dateIndex]
      }))
    ).filter(entry => entry.date === today)
  : [];


  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black-500 relative cursor-default">
      <h2 className="text-2xl text-purple-500 mb-4">Today's Completed Habits</h2>

      {/* Plan Selector */}
      <div className="absolute top-6 right-6">
        <select
          value={selectedPlan}
          onChange={handleSelectPlan}
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
            <li key={idx} className="flex items-center justify-between py-1 border-b border-gray-200">
              <div>
                <span className="font-semibold text-purple-600">{entry.habit.habitName}</span> – {entry.habit.habitDescription}
                <span className={`ml-2 text-sm font-semibold ${entry.status ? 'text-green-600' : 'text-red-500'}`}>
                  ({entry.status ? "Completed" : "Incomplete"})
                </span>
              </div>
              <input
                type="checkbox"
                checked={entry.status}
                onChange={() =>
                  onToggleStatus(
                    planIndex,
                    entry.activityId,
                    entry.dateIndex
                  )
                }
                className="ml-4 w-6 h-6 text-purple-500 focus:ring-purple-400 border-gray-300 rounded transition-transform duration-200 ease-in-out transform hover:scale-110 active:scale-95"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mt-6">No habits scheduled for today in "{selectedPlan}".</p>
      )}
    </div>
  );
}
