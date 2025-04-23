import React, { useState } from 'react';
import { Plus, Check, X, Edit, Trash2, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Plans.css';

export default function Plans() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ day: "", timeSlot: "", plans: [] });
  const [showAddPlanPopup, setShowAddPlanPopup] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [editMode, setEditMode] = useState(false);

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
  const predefinedActivities = [
    { id: 'running', name: 'Running', type: 'Sports', minDuration: 20, maxDuration: 45, icon: '🏃' },
    { id: 'yoga', name: 'Yoga', type: 'Sports', minDuration: 15, maxDuration: 60, icon: '🧘' },
    { id: 'gym', name: 'Gym Workout', type: 'Sports', minDuration: 45, maxDuration: 90, icon: '💪' },
    { id: 'meditation', name: 'Meditation', type: 'Sports', minDuration: 10, maxDuration: 30, icon: '🧠' },
    { id: 'reading', name: 'Reading', type: 'Learning', minDuration: 30, maxDuration: 60, icon: '📚' },
    { id: 'languages', name: 'Language Learning', type: 'Learning', minDuration: 25, maxDuration: 60, icon: '🗣️' },
    { id: 'coding', name: 'Coding Practice', type: 'Learning', minDuration: 45, maxDuration: 120, icon: '💻' },
    { id: 'stretching', name: 'Stretching', type: 'Sports', minDuration: 10, maxDuration: 20, icon: '🤸' },
    { id: 'walking', name: 'Walking', type: 'Fitness', minDuration: 20, maxDuration: 60, icon: '🚶' },
    { id: 'journaling', name: 'Journaling', type: 'Sports', minDuration: 15, maxDuration: 30, icon: '📔' }
  ];

  // Sample data 
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  // Define plan templates with durations added to activities
  const [planTemplates, setPlanTemplates] = useState([
    {
      name: 'Sports',
      icon: '🏃',
      plans: [
        // Monday
        {
          Morning: [{ name: 'Running', completed: true, type: 'Sports', minDuration: 20, maxDuration: 45 }],
          Afternoon: [{ name: 'Gym', completed: false, type: 'Fitness', minDuration: 30, maxDuration: 90 }],
          Evening: []
        },
        // Tuesday
        {
          Morning: [{ name: 'Yoga', completed: true, type: 'Sports', minDuration: 15, maxDuration: 60 }],
          Afternoon: [],
          Evening: []
        },
        // Wednesday
        {
          Morning: [{ name: 'Yoga', completed: true, type: 'Sports', minDuration: 15, maxDuration: 60 }],
          Afternoon: [],
          Evening: []
        },
        // Thursday - Sunday kept empty for simplicity
        { Morning: [], Afternoon: [], Evening: [] },
        { Morning: [], Afternoon: [], Evening: [] },
        { Morning: [], Afternoon: [], Evening: [] },
        { Morning: [], Afternoon: [], Evening: [] }
      ]
    },
    {
      name: 'Learning',
      icon: '📚',
      plans: [
        // Monday
        {
          Morning: [],
          Afternoon: [],
          Evening: [{ name: 'Learn Spanish', completed: false, type: 'Learning', minDuration: 25, maxDuration: 60 }]
        },
        // Tuesday
        {
          Morning: [],
          Afternoon: [{ name: 'C++', completed: false, type: 'Learning', minDuration: 45, maxDuration: 120 }],
          Evening: []
        },
        // Wednesday
        {
          Morning: [],
          Afternoon: [
            { name: 'Python', completed: false, type: 'Learning', minDuration: 30, maxDuration: 90 },
            { name: 'Database', completed: true, type: 'Learning', minDuration: 20, maxDuration: 45 }
          ],
          Evening: []
        },
        // Thursday
        {
          Morning: [{ name: 'Java', completed: false, type: 'Learning', minDuration: 40, maxDuration: 90 }],
          Afternoon: [],
          Evening: []
        },
        // Friday - Sunday kept empty for simplicity
        { Morning: [], Afternoon: [], Evening: [] },
        { Morning: [], Afternoon: [], Evening: [] },
        { Morning: [], Afternoon: [], Evening: [] }
      ]
    },
  ]);

  // State to track the active plan template (default to first one)
  const [activePlanTemplate, setActivePlanTemplate] = useState(planTemplates[0].name);

  // State to track the current plans based on selected template
  const [currentPlans, setCurrentPlans] = useState(planTemplates[0].plans);

  const handleOverflowClick = (dayIndex, timeSlot) => {
    // Allow viewing plans in both modes, but with different behaviors
    const dayPlans = currentPlans[dayIndex][timeSlot];

    setPopupContent({
      day: daysOfWeek[dayIndex],
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

    // Update the current plans based on the selected template
    const selectedTemplate = planTemplates.find(template => template.name === templateName);
    if (selectedTemplate) {
      setCurrentPlans(selectedTemplate.plans);
    }
  };

  // Function to toggle completion status of an activity
  const toggleCompletionStatus = (dayIndex, timeSlot, planIndex) => {
    // Don't allow toggling completion in edit mode
    if (editMode) return;

    // Create a deep copy of current plans
    const updatedPlans = JSON.parse(JSON.stringify(currentPlans));

    // Toggle the completed status
    updatedPlans[dayIndex][timeSlot][planIndex].completed =
      !updatedPlans[dayIndex][timeSlot][planIndex].completed;

    setCurrentPlans(updatedPlans);

    // Also update the original template
    const templateIndex = planTemplates.findIndex(template => template.name === activePlanTemplate);
    if (templateIndex !== -1) {
      const updatedTemplates = [...planTemplates];
      updatedTemplates[templateIndex].plans = updatedPlans;
      setPlanTemplates(updatedTemplates);
    }
  };

  // Function to toggle completion status from popup
  const togglePopupCompletionStatus = (planIndex) => {
    // Don't allow toggling completion in edit mode
    if (editMode) return;

    const { dayIndex, timeSlot } = popupContent;

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

    // Also update the original template
    const templateIndex = planTemplates.findIndex(template => template.name === activePlanTemplate);
    if (templateIndex !== -1) {
      const updatedTemplates = [...planTemplates];
      updatedTemplates[templateIndex].plans = updatedPlans;
      setPlanTemplates(updatedTemplates);
    }
  };

  // Function to handle adding a new plan category
  const handleAddPlan = () => {
    if (!newPlanName.trim()) return;

    // Create empty week structure for the new plan
    const emptyWeekPlans = daysOfWeek.map(() => ({
      Morning: [],
      Afternoon: [],
      Evening: []
    }));

    // Create new plan template
    const newPlanTemplate = {
      name: newPlanName,
      icon: '📝', // Default icon
      plans: emptyWeekPlans
    };

    // Add new plan template to the list
    const updatedTemplates = [...planTemplates, newPlanTemplate];
    setPlanTemplates(updatedTemplates);
    setActivePlanTemplate(newPlanName);
    setCurrentPlans(emptyWeekPlans);

    setNewPlanName('');
    setShowAddPlanPopup(false);
  };

  const handleDeleteTemplate = (name) => {
    const filtered = planTemplates.filter(t => t.name !== name);
    setPlanTemplates(filtered);
    if (activePlanTemplate === name && filtered.length > 0) {
      setActivePlanTemplate(filtered[0].name);
      setCurrentPlans(filtered[0].plans);
    } else if (filtered.length === 0) {
      setActivePlanTemplate('');
      setCurrentPlans([]);
    }
  };

  // Function to handle opening edit plan name popup
  const handleEditPlanNameClick = (name) => {
    setEditedPlanName(name);
    setShowEditPlanNamePopup(true);
  };

  // Function to save edited plan name
  const savePlanNameEdit = () => {
    if (!editedPlanName.trim()) return;

    const updatedTemplates = planTemplates.map(template => {
      if (template.name === activePlanTemplate) {
        return { ...template, name: editedPlanName };
      }
      return template;
    });

    setPlanTemplates(updatedTemplates);
    setActivePlanTemplate(editedPlanName);
    setShowEditPlanNamePopup(false);
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
    navigate('/habits/add');
  };

  // Function to save edited activity
  const saveActivityEdit = () => {
    if (!selectedPredefinedActivity || !activityToEdit) return;

    const { dayIndex, timeSlot, activityIndex } = activityToEdit;
    const selectedActivity = predefinedActivities.find(act => act.id === selectedPredefinedActivity);
    
    if (!selectedActivity) return;

    // Create a deep copy of current plans
    const updatedPlans = JSON.parse(JSON.stringify(currentPlans));

    // If editing existing activity
    if (activityIndex >= 0) {
      // Update the activity with the selected predefined activity
      updatedPlans[dayIndex][timeSlot][activityIndex].name = selectedActivity.name;
      updatedPlans[dayIndex][timeSlot][activityIndex].type = selectedActivity.type;
      updatedPlans[dayIndex][timeSlot][activityIndex].minDuration = editedMinDuration;
      updatedPlans[dayIndex][timeSlot][activityIndex].maxDuration = editedMaxDuration;
    } else {
      // Add new activity with selected predefined activity
      const newActivity = {
        name: selectedActivity.name,
        completed: false,
        type: selectedActivity.type,
        minDuration: editedMinDuration,
        maxDuration: editedMaxDuration
      };
      
      updatedPlans[dayIndex][timeSlot].push(newActivity);
    }

    setCurrentPlans(updatedPlans);

    // Update the original template
    const templateIndex = planTemplates.findIndex(template => template.name === activePlanTemplate);
    if (templateIndex !== -1) {
      const updatedTemplates = [...planTemplates];
      updatedTemplates[templateIndex].plans = updatedPlans;
      setPlanTemplates(updatedTemplates);
    }

    if (showPopup) {
      if (activityIndex >= 0) {
        const updatedPopupPlans = [...popupContent.plans];
        updatedPopupPlans[activityIndex].name = selectedActivity.name;
        updatedPopupPlans[activityIndex].type = selectedActivity.type;
        updatedPopupPlans[activityIndex].minDuration = editedMinDuration;
        updatedPopupPlans[activityIndex].maxDuration = editedMaxDuration;

        setPopupContent({
          ...popupContent,
          plans: updatedPopupPlans
        });
      } else {
        const newActivity = {
          name: selectedActivity.name,
          completed: false,
          type: selectedActivity.type,
          minDuration: editedMinDuration,
          maxDuration: editedMaxDuration
        };
        
        setPopupContent({
          ...popupContent,
          plans: [...popupContent.plans, newActivity]
        });
      }
    }

    // Reset states
    setSelectedPredefinedActivity('');
    setShowEditActivityPopup(false);
  };

  // Function to delete an activity
  const deleteActivity = (dayIndex, timeSlot, activityIndex, fromPopup = false) => {
    // Create a deep copy of current plans
    const updatedPlans = JSON.parse(JSON.stringify(currentPlans));

    // Remove the activity
    updatedPlans[dayIndex][timeSlot].splice(activityIndex, 1);

    setCurrentPlans(updatedPlans);

    // Update the original template
    const templateIndex = planTemplates.findIndex(template => template.name === activePlanTemplate);
    if (templateIndex !== -1) {
      const updatedTemplates = [...planTemplates];
      updatedTemplates[templateIndex].plans = updatedPlans;
      setPlanTemplates(updatedTemplates);
    }

    // If deleting from popup view, update the popup content too
    if (fromPopup) {
      const updatedPopupPlans = [...popupContent.plans];
      updatedPopupPlans.splice(activityIndex, 1);

      setPopupContent({
        ...popupContent,
        plans: updatedPopupPlans
      });
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
            <div className="category-icon">{template.icon}</div>
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

      <div className="weekdays-header">
        {daysOfWeek.map((day, index) => <div key={index} className="weekday">{day}</div>)}
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
                const dayPlans = currentPlans[dayIndex][slot] || [];
                const hasOverflow = dayPlans.length > 2;
                const displayPlans = hasOverflow ? dayPlans.slice(0, 2) : dayPlans;

                return (
                  <div key={dayIndex} className="day-cell">
                    {displayPlans.map((plan, planIndex) => (
                      <div
                        key={planIndex}
                        className={`plan-item ${plan.completed ? 'completed' : ''}`}
                        onClick={() => !editMode && toggleCompletionStatus(dayIndex, slot, planIndex)}
                      >
                        <div className="plan-name">{plan.name}</div>
                        {/* Duration badge */}
                        <div className="duration-badge">
                          <Clock size={10} />
                          {formatDuration(plan.minDuration)}-{formatDuration(plan.maxDuration)}
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
                                deleteActivity(dayIndex, slot, planIndex);
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
              <h3>{popupContent.day} - {popupContent.timeSlot}</h3>
              <button className="popup-close" onClick={closePopup}><X size={18} /></button>
            </div>
            <div className="popup-body">
              {popupContent.plans.map((plan, index) => (
                <div
                  key={index}
                  className={`popup-plan-item ${plan.completed ? 'completed' : ''}`}
                  onClick={() => !editMode && togglePopupCompletionStatus(index)}
                >
                  <span className="popup-plan-name">{plan.name}</span>
                  <span className="popup-plan-type">{plan.type}</span>
                  {/* Duration information */}
                  <span className="popup-plan-duration">
                    <Clock size={14} className="duration-icon" />
                    {formatDuration(plan.minDuration)}-{formatDuration(plan.maxDuration)}
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
                          deleteActivity(popupContent.dayIndex, popupContent.timeSlot, index, true);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
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
              <button className="popup-close" onClick={() => setShowActivitySelectionPopup(false)}><X size={18} /></button>
            </div>
            <div className="popup-body">
              <div className="activity-grid">
                {predefinedActivities.map(activity => (
                  <div 
                    key={activity.id} 
                    className="activity-card"
                    onClick={() => handlePredefinedActivitySelect(activity.id)}
                  >
                    <div className="activity-icon">{activity.icon}</div>
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
              <button className="popup-close" onClick={() => setShowEditActivityPopup(false)}><X size={18} /></button>
            </div>
            <div className="popup-body">
              {selectedPredefinedActivity && (
                <div className="selected-activity-info">
                  {(() => {
                    const activity = predefinedActivities.find(a => a.id === selectedPredefinedActivity);
                    return (
                      <>
                        <div className="selected-activity-header">
                          <div className="selected-activity-icon">{activity?.icon}</div>
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
                    {daysOfWeek.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
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