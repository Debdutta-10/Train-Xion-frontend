import React, { useState } from 'react';
import { FaDumbbell, FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import "../../styles/GoalCard.css";
import { toast } from "react-toastify";

const GoalCard = ({ goal, onDelete, onUpdate }) => {
  const { id, goalName, targetValue, currentValue, startDate, endDate } = goal;

  // Format the start and end dates to dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  // Calculate the progress percentage
  const progressPercentage = Math.min((currentValue / targetValue) * 100, 100);
  const strokeOffset = ((100 - progressPercentage) / 100) * 100;

  // State to handle form visibility and form inputs
  const [isEditing, setIsEditing] = useState(false);
  const [editGoalName, setEditGoalName] = useState(goalName);
  const [editTargetValue, setEditTargetValue] = useState(targetValue);
  const [editCurrentValue, setEditCurrentValue] = useState(currentValue);
  const [editStartDate, setEditStartDate] = useState(startDate);
  const [editEndDate, setEditEndDate] = useState(endDate);

  // Handle form submit for updating goal
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Ensure the data is in the correct format
    const goalData = {
      goalName: editGoalName, // The name of the goal
      targetValue: parseFloat(editTargetValue), // Ensure target value is a number
      currentValue: parseFloat(editCurrentValue), // Ensure current value is a number
      startDate: new Date(editStartDate).toISOString(), // Convert to ISO format
      endDate: new Date(editEndDate).toISOString(), // Convert to ISO format
    };

    console.log("Goal data to be sent:", goalData); // Log data for debugging

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8000/api/updgoal/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData), // Send the correctly formatted data
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error response:", data); // Log error if it fails
        toast.error("Error updating goal: " + data.message);
        return;
      }

      toast.success("Goal updated successfully");
      onUpdate(data.goal); // Update the goal in the parent component state
      setIsEditing(false); // Close the edit form
    } catch (error) {
      toast.error("Something went wrong while updating the goal.");
    }
  };

  const handleGoalDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/delgoal/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Error deleting goal: " + data.message);
        return;
      }

      toast.success("Goal deleted successfully");
      onDelete(id);  // Call the onDelete callback passed from the parent component
    } catch (error) {
      toast.error("Something went wrong while deleting the goal.");
    }
  };


  return (
    <div className="goal-card">
      <div className="goal-info">
        {/* Goal Title */}
        <h3 className="goal-name">{goalName}</h3>

        {/* Target and Current in a single line */}
        <div className="goal-progress-line">
          <p className="goal-progress">Target: {targetValue} | Current: {currentValue}</p>
        </div>

        {/* Start and End Date */}
        <p className="goal-dates">Start: {formattedStartDate}</p>
        <p className="goal-dates">End: {formattedEndDate}</p>

        {/* Edit and Delete buttons */}
        <div className="goal-actions">
          <FaEdit className="goal-action-icon" onClick={() => setIsEditing(true)} />
          <FaTrashAlt className="goal-action-icon" onClick={handleGoalDelete} />
        </div>
      </div>

      {/* Circular Progress Bar */}
      <div className="progress-container">
        <div className="progress-circle">
          <svg className="progress-ring" width="120" height="120" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            {/* Background Circle */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-current text-gray-200 dark:text-neutral-700"
              strokeWidth="2"
            />
            {/* Progress Circle */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-current text-green-500"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Percentage Text */}
          <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <span className="text-center text-2xl font-bold text-green-500 dark:text-green-400">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form (Visible when isEditing is true) */}
      {isEditing && (
        <>
          {/* Background Overlay */}
          <div className="overlay" onClick={() => setIsEditing(false)}></div>

          <div className="goal-form-edit-container">
            {/* Close Button */}
            <FaTimes
              className="goal-form-close-btn"
              onClick={() => setIsEditing(false)}
            />

            <h2 className="goal-form-title">
              <FaDumbbell className="goal-form-icon goal-dumbbell-icon-left" />
              Edit Goal
              <FaDumbbell className="goal-form-icon goal-dumbbell-icon-right" />
            </h2>
            <form onSubmit={handleEditSubmit} className="goal-form">
              <div className="goal-form-group">
                <label htmlFor="goalName">Goal Name</label>
                <input
                  type="text"
                  id="goalName"
                  value={editGoalName}
                  onChange={(e) => setEditGoalName(e.target.value)}
                  required
                  placeholder="Enter goal name"
                />
              </div>
              <div className="goal-form-group">
                <label htmlFor="targetValue">Target Value</label>
                <input
                  type="number"
                  id="targetValue"
                  value={editTargetValue}
                  onChange={(e) => setEditTargetValue(e.target.value)}
                  required
                  placeholder="Target value"
                />
              </div>
              <div className="goal-form-group">
                <label htmlFor="currentValue">Current Value</label>
                <input
                  type="number"
                  id="currentValue"
                  value={editCurrentValue}
                  onChange={(e) => setEditCurrentValue(e.target.value)}
                  required
                  placeholder="Current progress"
                />
              </div>
              <div className="goal-form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="goal-form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="goal-submit-btn">
                Edit Goal
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default GoalCard;
