/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit, Trash2, Clock, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Plans.css';
import {
  convertApiDataToAppFormat,
  formatDateForAPI,
  formatDateDisplay,
  getWeekStartDate,
  generateWeekDates,
  createWeekLabel,
  isToday,
  updateActivityStatus
} from '../utils/dataConverter';
import dummyPlans from '../data/dummyPlan';
import dummyHabitList from '../data/dummyHabitList';
import { jwtDecode } from 'jwt-decode';
import { getPlans, createPlan, updatePlan, deletePlan } from '../services/planService';
import { addActivity, updateActivity, deleteActivity, toggleActivityStatus } from '../services/activityService';

const API_BASE_URL = 'http://localhost:8080';

// Debug function to help identify date issues
const debugDates = (weekDates, apiData) => {
  console.log("=== DEBUG DATE INFORMATION ===");
  console.log("Current Date:", new Date().toISOString());

  // Log formatted week dates
  console.log("Week Dates:");
  weekDates.forEach((date, index) => {
    console.log(`Day ${index + 1}:`, {
      date: date.toISOString(),
      formatted: formatDateForAPI(date)
    });
  });

  // Log activity dates from API
  if (apiData && apiData.activities) {
    console.log("API Activity Dates:");
    apiData.activities.forEach((activity, index) => {
      console.log(`Activity ${index + 1}:`, {
        name: activity.habit?.habitName || 'Unknown',
        dates: activity.dates,
        timeOfDay: activity.timeOfDay
      });
    });
  }

  console.log("=== END DEBUG INFO ===");
};

