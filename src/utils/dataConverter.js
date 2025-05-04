// dataConverter.js
/**
 * Utility function to convert API data to app data format
 * @param {Object} apiData - The API data from backend
 * @param {Array} weekDates - Array of Date objects for the current week view
 * @param {Array} timeSlots - Array of time slot names (e.g., "Morning", "Afternoon", "Evening")
 * @returns {Array} - Array of day objects for the current week
 */
export const convertApiDataToAppFormat = (apiData, weekDates, timeSlots) => {
    if (!apiData || !weekDates || !timeSlots) {
      return [];
    }
  
    // Create empty week structure
    const emptyWeekPlans = weekDates.map(() => {
      const dayObj = {};
      timeSlots.forEach(slot => {
        dayObj[slot] = [];
      });
      return dayObj;
    });
  
    // Create a map of date strings to day indices for the current week view
    const dateToIndexMap = {};
    weekDates.forEach((date, index) => {
      dateToIndexMap[formatDateForAPI(date)] = index;
    });
  
    // Handle case where apiData is an array of plans or a single plan
    let activitiesArray = [];
    
    if (Array.isArray(apiData)) {
      // Collect all activities from all plans
      apiData.forEach(plan => {
        if (plan && plan.activities && Array.isArray(plan.activities)) {
          // Tag each activity with its parent plan name for reference
          const planActivities = plan.activities.map(activity => ({
            ...activity,
            planName: plan.planName || 'Unnamed Plan'
          }));
          activitiesArray = activitiesArray.concat(planActivities);
        }
      });
    } else if (apiData && apiData.activities) {
      // Handle single plan object
      activitiesArray = apiData.activities.map(activity => ({
        ...activity,
        planName: apiData.planName || 'Unnamed Plan'
      }));
    }
  
    // Process all the activities
    activitiesArray.forEach(activity => {
      if (!activity.dates || !Array.isArray(activity.dates)) {
        return;
      }
  
      activity.dates.forEach((dateStr, idx) => {
        // Check if this date is in the current week view
        if (dateStr in dateToIndexMap) {
          const dayIndex = dateToIndexMap[dateStr];
          const timeSlot = activity.timeOfDay[idx];
          const completed = activity.status[idx];
          const duration = activity.times[idx];
  
          if (!timeSlot || !timeSlots.includes(timeSlot)) {
            return; // Skip if timeSlot is invalid
          }
  
          // Add the activity to the appropriate day and time slot
          emptyWeekPlans[dayIndex][timeSlot].push({
            name: activity.habit.habitName,
            completed: completed,
            // Use the habit type directly instead of determining it
            type: activity.habit.type || activity.planName || 'Activity',
            minDuration: duration,
            maxDuration: duration,
            habitId: activity.habit.habitId,
            activityId: activity.activityId,
            dateStr: dateStr,
            description: activity.habit.habitDescription || '',
            image: activity.habit.habitImage || '',
            planName: activity.planName || 'Unnamed Plan'
          });
        }
      });
    });
  
    return emptyWeekPlans;
  };
  
  /**
   * Helper function to determine activity type
   * @param {Object} activity - The activity object from API
   * @returns {String} - The activity type
   */
  const getActivityType = (activity) => {
    // This is a placeholder - in a real app, you might determine the type
    // based on habit properties, categories, or other factors
    return activity.habit.habitName.includes('Running') || 
           activity.habit.habitName.includes('Yoga') ||
           activity.habit.habitName.includes('Gym') ? 'Sports' :
           activity.habit.habitName.includes('Learning') ||
           activity.habit.habitName.includes('Reading') ? 'Learning' :
           'Activity';
  };
  
  /**
   * Format date for API (YYYY-MM-DD)
   * @param {Date} date - The date to format
   * @returns {String} - Formatted date string
   */
  export const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  /**
   * Format date for display (e.g., "May 1")
   * @param {Date} date - The date to format
   * @returns {String} - Formatted date string
   */
  export const formatDateDisplay = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  /**
   * Calculate the start date of a week based on the current date and weekOffset
   * @param {Number} weekOffset - Offset from current week (0 = current week, -1 = last week, 1 = next week)
   * @returns {Date} - Start date of the specified week (Monday)
   */
  export const getWeekStartDate = (weekOffset = 0) => {
    const now = new Date();
    const dayOfWeek = now.getDay() || 7; // Convert Sunday (0) to 7 for easier calculation
    const mondayOffset = dayOfWeek - 1; // Days to subtract to get to Monday
    
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - mondayOffset + (weekOffset * 7));
    return startDate;
  };
  
  /**
   * Generate week dates based on a start date
   * @param {Date} startDate - The start date of the week (Monday)
   * @returns {Array} - Array of Date objects for each day of the week
   */
  export const generateWeekDates = (startDate) => {
    const weekDates = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      weekDates.push(date);
    }
    
    return weekDates;
  };
  
  /**
   * Create a week label based on start and end dates
   * @param {Date} startDate - The start date of the week
   * @returns {String} - Formatted week label (e.g., "May 1 - 7" or "Apr 30 - May 6")
   */
  export const createWeekLabel = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };
  
  /**
   * Check if a date is today
   * @param {Date} date - The date to check
   * @returns {Boolean} - Whether the date is today
   */
  export const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  /**
   * Update status of an activity in the API data
   * @param {Object} apiData - The API data
   * @param {Number} activityId - The activity ID
   * @param {String} dateStr - The date string (YYYY-MM-DD)
   * @param {Boolean} completed - The new completed status
   * @returns {Object} - Updated API data
   */
  export const updateActivityStatus = (apiData, activityId, dateStr, completed) => {
    const updatedApiData = { ...apiData };
    
    const activityToUpdate = updatedApiData.activities.find(a => a.activityId === activityId);
    if (activityToUpdate) {
      const dateIndex = activityToUpdate.dates.indexOf(dateStr);
      if (dateIndex !== -1) {
        activityToUpdate.status[dateIndex] = completed;
      }
    }
    
    return updatedApiData;
  };
  
  /**
   * Create a new activity in the API data
   * @param {Object} apiData - The API data
   * @param {Object} newActivity - The new activity details
   * @param {String} dateStr - The date string (YYYY-MM-DD)
   * @param {String} timeOfDay - The time of day ("Morning", "Afternoon", "Evening")
   * @returns {Object} - Updated API data with new activity
   */
  export const addActivityToApiData = (apiData, newActivity, dateStr, timeOfDay) => {
    const updatedApiData = { ...apiData };
    
    // Generate a unique activity ID
    const nextActivityId = Math.max(...updatedApiData.activities.map(a => a.activityId), 0) + 1;
    
    // Create the new activity in the API format
    const apiActivity = {
      activityId: nextActivityId,
      habit: {
        habitId: newActivity.habitId || `new-habit-${Date.now()}`,
        habitName: newActivity.name,
        habitDescription: newActivity.description || '',
        habitImage: newActivity.image || ''
      },
      dates: [dateStr],
      times: [newActivity.minDuration],
      timeOfDay: [timeOfDay],
      status: [false]
    };
    
    updatedApiData.activities.push(apiActivity);
    
    return updatedApiData;
  };
  
  /**
   * Delete an activity from the API data
   * @param {Object} apiData - The API data
   * @param {Number} activityId - The activity ID
   * @param {String} dateStr - The date string (YYYY-MM-DD)
   * @returns {Object} - Updated API data with activity removed
   */
  export const deleteActivityFromApiData = (apiData, activityId, dateStr) => {
    const updatedApiData = { ...apiData };
    
    const activityIndex = updatedApiData.activities.findIndex(a => a.activityId === activityId);
    if (activityIndex !== -1) {
      const activity = updatedApiData.activities[activityIndex];
      const dateIndex = activity.dates.indexOf(dateStr);
      
      if (dateIndex !== -1) {
        // If the activity has multiple dates, just remove this date
        if (activity.dates.length > 1) {
          activity.dates.splice(dateIndex, 1);
          activity.times.splice(dateIndex, 1);
          activity.timeOfDay.splice(dateIndex, 1);
          activity.status.splice(dateIndex, 1);
        } else {
          // If this is the only date, remove the entire activity
          updatedApiData.activities.splice(activityIndex, 1);
        }
      }
    }
    
    return updatedApiData;
  };