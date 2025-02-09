import React, { useState } from 'react';
import { FaRunning, FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import "../../styles/WorkoutCard.css";
import { toast } from "react-toastify";

const WorkoutCard = ({ workout, onDelete, onUpdate }) => {
  const { id, exerciseName, sets, reps, weight, duration, notes, date } = workout;

  // Format the workout date to dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formattedDate = formatDate(date);

  // State to handle form visibility and form inputs for editing the workout
  const [isEditing, setIsEditing] = useState(false);
  const [editExerciseName, setEditExerciseName] = useState(exerciseName);
  const [editSets, setEditSets] = useState(sets);
  const [editReps, setEditReps] = useState(reps);
  const [editWeight, setEditWeight] = useState(weight);
  const [editDuration, setEditDuration] = useState(duration);
  const [editNotes, setEditNotes] = useState(notes);
  const [editDate, setEditDate] = useState(formattedDate);

  // Handle form submit for updating the workout
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Ensure the data is in the correct format
    const workoutData = {
      exerciseName: editExerciseName,
      sets: parseInt(editSets),
      reps: parseInt(editReps),
      weight: parseFloat(editWeight),
      duration: parseFloat(editDuration),
      notes: editNotes,
      date: new Date(editDate).toISOString(), // Convert to ISO format
    };

    console.log("Workout data to be sent:", workoutData); // Log data for debugging

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:8000/api/updworkout/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData), // Send the correctly formatted data
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error response:", data); // Log error if it fails
        toast.error("Error updating workout: " + data.message);
        return;
      }

      toast.success("Workout updated successfully");
      onUpdate(data.workout); // Update the workout in the parent component state
      setIsEditing(false); // Close the edit form
    } catch (error) {
      toast.error("Something went wrong while updating the workout.");
    }
  };

  const handleWorkoutDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/delworkout/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Error deleting workout: " + data.message);
        return;
      }

      toast.success("Workout deleted successfully");
      onDelete(id);  // Call the onDelete callback passed from the parent component
    } catch (error) {
      toast.error("Something went wrong while deleting the workout.");
    }
  };


  return (
    <div className="workout-card">
      <div className="workout-info">
        {/* Workout Title */}
        <h3 className="workout-name">{exerciseName}</h3>

        {/* Duration and Date */}
        <div className="workout-details">
          <p className="workout-duration">Duration: {duration} mins</p>
          <p className="workout-date">Date: {formattedDate}</p>
        </div>

        {/* Sets, Reps, and Weight */}
        <div className="workout-stats">
          <p>Sets: {sets} | Reps: {reps} | Weight: {weight} kg</p>
        </div>

        {/* Notes */}
        <p className="workout-notes">{notes}</p>

        {/* Edit and Delete buttons */}
        <div className="workout-actions">
          <FaEdit className="workout-action-icon" onClick={() => setIsEditing(true)} />
          <FaTrashAlt className="workout-action-icon" onClick={handleWorkoutDelete} />
        </div>
      </div>

      {/* Running Icon */}
      <div className="workout-icon">
        <FaRunning className="workout-icon" />
      </div>

      {/* Edit Form (Visible when isEditing is true) */}
      {isEditing && (
        <>
          {/* Background Overlay */}
          <div className="overlay" onClick={() => setIsEditing(false)}></div>

          <div className="workout-form-edit-container">
            {/* Close Button */}
            <FaTimes
              className="workout-form-close-btn"
              onClick={() => setIsEditing(false)}
            />

            <h2 className="workout-form-title">
              <FaRunning className="workout-form-icon workout-dumbbell-icon-left" />
              Edit Workout
              <FaRunning className="workout-form-icon workout-dumbbell-icon-right" />
            </h2>
            <form onSubmit={handleEditSubmit} className="workout-form">
              <div className="workout-form-group">
                <label htmlFor="exerciseName">Exercise Name</label>
                <input
                  type="text"
                  id="exerciseName"
                  value={editExerciseName}
                  onChange={(e) => setEditExerciseName(e.target.value)}
                  required
                  placeholder="Enter exercise name"
                />
              </div>
              <div className="workout-form-group">
                <label htmlFor="sets">Sets</label>
                <input
                  type="number"
                  id="sets"
                  value={editSets}
                  onChange={(e) => setEditSets(e.target.value)}
                  required
                  placeholder="Number of sets"
                />
              </div>
              <div className="workout-form-group">
                <label htmlFor="reps">Reps</label>
                <input
                  type="number"
                  id="reps"
                  value={editReps}
                  onChange={(e) => setEditReps(e.target.value)}
                  required
                  placeholder="Number of reps"
                />
              </div>
              <div className="workout-form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                  required
                  placeholder="Weight used"
                />
              </div>
              <div className="workout-form-group">
                <label htmlFor="duration">Duration (mins)</label>
                <input
                  type="number"
                  id="duration"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  required
                  placeholder="Duration in minutes"
                />
              </div>
              <div className="workout-form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  required
                  placeholder="Enter workout notes"
                />
              </div>
              <div className="workout-form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="workout-submit-btn">
                Edit Workout
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutCard;
