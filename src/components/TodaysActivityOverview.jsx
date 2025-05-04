import React from 'react';
import dummyPlan from '../data/dummyPlan';

const today = new Date().toLocaleDateString('sv-SE'); // e.g., "2025-05-03"

const todayHabitsByPlan = dummyPlan.map(plan => {
  const filteredActivities = plan.activities.filter(activity =>
    activity.dates.includes(today)
  );
  return {
    planName: plan.planName,
    activities: filteredActivities
  };
}).filter(plan => plan.activities.length > 0);

export default function TodaysActivityOverview() {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border-2 border-black-500">
      <h2 className="text-xl font-semibold text-purple-500 mb-4">Today's Activity Overview</h2>
      {todayHabitsByPlan.length > 0 ? (
        todayHabitsByPlan.map((plan) => (
          <div key={plan.planName} className="mb-4 text-gray-700 space-y-1">
            <p className="font-semibold text-purple-600">Plan: {plan.planName}</p>
            <ul className="list-disc pl-5">
              {plan.activities.map((activity) => (
                <li key={activity.activityId} className="text-sm">
                  {activity.habit.habitName} – {activity.habit.habitDescription}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No planned habits for today.</p>
      )}
    </div>
  );
}
