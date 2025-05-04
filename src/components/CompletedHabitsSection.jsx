import React, { useState } from 'react';
import dummyPlans from '../data/dummyPlan';

const today = new Date().toLocaleDateString('sv-SE'); // "2025-05-03"

export default function CompletedHabitsBox() {
  const [selectedPlan, setSelectedPlan] = useState(dummyPlans[0]?.planName || '');
  const [plans, setPlans] = useState(dummyPlans);

  const handleSelectPlan = (e) => {
    setSelectedPlan(e.target.value);
  };

  const handleToggle = (activityId, index) => {
    const updatedPlans = plans.map(plan => {
      if (plan.planName !== selectedPlan) return plan;

      const updatedActivities = plan.activities.map(activity => {
        if (activity.activityId !== activityId) return activity;

        const newStatus = [...activity.status];
        newStatus[index] = !newStatus[index];

        return {
          ...activity,
          status: newStatus
        };
      });

      return {
        ...plan,
        activities: updatedActivities
      };
    });

    setPlans(updatedPlans);
  };

  const selectedPlanData = plans.find(plan => plan.planName === selectedPlan);

  const todayActivities = selectedPlanData
    ? selectedPlanData.activities.flatMap(activity =>
        activity.dates.map((date, index) => ({
          activityId: activity.activityId,
          habit: activity.habit,
          date,
          index,
          timeOfDay: activity.timeOfDay[index],
          time: activity.times[index],
          status: activity.status[index]
        }))
      ).filter(entry => entry.date === today)
    : [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-black-500 relative cursor-default">
      <h2 className="text-2xl text-purple-500 mb-4">Today's Completed Habits</h2>

      {/* Plan selector (right top corner) */}
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
                onChange={() => handleToggle(entry.activityId, entry.index)}
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
