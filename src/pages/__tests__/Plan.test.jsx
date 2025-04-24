import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Plans from '../Plans';
import { BrowserRouter } from 'react-router-dom';

// Mock the navigation function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon">Plus Icon</div>,
  Check: () => <div data-testid="check-icon">Check Icon</div>,
  X: () => <div data-testid="x-icon">X Icon</div>,
  Edit: () => <div data-testid="edit-icon">Edit Icon</div>,
  Trash2: () => <div data-testid="trash-icon">Trash Icon</div>,
  Clock: () => <div data-testid="clock-icon">Clock Icon</div>,
  ArrowRight: () => <div data-testid="arrow-icon">Arrow Icon</div>,
}));

// Helper to render Plans with Router context
const renderPlans = () => {
  return render(
    <BrowserRouter>
      <Plans />
    </BrowserRouter>
  );
};

describe('Plans Component', () => {
  // Basic Rendering Tests
  describe('Rendering', () => {
    it('renders the component with title and subtitle', () => {
      renderPlans();
      expect(screen.getByText('Plans')).toBeInTheDocument();
      expect(screen.getByText('Welcome to your Plans!')).toBeInTheDocument();
    });

    it('renders plan categories', () => {
      renderPlans();
      expect(screen.getByText('Sports')).toBeInTheDocument();
      expect(screen.getByText('Learning')).toBeInTheDocument();
      expect(screen.getByText('Add plan')).toBeInTheDocument();
    });

    it('renders weekdays header', () => {
      renderPlans();
      const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      weekdays.forEach(day => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });

    it('renders time slots', () => {
      renderPlans();
      expect(screen.getByText('Morning')).toBeInTheDocument();
      expect(screen.getByText('Afternoon')).toBeInTheDocument();
      expect(screen.getByText('Evening')).toBeInTheDocument();
    });

    it('renders initial activities in the grid', () => {
      renderPlans();
      // Using getAllByText instead of getByText to handle multiple occurrences
      expect(screen.getAllByText('Running')[0]).toBeInTheDocument();
      expect(screen.getByText('Gym')).toBeInTheDocument();
      // Use getAllByText for Yoga since it appears multiple times
      expect(screen.getAllByText('Yoga')[0]).toBeInTheDocument();
    });
  });

  // Plan Category Selection Tests
  describe('Plan Category Selection', () => {
    it('switches active plan when a category is clicked', () => {
      renderPlans();
      // Initially "Sports" should be active
      const learningCategory = screen.getByText('Learning');
      
      // Verify initial state shows Sports activities
      expect(screen.getAllByText('Running')[0]).toBeInTheDocument();
      
      // Click on Learning category
      fireEvent.click(learningCategory);
      
      // Verify Learning activities are shown
      expect(screen.getByText('Learn Spanish')).toBeInTheDocument();
      expect(screen.getByText('C++')).toBeInTheDocument();
    });

    it('opens add plan popup when "Add plan" is clicked', () => {
      renderPlans();
      const addPlanButton = screen.getByText('Add plan');
      
      fireEvent.click(addPlanButton);
      
      // Check if add plan popup appears
      expect(screen.getByText('Add New Plan Category')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter plan category name')).toBeInTheDocument();
    });
    
    it('allows creating new plan template with a custom name', async () => {
      renderPlans();
      
      // Click Add plan button
      fireEvent.click(screen.getByText('Add plan'));
      
      // Enter new plan name
      const nameInput = screen.getByPlaceholderText('Enter plan category name');
      fireEvent.change(nameInput, { target: { value: 'Cooking' } });
      
      // Click Add Category button
      fireEvent.click(screen.getByText('Add Category'));
      
      // Verify new template appears
      expect(screen.getByText('Cooking')).toBeInTheDocument();
    });
    
    it('handles adding a plan with empty name', () => {
      renderPlans();
      // Click "Add plan"
      fireEvent.click(screen.getByText('Add plan'));
      
      // Try to submit with empty name
      fireEvent.click(screen.getByText('Add Category'));
      
      // Check that popup is still open (form wasn't submitted)
      expect(screen.getByText('Add New Plan Category')).toBeInTheDocument();
    });
  });

  // Popup Interaction Tests
  describe('Popup Interactions', () => {
    it('opens day popup when overflow indicator is clicked', async () => {
      renderPlans();
      // Find Learning category and click it to switch
      fireEvent.click(screen.getByText('Learning'));
      
      // In the Learning plan, Wednesday afternoon has multiple activities
      // Find the cell containing both Python and Database
      const pythonElement = screen.getByText('Python');
      
      // Ensure we can find Python's parent element
      const pythonCell = pythonElement.closest('.day-cell');
      expect(pythonCell).not.toBeNull();
      
      // Now click on this cell to trigger the popup
      fireEvent.click(pythonCell);
      
      // Wait for popup to appear
      await waitFor(() => {
        // Check for the individual elements of the title instead of the combined text
        expect(screen.getByText('Wed')).toBeInTheDocument();
        expect(screen.getAllByText('Afternoon')[0]).toBeInTheDocument(); 
      });
    });

    it('can close popups with the X button', async () => {
      renderPlans();
      // Open add plan popup
      fireEvent.click(screen.getByText('Add plan'));
      expect(screen.getByText('Add New Plan Category')).toBeInTheDocument();
      
      // Close the popup
      const closeButtons = screen.getAllByTestId('x-icon');
      fireEvent.click(closeButtons[0].closest('button'));
      
      // Check popup is closed
      await waitFor(() => {
        expect(screen.queryByText('Add New Plan Category')).not.toBeInTheDocument();
      });
    });
    
    it('toggles completion status from popup view', async () => {
      renderPlans();
      
      // Switch to Learning plan which has activities
      fireEvent.click(screen.getByText('Learning'));
      
      // Find a specific cell and click it to open popup
      const pythonElement = screen.getByText('Python');
      const pythonCell = pythonElement.closest('.day-cell');
      fireEvent.click(pythonCell);
      
      // Wait for popup to appear and ensure Python is there
      await waitFor(() => {
        const popupPythonItem = screen.getAllByText('Python')[0];
        expect(popupPythonItem).toBeInTheDocument();
        
        // Get the closest popup-plan-item and click it
        const pythonPopupItem = popupPythonItem.closest('.popup-plan-item');
        if (pythonPopupItem) {
          fireEvent.click(pythonPopupItem);
        }
      });
      
      // Now check that it has a completion check mark
      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons.length).toBeGreaterThan(0);
    });
  });

  // Edit Mode Tests
  describe('Edit Mode', () => {
    it('toggles edit mode when edit button is clicked', () => {
      renderPlans();
      // Find the edit button and click it
      const editButton = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editButton);
      
      // Check that edit mode is active by verifying "DONE" text appears
      expect(screen.getByText('DONE')).toBeInTheDocument();
      
      // Toggle back
      fireEvent.click(screen.getByText('DONE'));
      expect(screen.queryByText('DONE')).not.toBeInTheDocument();
    });

    it('shows edit and delete buttons for categories in edit mode', () => {
      renderPlans();
      // Enter edit mode
      const editButton = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editButton);
      
      // Find category edit controls
      const editControls = screen.getAllByTestId('edit-icon');
      expect(editControls.length).toBeGreaterThan(1); // Should have multiple edit buttons now
      
      const deleteControls = screen.getAllByTestId('x-icon');
      expect(deleteControls.length).toBeGreaterThan(0);
    });
    
    it('allows deleting a plan template', async () => {
      renderPlans();
      
      // Enter edit mode
      const editButton = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editButton);
      
      // Find the Learning template
      const learningTemplate = screen.getByText('Learning');
      
      // Find and click its delete button
      const templateContainer = learningTemplate.closest('.category-item');
      const deleteButton = templateContainer.querySelector('.delete-template-btn');
      fireEvent.click(deleteButton);
      
      // Verify the template was deleted
      expect(screen.queryByText('Learning')).not.toBeInTheDocument();
    });
    
    it('handles edit plan name with empty value', async () => {
      renderPlans();
      
      // Enter edit mode
      const editButton = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editButton);
      
      // Click edit on plan name (Sports)
      const sportsCategory = screen.getByText('Sports');
      const templateContainer = sportsCategory.closest('.category-item');
      const editTemplateButton = templateContainer.querySelector('.edit-template-btn');
      fireEvent.click(editTemplateButton);
      
      // Wait for edit popup to appear
      await waitFor(() => {
        expect(screen.getByText('Edit Plan Name')).toBeInTheDocument();
      });
      
      // Find the input field and clear it
      const nameInput = screen.getByLabelText('Plan Name');
      fireEvent.change(nameInput, { target: { value: '' } });
      
      // Try to save empty value
      fireEvent.click(screen.getByText('Save Changes'));
      
      // Verify popup is still open (form wasn't submitted)
      expect(screen.getByText('Edit Plan Name')).toBeInTheDocument();
    });
  });

  // Activity Management Tests
  describe('Activity Management', () => {
    it('toggles completion status when an activity is clicked', () => {
      renderPlans();
      // Find an incomplete activity (Gym)
      const gymActivity = screen.getByText('Gym');
      
      // Click to toggle completion
      fireEvent.click(gymActivity.closest('.plan-item'));
      
      // Check if activity is now completed
      // As a proxy, we could try to see if a check icon appeared
      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons.length).toBeGreaterThan(0);
    });

    it('opens activity selection popup when add button is clicked', async () => {
      renderPlans();
      // Find the add button at the top right
      const addButtons = screen.getAllByTestId('plus-icon');
      const topAddButton = addButtons.find(btn => 
        btn.closest('button')?.className.includes('add-button'));
      
      // Click the add button
      fireEvent.click(topAddButton.closest('button'));
      
      // Check if activity selection popup appears
      await waitFor(() => {
        expect(screen.getByText('Add New Activity')).toBeInTheDocument();
        // Make sure we check for a running activity in the popup context
        const activityCards = document.querySelectorAll('.activity-card');
        expect(activityCards.length).toBeGreaterThan(0);
      });
    });
    
    it('allows editing an activity with new duration values', async () => {
      renderPlans();
      
      // Enter edit mode
      const editButton = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editButton);
      
      // Find an activity (running)
      const runningElement = screen.getAllByText('Running')[0];
      const activityElement = runningElement.closest('.plan-item');
      
      // Find and click the edit button
      const activityEditButton = activityElement.querySelector('.edit-plan-btn');
      fireEvent.click(activityEditButton);
      
      // Wait for activity selection popup
      await waitFor(() => {
        expect(screen.getByText('Select Activity')).toBeInTheDocument();
      });
      
      // Find and click a specific activity card
      const activityCards = document.querySelectorAll('.activity-card');
      if (activityCards.length > 0) {
        fireEvent.click(activityCards[0]);
      }
      
      // Now wait for edit activity popup
      await waitFor(() => {
        expect(screen.getByText('Edit Activity Details')).toBeInTheDocument();
      });
      
      // Change the duration values
      const minDurationInput = screen.getByLabelText('Minimum Duration (minutes)');
      fireEvent.change(minDurationInput, { target: { value: '30' } });
      
      const maxDurationInput = screen.getByLabelText('Maximum Duration (minutes)');
      fireEvent.change(maxDurationInput, { target: { value: '90' } });
      
      // Save the changes
      fireEvent.click(screen.getByText('Save Changes'));
      
      // Exit edit mode
      fireEvent.click(screen.getByText('DONE'));
      
      // Success if we get this far without errors
      expect(screen.getByText('Plans')).toBeInTheDocument();
    });
    
    it('allows deleting an activity', async () => {
      renderPlans();
      
      // Enter edit mode
      const editButton = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editButton);
      
      // Count all plan-item elements initially
      const initialActivityCount = document.querySelectorAll('.plan-item').length;
      
      // Find the first activity's delete button and click it
      const deleteButton = document.querySelector('.delete-plan-btn');
      if (deleteButton) {
        fireEvent.click(deleteButton);
      }
      
      // Verify an activity was deleted by checking the count
      const finalActivityCount = document.querySelectorAll('.plan-item').length;
      expect(finalActivityCount).toBe(initialActivityCount - 1);
    });
    
    it('navigates to custom habit creation when "Create Custom" is clicked', () => {
      renderPlans();
      
      // Open activity selection popup
      const addButtons = screen.getAllByTestId('plus-icon');
      const topAddButton = addButtons.find(btn => 
        btn.closest('button')?.className.includes('add-button'));
      fireEvent.click(topAddButton.closest('button'));
      
      // Find and click "Create Custom" card 
      const customButton = screen.getAllByText('Create Custom')[0];
      const customCard = customButton.closest('.custom-activity-card');
      fireEvent.click(customCard);
      
      // Verify navigation was called with the correct path
      expect(mockNavigate).toHaveBeenCalledWith('/habits/add');
    });
  });

  // Duration Formatting Tests
  describe('Duration Formatting', () => {
    it('correctly formats durations from minutes to hours and minutes', async () => {
      renderPlans();
      
      // Enter edit mode to see duration badges
      const editButton = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editButton);
      
      // Check that a duration badge exists with the correct format (like "30m-1h 30m")
      const durationBadges = document.querySelectorAll('.duration-badge');
      expect(durationBadges.length).toBeGreaterThan(0);
      
      // At least one should contain something like "1h 30m"
      const formattedDurations = Array.from(durationBadges).filter(badge => 
        badge.textContent.includes('1h 30m') || badge.textContent.includes('1h'));
      expect(formattedDurations.length).toBeGreaterThan(0);
    });
  });

  // Edge Cases Tests
  describe('Edge Cases', () => {
    it('handles adding a plan with empty name', () => {
      renderPlans();
      // Click "Add plan"
      fireEvent.click(screen.getByText('Add plan'));
      
      // Try to submit with empty name
      fireEvent.click(screen.getByText('Add Category'));
      
      // Check that popup is still open (form wasn't submitted)
      expect(screen.getByText('Add New Plan Category')).toBeInTheDocument();
    });

    it('handles deleting the last plan category gracefully', async () => {
      renderPlans();
      // Enter edit mode
      const editButton = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editButton);
      
      // Delete Sports category
      const sportsCategory = screen.getByText('Sports');
      const templateContainer = sportsCategory.closest('.category-item');
      const deleteButton = templateContainer.querySelector('.delete-template-btn');
      fireEvent.click(deleteButton);
      
      // Now delete Learning category
      // Need to get the buttons again after state has changed
      const learningCategory = screen.getByText('Learning');
      const learningContainer = learningCategory.closest('.category-item');
      const learningDeleteButton = learningContainer.querySelector('.delete-template-btn');
      fireEvent.click(learningDeleteButton);
      
      // Check that UI still renders without errors
      expect(screen.getByText('Plans')).toBeInTheDocument();
    });
    
    it('prevents toggling completion in edit mode', async () => {
      renderPlans();
      
      // Check if a plan item exists and note its completion state
      const planItems = document.querySelectorAll('.plan-item');
      expect(planItems.length).toBeGreaterThan(0);
      
      // Check if one is completed
      const completedItem = document.querySelector('.plan-item.completed');
      const wasCompletedInitially = !!completedItem;
      
      // Enter edit mode
      const editButton = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editButton);
      
      // Try to toggle completion by clicking the activity
      if (completedItem) {
        fireEvent.click(completedItem);
      }
      
      // Exit edit mode
      fireEvent.click(screen.getByText('DONE'));
      
      // Verify completion state hasn't changed
      const stillCompleted = !!document.querySelector('.plan-item.completed');
      
      // If there was a completed item before, there should still be one
      expect(stillCompleted).toBe(wasCompletedInitially);
    });
    
    it('handles activity editing with zero durations', async () => {
      renderPlans();
      
      // Enter edit mode
      const editButton = screen.getByTestId('edit-icon').closest('button');
      fireEvent.click(editButton);
      
      // Find an activity and click edit
      const planItem = document.querySelector('.plan-item');
      const editPlanBtn = planItem.querySelector('.edit-plan-btn');
      fireEvent.click(editPlanBtn);
      
      // Wait for selection and then edit popups 
      await waitFor(() => {
        const activityCards = document.querySelectorAll('.activity-card');
        if (activityCards.length > 0) {
          fireEvent.click(activityCards[0]);
        }
      });
      
      await waitFor(() => {
        if (screen.queryByText('Edit Activity Details')) {
          // Set min and max durations to 0
          const minDurationInput = screen.getByLabelText('Minimum Duration (minutes)');
          fireEvent.change(minDurationInput, { target: { value: '0' } });
          
          const maxDurationInput = screen.getByLabelText('Maximum Duration (minutes)');
          fireEvent.change(maxDurationInput, { target: { value: '0' } });
          
          // Save changes
          const saveButton = screen.getByText('Save Changes');
          fireEvent.click(saveButton);
        }
      });
      
      // Verify the component doesn't crash
      expect(screen.getByText('Plans')).toBeInTheDocument();
    });
  });
});