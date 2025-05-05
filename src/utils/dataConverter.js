/**
 * Utility function to convert API data to app data format
 * @param {Object} apiData - The API data from backend
 * @param {Array} weekDates - Array of Date objects for the current week view
 * @param {Array} timeSlots - Array of time slot names (e.g., "Morning", "Afternoon", "Evening")
 * @returns {Array} - Array of day objects for the current week
 */
export const convertApiDataToAppFormat = (apiData, weekDates, timeSlots) => {
    console.log("=== STARTING DATA CONVERSION ===");
    console.log("Converting API data to app format with weekDates:", weekDates);
    console.log("Input API data:", apiData);
    
    // Initialize the result array - one object per day of the week
    const result = weekDates.map(() => {
      const dayObj = {};
      timeSlots.forEach(slot => {
        dayObj[slot] = [];
      });
      return dayObj;
    });
    
    // Check if we have activities to process
    if (!apiData || !apiData.activities || apiData.activities.length === 0) {
      console.log("No activities found in API data");
      return result;
    }
    
    // Format each date in weekDates to match API date format for comparison
    const formattedWeekDates = weekDates.map(date => {
      return formatDateForAPI(date);
    });
    
    console.log("Formatted week dates for comparison:", formattedWeekDates);
    
    // Process each activity
    apiData.activities.forEach(activity => {
      console.log("Processing activity:", activity);
      
      // Skip if activity doesn't have required data
      if (!activity.dates || !activity.timeOfDay) {
        console.log("Skipping activity due to missing data:", activity);
        return;
      }
      
      // Get habit information
      const habitName = activity.habit ? activity.habit.habitName : 'Unknown Activity';
      const habitId = activity.habit ? activity.habit.habitId : null;
      
      console.log(`Activity: ${habitName}, Dates:`, activity.dates);
      
      // Process each date in the activity
      activity.dates.forEach((dateStr, dateIndex) => {
        console.log(`Processing date ${dateStr} at index ${dateIndex}`);
        
        // Find which day of the week this date corresponds to
        const dayIndex = formattedWeekDates.findIndex(weekDate => {
          const match = weekDate === dateStr;
          console.log(`Comparing ${weekDate} with ${dateStr}: ${match ? 'MATCH' : 'no match'}`);
          return match;
        });
        
        // Skip if date is not in current week
        if (dayIndex === -1) {
          console.log(`Date ${dateStr} not in current week, skipping`);
          return;
        }
        
        // Get time slot for this date (handle both array and single value formats)
        let timeSlot;
        if (Array.isArray(activity.timeOfDay)) {
          timeSlot = activity.timeOfDay[dateIndex] || activity.timeOfDay[0];
        } else {
          timeSlot = activity.timeOfDay;
        }
        
        // Skip if time slot is not valid
        if (!timeSlots.includes(timeSlot)) {
          console.log(`Invalid time slot ${timeSlot} for date ${dateStr}, skipping`);
          return;
        }
        
        // Get duration for this date (handle both array and single value formats)
        let minDuration, maxDuration;
        if (Array.isArray(activity.times)) {
          minDuration = activity.times[dateIndex] || activity.times[0] || 15;
          maxDuration = activity.times[dateIndex] || activity.times[0] || 60;
        } else if (typeof activity.times === 'number') {
          minDuration = maxDuration = activity.times;
        } else {
          minDuration = 15;
          maxDuration = 60;
        }
        
        // Get completion status (handle both array and boolean formats)
        let completed;
        if (Array.isArray(activity.status)) {
          completed = !!activity.status[dateIndex]; // Convert to boolean
        } else {
          completed = !!activity.status; // Convert to boolean
        }
        
        // Create plan item
        const planItem = {
          name: habitName,
          type: habitName, // Using habit name as type
          planName: activity.planName,
          minDuration: minDuration,
          maxDuration: maxDuration,
          completed: completed,
          habitId: habitId
        };
        
        console.log(`Adding activity to day ${dayIndex}, time slot ${timeSlot}:`, planItem);
        
        // Add to result
        result[dayIndex][timeSlot].push(planItem);
      });
    });
    
    console.log("Converted result:", result);
    console.log("=== CONVERSION COMPLETE ===");
    return result;
  };
  
  /**
   * Format date for API (YYYY-MM-DD)
   * @param {Date} date - The date to format
   * @returns {String} - Formatted date string
   */
  export const formatDateForAPI = (date) => {
    // Ensure we have a valid date object
    const d = new Date(date);
    // Make sure to use UTC methods to avoid timezone issues
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    const formatted = `${year}-${month}-${day}`;
    console.log(`Formatting date ${d.toISOString()} to ${formatted}`);
    return formatted;
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
    // Create a new date object for today
    const now = new Date();
    // Get the current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = now.getDay();
    
    // Calculate how many days to subtract to get to Monday
    // If today is Sunday (0), we need to go back 6 days to get to the previous Monday
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    // Create a new date for Monday of the current week
    const mondayOfCurrentWeek = new Date(now);
    mondayOfCurrentWeek.setDate(now.getDate() - daysToSubtract);
    
    // Reset hours, minutes, seconds, and milliseconds to avoid time-related issues
    mondayOfCurrentWeek.setHours(0, 0, 0, 0);
    
    // Apply the week offset (0 = current week, -1 = previous week, 1 = next week)
    const startDate = new Date(mondayOfCurrentWeek);
    startDate.setDate(mondayOfCurrentWeek.getDate() + (weekOffset * 7));
    
    console.log(`Week start date for offset ${weekOffset}:`, startDate.toISOString());
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
      // Make sure time is set to midnight to avoid time-related issues
      date.setHours(0, 0, 0, 0);
      weekDates.push(date);
    }
    
    console.log("Generated week dates:");
    weekDates.forEach((date, i) => {
      console.log(`Day ${i+1}:`, date.toISOString(), formatDateForAPI(date));
    });
    
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
    const nextActivityId = Math.max(...updatedApiData.activities.map(a => a.activityId || 0), 0) + 1;
    
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
      status: [false],
      planName: newActivity.planName
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