export default function Plans() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ day: "", timeSlot: "", plans: [] });
  const [showAddPlanPopup, setShowAddPlanPopup] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // New states for week navigation
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, -1 = last week, 1 = next week
  const [currentWeekDates, setCurrentWeekDates] = useState([]);
  const [weekLabel, setWeekLabel] = useState('');

  // New states for editing activities and plan names
  const [showEditActivityPopup, setShowEditActivityPopup] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [showEditPlanNamePopup, setShowEditPlanNamePopup] = useState(false);
  const [editedPlanName, setEditedPlanName] = useState('');

  // New states for min and max duration and activity selection
  const [editedMinDuration, setEditedMinDuration] = useState(15); // Default 15 minutes
  const [editedMaxDuration, setEditedMaxDuration] = useState(60); // Default 60 minutes
  const [selectedPredefinedActivity, setSelectedPredefinedActivity] = useState('');

  // New state for predefined activity selection popup
  const [showActivitySelectionPopup, setShowActivitySelectionPopup] = useState(false);

  // Predefined activities with suggested durations and images
  const [predefinedActivities, setPredefinedActivities] = useState(dummyHabitList);

  // Sample data 
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  // API data state
  const [apiData, setApiData] = useState({ activities: [] });
  const [userHabits, setUserHabits] = useState([]);

  // Plan templates state (from real API data)
  const [planTemplates, setPlanTemplates] = useState([]);
  const [activePlanTemplate, setActivePlanTemplate] = useState('');
  const [currentPlans, setCurrentPlans] = useState([]);

  const [repeatActivity, setRepeatActivity] = useState(false);

  const closeEditActivityPopup = () => {
    setShowEditActivityPopup(false);
    setRepeatActivity(false); // Reset the repeat checkbox
  };

  const closeActivitySelectionPopup = () => {
    setShowActivitySelectionPopup(false);
    setRepeatActivity(false); // Reset the repeat checkbox
  };

  // Function to fetch plans data from the API
  const fetchPlansData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Fetch plans using the service
      const data = await getPlans(userId);

      console.log("API Response Data:", data);

      if (data.success) {
        // Format the data to match our application structure
        const formattedData = {
          activities: []
        };

        // Extract plans and their activities
        if (data.plans && data.plans.length > 0) {
          // Create plan templates from the plans
          const templates = data.plans.map(plan => ({
            name: plan.planName,
            planId: plan.planId,
            plans: []
          }));
          setPlanTemplates(templates);

          // Set active plan template to the first plan if not already set
          if (!activePlanTemplate && templates.length > 0) {
            setActivePlanTemplate(templates[0].name);
          }

          // Process activities for each plan
          data.plans.forEach(plan => {
            console.log(`Processing plan: ${plan.planName}`, plan);

            if (plan.activities && plan.activities.length > 0) {
              plan.activities.forEach(activity => {
                console.log(`Processing activity in plan ${plan.planName}:`, activity);

                if (activity.dates && activity.dates.length > 0) {
                  const activityObj = {
                    activityId: activity._id || Date.now() + Math.random(), // Generate a unique ID
                    planName: plan.planName,
                    habit: activity.habit,
                    dates: activity.dates,
                    times: activity.times || Array(activity.dates.length).fill(30),
                    timeOfDay: activity.timeOfDay,
                    status: activity.status || Array(activity.dates.length).fill(false)
                  };

                  console.log("Created activity object:", activityObj);
                  formattedData.activities.push(activityObj);
                } else {
                  console.log("Activity has no dates, skipping", activity);
                }
              });
            } else {
              console.log(`Plan ${plan.planName} has no activities`);
            }
          });
        }

        console.log("Setting API data:", formattedData);
        setApiData(formattedData);
      } else {
        console.error('Failed to fetch plans:', data.message);
      }

      // Also fetch habits to use for activity selection
      const habitsResponse = await fetch(
        `${API_BASE_URL}/api/getHabits/${userId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      const habitsData = await habitsResponse.json();

      if (habitsData.success && habitsData.habits) {
        // Format habits to match our predefined activities structure
        const formattedHabits = habitsData.habits.map(habit => ({
          id: habit.habitId,
          name: habit.habitName,
          type: habit.habitName, // Using habit name as type
          icon: '🔄', // Default icon as fallback
          habitImage: habit.habitImage, // Add the habit image here
          minDuration: 15,
          maxDuration: 60
        }));

        setPredefinedActivities([...formattedHabits]);
      }

    } catch (error) {
      console.error('Error fetching plans data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch data for a specific week
  const fetchWeekData = (weekOffset) => {
    setLoading(true);
    fetchPlansData().then(() => {
      setLoading(false);
    });
  };

  // Fetch plans data when component mounts
  useEffect(() => {
    fetchPlansData();
  }, []);

  // Function to navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
    fetchWeekData(currentWeekOffset - 1);
  };

  // Function to navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
    fetchWeekData(currentWeekOffset + 1);
  };

  // Function to reset to current week
  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
    fetchWeekData(0);
  };

  // Effect to initialize week dates and update when week offset changes
  useEffect(() => {
    // Calculate the start date for the week
    const startDate = getWeekStartDate(currentWeekOffset);
    console.log(`Week start date for offset ${currentWeekOffset}:`, startDate.toISOString());

    // Generate the dates for each day of the week
    const weekDates = generateWeekDates(startDate);
    console.log("Generated week dates:", weekDates.map(d => d.toISOString()));
    setCurrentWeekDates(weekDates);

    // Create the week label
    const label = createWeekLabel(startDate);
    console.log("Week label:", label);
    setWeekLabel(label);

  }, [currentWeekOffset]);

  // Effect to update current plans when week dates or API data changes
  useEffect(() => {
    if (currentWeekDates.length > 0 && apiData.activities) {
      // Debug dates to help troubleshoot date mismatches
      debugDates(currentWeekDates, apiData);

      // First convert API data to app format
      const convertedPlans = convertApiDataToAppFormat(apiData, currentWeekDates, timeSlots);
      console.log("Converted plans:", convertedPlans);

      // Then filter by active plan name, not by activity type
      const filteredPlans = convertedPlans.map(dayObj => {
        const filteredDay = {};
        Object.keys(dayObj).forEach(timeSlot => {
          filteredDay[timeSlot] = dayObj[timeSlot].filter(activity =>
            activity.planName === activePlanTemplate
          );
        });
        return filteredDay;
      });

      console.log("Filtered plans for active template:", activePlanTemplate, filteredPlans);
      setCurrentPlans(filteredPlans);
    }
  }, [currentWeekDates, apiData, activePlanTemplate]);

  const handleOverflowClick = (dayIndex, timeSlot) => {
    // Allow viewing plans in both modes, but with different behaviors
    const dayPlans = currentPlans[dayIndex][timeSlot];

    setPopupContent({
      day: daysOfWeek[dayIndex],
      date: formatDateDisplay(currentWeekDates[dayIndex]),
      timeSlot: timeSlot,
      plans: dayPlans,
      dayIndex: dayIndex // Store the day index for updating plans from popup
    });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Function to handle plan template selection
  const handlePlanTemplateClick = (templateName) => {
    if (templateName === 'Add plan') {
      // Open add plan popup
      setShowAddPlanPopup(true);
      return;
    }

    // Set the active plan template
    setActivePlanTemplate(templateName);
  };

  // Function to toggle completion status of an activity
  const toggleCompletionStatusUI = async (dayIndex, timeSlot, planIndex) => {
    // Don't allow toggling completion in edit mode
    if (editMode) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Find the active plan
      const activePlan = planTemplates.find(t => t.name === activePlanTemplate);
      if (!activePlan || !activePlan.planId) {
        throw new Error('No active plan selected');
      }

      // Get the activity data
      const activity = currentPlans[dayIndex][timeSlot][planIndex];

      // Update UI immediately for better user experience
      // Create a deep copy of current plans
      const updatedPlans = JSON.parse(JSON.stringify(currentPlans));

      // Toggle the completed status
      updatedPlans[dayIndex][timeSlot][planIndex].completed =
        !updatedPlans[dayIndex][timeSlot][planIndex].completed;

      setCurrentPlans(updatedPlans);

      // Call the API to toggle the status
      const dateStr = formatDateForAPI(currentWeekDates[dayIndex]);
      console.log(`Toggling status for date ${dateStr}, activity:`, activity);

      const response = await toggleActivityStatus(
        userId,
        activePlan.planId,
        activity.habitId,
        planIndex // Using planIndex as the dateIndex
      );

      console.log("Toggle status API response:", response);

      // If the API call fails, refresh data to ensure UI is in sync
      if (!response || !response.success) {
        await fetchPlansData();
      }

    } catch (error) {
      console.error('Error toggling activity status:', error);
      // Revert UI change if API call failed
      await fetchPlansData();
    }
  };

  // Function to toggle completion status from popup
  const togglePopupCompletionStatusUI = async (planIndex) => {
    // Don't allow toggling completion in edit mode
    if (editMode) return;

    try {
      const { dayIndex, timeSlot } = popupContent;
      const activity = popupContent.plans[planIndex];

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Find the active plan
      const activePlan = planTemplates.find(t => t.name === activePlanTemplate);
      if (!activePlan || !activePlan.planId) {
        throw new Error('No active plan selected');
      }

      // Update UI immediately for better user experience
      // Create a deep copy of current plans
      const updatedPlans = JSON.parse(JSON.stringify(currentPlans));

      // Toggle the completed status
      updatedPlans[dayIndex][timeSlot][planIndex].completed =
        !updatedPlans[dayIndex][timeSlot][planIndex].completed;

      setCurrentPlans(updatedPlans);

      // Update the popup content to reflect the change
      const updatedPopupPlans = [...popupContent.plans];
      updatedPopupPlans[planIndex].completed = !updatedPopupPlans[planIndex].completed;

      setPopupContent({
        ...popupContent,
        plans: updatedPopupPlans
      });

      // Call the API to toggle the status
      const response = await toggleActivityStatus(
        userId,
        activePlan.planId,
        activity.habitId,
        planIndex
      );

      // If the API call fails, refresh data to ensure UI is in sync
      if (!response || !response.success) {
        await fetchPlansData();
      }

    } catch (error) {
      console.error('Error toggling activity status:', error);
      // Revert UI change if API call failed
      await fetchPlansData();
    }
  };

  // Function to handle adding a new plan category
  const handleAddPlan = async () => {
    if (!newPlanName.trim()) return;

    // Check for duplicate plan names
    const isDuplicate = planTemplates.some(template =>
      template.name.toLowerCase() === newPlanName.trim().toLowerCase()
    );

    if (isDuplicate) {
      alert('A plan with this name already exists. Please choose a different name.');
      return;
    }

    setLoading(true);

    try {
      // Get the user ID from JWT token
      const token = localStorage.getItem('authToken');
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Create the plan using the service
      const data = await createPlan(userId, newPlanName);

      if (!data.success) {
        throw new Error(data.message || 'Failed to create plan');
      }

      // Create new plan template for the UI
      const newPlanTemplate = {
        name: newPlanName,
        planId: data.plan.planId,
        plans: []
      };

      // Add new plan template to the list
      const updatedTemplates = [...planTemplates, newPlanTemplate];
      setPlanTemplates(updatedTemplates);
      setActivePlanTemplate(newPlanName);

      setNewPlanName('');
      setShowAddPlanPopup(false);

      // Refresh plans data
      fetchPlansData();

    } catch (error) {
      console.error('Error creating plan:', error);
      // Optionally show an error message to the user
      alert(`Failed to create plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (name) => {
    // Check if this is the last plan
    if (planTemplates.length <= 1) {
      alert("You must have at least one plan. Please create a new plan before deleting this one.");
      return;
    }

    // Custom confirmation dialog with more information
    const confirmDeleteText = `Are you sure you want to delete the plan "${name}"?\n\nThis will permanently remove the plan and all its activities. This action cannot be undone.`;
    const confirmDelete = window.confirm(confirmDeleteText);

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Find the plan template to delete
      const templateToDelete = planTemplates.find(t => t.name === name);

      if (!templateToDelete || !templateToDelete.planId) {
        throw new Error('Plan not found or missing planId');
      }

      // Delete the plan using the service
      const data = await deletePlan(userId, templateToDelete.planId);

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete plan');
      }

      // Update UI after successful API response
      const filtered = planTemplates.filter(t => t.name !== name);
      setPlanTemplates(filtered);

      // Since we've verified there's more than one plan, we can safely 
      // switch to another plan if the active one was deleted
      if (activePlanTemplate === name) {
        // Select the first plan in the filtered list
        setActivePlanTemplate(filtered[0].name);
      }

      // Clear any related data in current plans
      const updatedApiData = { ...apiData };
      updatedApiData.activities = updatedApiData.activities.filter(
        activity => activity.planName !== name
      );
      setApiData(updatedApiData);

      // Show success message
      alert(`Plan "${name}" was successfully deleted.`);

    } catch (error) {
      console.error('Error deleting plan:', error);
      alert(`Failed to delete plan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle opening edit plan name popup
  const handleEditPlanNameClick = (name) => {
    setEditedPlanName(name);
    setShowEditPlanNamePopup(true);
  };

  // Function to save edited plan name
  const savePlanNameEdit = async () => {
    if (!editedPlanName.trim()) {
      alert("Plan name cannot be empty");
      return;
    }

    // Check for duplicate plan names
    const isDuplicate = planTemplates.some(template =>
      template.name.toLowerCase() === editedPlanName.trim().toLowerCase() &&
      template.name !== activePlanTemplate
    );

    if (isDuplicate) {
      alert('A plan with this name already exists. Please choose a different name.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Find the plan template to update
      const templateToUpdate = planTemplates.find(t => t.name === activePlanTemplate);

      if (!templateToUpdate || !templateToUpdate.planId) {
        throw new Error('Plan not found or missing planId');
      }

      // Update the plan using the service
      const data = await updatePlan(userId, templateToUpdate.planId, editedPlanName.trim());

      if (!data.success) {
        throw new Error(data.message || 'Failed to update plan name');
      }

      // Update UI with the new plan name
      const updatedTemplates = planTemplates.map(template => {
        if (template.name === activePlanTemplate) {
          return { ...template, name: editedPlanName.trim() };
        }
        return template;
      });

      // Also update any activities that reference this plan name
      const updatedApiData = { ...apiData };
      updatedApiData.activities = updatedApiData.activities.map(activity => {
        if (activity.planName === activePlanTemplate) {
          return { ...activity, planName: editedPlanName.trim() };
        }
        return activity;
      });

      setPlanTemplates(updatedTemplates);
      setActivePlanTemplate(editedPlanName.trim());
      setApiData(updatedApiData);
      setShowEditPlanNamePopup(false);

      // Show success message
      alert(`Plan name updated successfully to "${editedPlanName.trim()}"`);

    } catch (error) {
      console.error('Error updating plan name:', error);
      alert(`Failed to update plan name: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to open edit activity popup
  const openEditActivityPopup = (activity, dayIndex, timeSlot, activityIndex) => {
    setActivityToEdit({
      activity,
      dayIndex,
      timeSlot,
      activityIndex
    });

    // Set duration values from the activity
    setEditedMinDuration(activity.minDuration || 15);
    setEditedMaxDuration(activity.maxDuration || 60);
    setSelectedPredefinedActivity(''); // Clear any previously selected predefined activity

    // Open activity selection popup first
    setShowActivitySelectionPopup(true);
  };

  // Function to handle the selection of a predefined activity
  const handlePredefinedActivitySelect = (activityId) => {
    setSelectedPredefinedActivity(activityId);

    if (activityId) {
      const selectedActivity = predefinedActivities.find(act => act.id === activityId);
      if (selectedActivity) {
        setEditedMinDuration(selectedActivity.minDuration);
        setEditedMaxDuration(selectedActivity.maxDuration);
      }
    }

    // Close the activity selection popup and open the edit popup
    setShowActivitySelectionPopup(false);
    setShowEditActivityPopup(true);
  };

  // Function to navigate to custom habit creation
  const goToCustomHabitCreation = () => {
    setShowActivitySelectionPopup(false);
    navigate('/add-habit');
  };

  // Function to save edited activity
  // Function to save edited activity
  // Function to save edited activity
  const saveActivityEdit = async () => {
    if (!selectedPredefinedActivity || !activityToEdit) return;

    const { dayIndex, timeSlot, activityIndex } = activityToEdit;
    const selectedActivity = predefinedActivities.find(act => act.id === selectedPredefinedActivity);

    if (!selectedActivity) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Find the active plan
      const activePlan = planTemplates.find(t => t.name === activePlanTemplate);
      if (!activePlan || !activePlan.planId) {
        throw new Error('No active plan selected');
      }

      // Format the date string for the selected day
      const date = formatDateForAPI(currentWeekDates[dayIndex]);
      console.log(`Activity date: ${date} for day index ${dayIndex}`);

      if (activityIndex >= 0) {
        // Editing existing activity
        const activity = currentPlans[dayIndex][timeSlot][activityIndex];

        console.log("Updating existing activity:", activity);

        // Check if we're changing the habit (activity type)
        if (selectedActivity.id !== activity.habitId) {
          console.log("Changing habit from", activity.habitId, "to", selectedActivity.id);

          // If we're changing to a different habit, we need to:
          // 1. Delete the old activity
          // 2. Add a new activity with the new habit

          // First delete the existing activity
          await deleteActivity(
            userId,
            activePlan.planId,
            activity.habitId,
            activityIndex
          );

          // Then add a new activity with the new habit
          await addActivity(
            userId,
            activePlan.planId,
            selectedActivity.id,
            date,
            editedMinDuration,
            timeSlot,
            repeatActivity
          );
        } else {
          // Just updating time/timeOfDay of the same habit
          await updateActivity(
            userId,
            activePlan.planId,
            activity.habitId,
            activityIndex,
            {
              time: editedMinDuration,
              timeOfDay: timeSlot,
              repeat: repeatActivity
            }
          );
        }
      } else {
        // Adding new activity
        console.log(`Adding new activity for ${date}, ${timeSlot}:`, selectedActivity);
        await addActivity(
          userId,
          activePlan.planId,
          selectedActivity.id,
          date,
          editedMinDuration,
          timeSlot,
          repeatActivity
        );
      }

      // Reset states
      setSelectedPredefinedActivity('');
      setRepeatActivity(false);
      setShowEditActivityPopup(false);

      // Also close the overflow popup if it's open
      setShowPopup(false);

      // Refresh data
      await fetchPlansData();

    } catch (error) {
      console.error('Error saving activity:', error);
      alert(`Failed to save activity: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete an activity
  const deleteActivityUI = async (dayIndex, timeSlot, activityIndex, fromPopup = false) => {
    // Ask for confirmation
    const confirmDelete = window.confirm("Are you sure you want to delete this activity?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Find the active plan
      const activePlan = planTemplates.find(t => t.name === activePlanTemplate);
      if (!activePlan || !activePlan.planId) {
        throw new Error('No active plan selected');
      }

      // Get the activity to delete
      const activityToDelete = currentPlans[dayIndex][timeSlot][activityIndex];
      console.log("Deleting activity:", activityToDelete, "at index", activityIndex);

      // Delete the activity through the API
      // Send both the habitId and the exact dateIndex to ensure correct deletion
      await deleteActivity(
        userId,
        activePlan.planId,
        activityToDelete.habitId,
        activityIndex
      );

      // If we're in popup view, update the popup content
      if (fromPopup) {
        const updatedPopupPlans = [...popupContent.plans];
        updatedPopupPlans.splice(activityIndex, 1);

        setPopupContent({
          ...popupContent,
          plans: updatedPopupPlans
        });
      }

      // Close any open popups
      setShowPopup(false);

      // Refresh plans data
      await fetchPlansData();

    } catch (error) {
      console.error('Error deleting activity:', error);
      alert(`Failed to delete activity: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // Function to open add activity popup from specific day/timeslot
  const openAddActivityPopup = (dayIndex, timeSlot) => {
    setActivityToEdit({
      activity: null,
      dayIndex,
      timeSlot,
      activityIndex: -1 // Indicator that we're adding new
    });

    // Reset durations to defaults
    setEditedMinDuration(15);
    setEditedMaxDuration(60);
    setSelectedPredefinedActivity('');

    // Open activity selection popup first
    setShowActivitySelectionPopup(true);
  };

  // Function to handle the top right + button click
  const handleAddActivityClick = () => {
    // Don't allow adding activities in edit mode
    if (editMode) return;

    // If a plan is selected, open the add activity popup for the first available slot
    if (currentPlans && currentPlans.length > 0) {
      // Find the first available day and time slot
      for (let dayIndex = 0; dayIndex < daysOfWeek.length; dayIndex++) {
        for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
          const timeSlot = timeSlots[slotIndex];
          // Use this day and time slot for adding a new activity
          setActivityToEdit({
            activity: null,
            dayIndex,
            timeSlot,
            activityIndex: -1 // Indicator that we're adding new
          });

          // Reset durations to defaults
          setEditedMinDuration(15);
          setEditedMaxDuration(60);
          setSelectedPredefinedActivity('');

          // Open activity selection popup first
          setShowActivitySelectionPopup(true);
          return;
        }
      }
    } else {
      // If no plan is selected, suggest adding a plan first
      setShowAddPlanPopup(true);
    }
  };

  // Helper function for formatting duration for display
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  return (
    <div className="plans-container">
      {loading && (
        <div className="week-loading">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="plans-header">
        <div>
          <h1 className="plans-title">Plans</h1>
          <p className="plans-subtitle">Welcome to your Plans!</p>
        </div>
        <div className="header-buttons">
          <button
            className={`edit-plan-button ${editMode ? 'active' : ''}`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'DONE' : <Edit size={20} />}
          </button>
          <button
            className={`add-button ${editMode ? 'disabled' : ''}`}
            onClick={!editMode ? handleAddActivityClick : undefined}
            disabled={editMode}
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="categories-container">
        {planTemplates.map((template, index) => (
          <div
            key={index}
            className={`category-item ${activePlanTemplate === template.name ? 'active-category' : ''}`}
            onClick={() => !editMode && handlePlanTemplateClick(template.name)}
          >
            <span>{template.name}</span>
            {editMode && (
              <div className="category-edit-controls">
                <button
                  className="edit-template-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPlanNameClick(template.name);
                  }}
                >
                  <Edit size={14} />
                </button>
                <button
                  className="delete-template-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTemplate(template.name);
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
        {!editMode && (
          <div className="category-item" onClick={() => handlePlanTemplateClick('Add plan')}>
            <div className="category-icon"><Plus size={16} /></div>
            <span>Add plan</span>
          </div>
        )}
      </div>

      {/* Week Navigation Controls */}
      <div className="week-navigation">
        <button
          className="nav-button prev-week-button"
          onClick={goToPreviousWeek}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="current-week" onClick={goToCurrentWeek}>
          <Calendar size={16} />
          <span>{weekLabel}</span>
          {currentWeekOffset === 0 && (
            <span className="current-week-indicator">Current Week</span>
          )}
        </div>

        <button
          className="nav-button next-week-button"
          onClick={goToNextWeek}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="weekdays-header">
        {currentWeekDates.map((date, index) => (
          <div
            key={index}
            className={`weekday ${isToday(date) ? 'is-today' : ''}`}
          >
            <div>{daysOfWeek[index]}</div>
            <div className="date-display">{formatDateDisplay(date)}</div>
            {isToday(date) && <div className="today-indicator"></div>}
          </div>
        ))}
      </div>

      <div className="timeslots-container">
        {timeSlots.map((slot, timeIndex) => (
          <div key={timeIndex} className="timeslot">
            <div className="timeslot-header">
              <span className="timeslot-name">{slot}</span>
              {slot === 'Morning' && <span className="timeslot-icon">☀️</span>}
              {slot === 'Afternoon' && <span className="timeslot-icon">🕑</span>}
              {slot === 'Evening' && <span className="timeslot-icon">🌙</span>}
            </div>
            <div className="timeslot-grid">
              {daysOfWeek.map((_, dayIndex) => {
                const dayPlans = currentPlans[dayIndex]?.[slot] || [];
                const hasOverflow = dayPlans.length > 2;
                const displayPlans = hasOverflow ? dayPlans.slice(0, 2) : dayPlans;

                return (
                  <div key={dayIndex} className={`day-cell ${dayPlans.length === 0 ? 'empty-day' : ''}`}>
                    {displayPlans.map((plan, planIndex) => (
                      <div
                        key={planIndex}
                        className={`plan-item ${plan.completed ? 'completed' : ''}`}
                        onClick={() => !editMode && toggleCompletionStatusUI(dayIndex, slot, planIndex)}
                      >
                        <div className="plan-name">{plan.name}</div>
                        {/* Duration badge */}
                        <div className="duration-badge">
                          <Clock size={10} />
                          {plan.minDuration === plan.maxDuration ?
                            formatDuration(plan.minDuration) :
                            `${formatDuration(plan.minDuration)}-${formatDuration(plan.maxDuration)}`}
                        </div>
                        {plan.completed && !editMode && <div className="check-icon"><Check size={12} /></div>}
                        {editMode && (
                          <div className="plan-edit-controls">
                            <button
                              className="edit-plan-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditActivityPopup(plan, dayIndex, slot, planIndex);
                              }}
                            >
                              <Edit size={11} />
                            </button>
                            <button
                              className="delete-plan-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteActivityUI(dayIndex, slot, planIndex);
                              }}
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {hasOverflow && (
                      <div
                        className="overflow-indicator"
                        onClick={() => handleOverflowClick(dayIndex, slot)}
                      >
                        +{dayPlans.length - 2}
                      </div>
                    )}
                    {dayPlans.length === 0 && (
                      <div className="empty-day-indicator">No activities</div>
                    )}
                    {!editMode && (
                      <div
                        className="add-plan-cell-button"
                        onClick={() => openAddActivityPopup(dayIndex, slot)}
                      >
                        <Plus size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>{popupContent.day} ({popupContent.date}) - {popupContent.timeSlot}</h3>
              <button className="popup-close" onClick={closePopup}><X size={18} /></button>
            </div>
            <div className="popup-body">
              {popupContent.plans.length === 0 ? (
                <div className="empty-popup-message">No activities for this time slot</div>
              ) : (
                popupContent.plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`popup-plan-item ${plan.completed ? 'completed' : ''}`}
                    onClick={() => !editMode && togglePopupCompletionStatusUI(index)}
                  >
                    <span className="popup-plan-name">{plan.name}</span>
                    <span className="popup-plan-type">{plan.type || 'Activity'}</span>
                    {/* Duration information */}
                    <span className="popup-plan-duration">
                      <Clock size={14} className="duration-icon" />
                      {plan.minDuration === plan.maxDuration ?
                        formatDuration(plan.minDuration) :
                        `${formatDuration(plan.minDuration)}-${formatDuration(plan.maxDuration)}`}
                    </span>
                    {plan.completed && !editMode && <div className="popup-check-icon"><Check size={14} /></div>}
                    {editMode && (
                      <div className="popup-plan-edit-controls">
                        <button
                          className="edit-popup-plan-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditActivityPopup(plan, popupContent.dayIndex, popupContent.timeSlot, index);
                          }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="delete-popup-plan-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteActivityUI(popupContent.dayIndex, popupContent.timeSlot, index, true);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
              {!editMode && (
                <button
                  className="add-popup-plan-button"
                  onClick={() => openAddActivityPopup(popupContent.dayIndex, popupContent.timeSlot)}
                >
                  <Plus size={16} /> Add Activity
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddPlanPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Add New Plan Category</h3>
              <button className="popup-close" onClick={() => setShowAddPlanPopup(false)}><X size={18} /></button>
            </div>
            <div className="popup-body">
              <div className="form-group">
                <label htmlFor="planName">Plan Name</label>
                <input
                  type="text"
                  id="planName"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="Enter plan category name"
                  className="form-input"
                />
              </div>
              <button className="add-plan-button" onClick={handleAddPlan}>Add Category</button>
            </div>
          </div>
        </div>
      )}

      {showEditPlanNamePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Edit Plan Name</h3>
              <button className="popup-close" onClick={() => setShowEditPlanNamePopup(false)}><X size={18} /></button>
            </div>
            <div className="popup-body">
              <div className="form-group">
                <label htmlFor="editPlanName">Plan Name</label>
                <input
                  type="text"
                  id="editPlanName"
                  value={editedPlanName}
                  onChange={(e) => setEditedPlanName(e.target.value)}
                  placeholder="Enter new plan name"
                  className="form-input"
                />
              </div>
              <button className="edit-plan-button-save" onClick={savePlanNameEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* New Activity Selection Popup */}
      {showActivitySelectionPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>{activityToEdit && activityToEdit.activityIndex >= 0 ? 'Select Activity' : 'Add New Activity'}</h3>
              <button className="popup-close" onClick={closeActivitySelectionPopup}><X size={18} /></button>
            </div>
            <div className="popup-body">
              <div className="activity-grid">
                {predefinedActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="activity-card"
                    onClick={() => handlePredefinedActivitySelect(activity.id)}
                  >
                    <div className="activity-image">
                      {activity.habitImage ? (
                        <img
                          src={activity.habitImage}
                          alt={activity.name}
                          className="habit-image"
                        />
                      ) : (
                        <div className="activity-icon">{activity.icon || '🔄'}</div>
                      )}
                    </div>
                    <div className="activity-name">{activity.name}</div>
                    <div className="activity-type">{activity.type}</div>
                  </div>
                ))}
                {/* Custom habit card */}
                <div
                  className="activity-card custom-activity-card"
                  onClick={goToCustomHabitCreation}
                >
                  <div className="activity-icon custom-activity-icon">
                    <Plus size={24} />
                  </div>
                  <div className="activity-name">Create Custom</div>
                  <div className="activity-type">Habit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Activity Popup (shown after selection) */}
      {showEditActivityPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>{activityToEdit && activityToEdit.activityIndex >= 0 ? 'Edit Activity Details' : 'Add Activity Details'}</h3>
              <button className="popup-close" onClick={closeEditActivityPopup}><X size={18} /></button>
            </div>
            <div className="popup-body">
              {selectedPredefinedActivity && (
                <div className="selected-activity-info">
                  {(() => {
                    const activity = predefinedActivities.find(a => a.id === selectedPredefinedActivity);
                    return (
                      <>
                        <div className="selected-activity-header">
                          {activity?.habitImage ? (
                            <div className="selected-activity-image">
                              <img
                                src={activity.habitImage}
                                alt={activity?.name}
                                className="habit-image"
                              />
                            </div>
                          ) : (
                            <div className="selected-activity-icon">{activity?.icon || '🔄'}</div>
                          )}
                          <div className="selected-activity-name">{activity?.name}</div>
                        </div>
                        <div className="selected-activity-type">{activity?.type}</div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Duration fields */}
              <div className="form-group">
                <label htmlFor="minDuration">Minimum Duration (minutes)</label>
                <input
                  type="number"
                  id="minDuration"
                  value={editedMinDuration}
                  onChange={(e) => setEditedMinDuration(parseInt(e.target.value) || 0)}
                  placeholder="Enter minimum duration in minutes"
                  min="1"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxDuration">Maximum Duration (minutes)</label>
                <input
                  type="number"
                  id="maxDuration"
                  value={editedMaxDuration}
                  onChange={(e) => setEditedMaxDuration(parseInt(e.target.value) || 0)}
                  placeholder="Enter maximum duration in minutes"
                  min="1"
                  className="form-input"
                />
              </div>

              {/* Day and Time Slot selectors */}
              {activityToEdit && (
                <div className="form-group">
                  <label htmlFor="activityDay">Day</label>
                  <select
                    id="activityDay"
                    className="form-input"
                    value={activityToEdit.dayIndex}
                    onChange={(e) => setActivityToEdit({
                      ...activityToEdit,
                      dayIndex: parseInt(e.target.value)
                    })}
                  >
                    {currentWeekDates.map((date, index) => (
                      <option key={index} value={index}>
                        {daysOfWeek[index]} ({formatDateDisplay(date)})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {activityToEdit && (
                <div className="form-group">
                  <label htmlFor="activityTimeSlot">Time Slot</label>
                  <select
                    id="activityTimeSlot"
                    className="form-input"
                    value={activityToEdit.timeSlot}
                    onChange={(e) => setActivityToEdit({
                      ...activityToEdit,
                      timeSlot: e.target.value
                    })}
                  >
                    {timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Repeat Checkbox with Tooltip */}
              <div className="form-group repeat-checkbox-container">
                <div className="repeat-checkbox-wrapper">
                  <div className="repeat-checkbox-label-group">
                    <input
                      type="checkbox"
                      id="repeatActivity"
                      checked={repeatActivity}
                      onChange={(e) => setRepeatActivity(e.target.checked)}
                      className="repeat-checkbox"
                    />
                    <label htmlFor="repeatActivity" className="repeat-label">Repeat weekly</label>
                  </div>
                  <div className="repeat-tooltip-container">
                    <div className="tooltip-icon">
                      <span className="question-mark">?</span>
                    </div>
                    <div className="tooltip-text">
                      When enabled, this activity will be added to every week for the rest of the year on the same day and time slot.
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="edit-activity-button-save"
                onClick={saveActivityEdit}
              >
                {activityToEdit && activityToEdit.activityIndex >= 0 ? 'Save Changes' : 'Add Activity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}