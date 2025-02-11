import React, { useState } from "react";
import { toast } from "react-toastify"; // Assuming toast is used for notifications
import { FaDumbbell, FaHistory } from "react-icons/fa"; // Import icons if needed
import "../../styles/TrackWorkouts.css"
import { useNavigate } from 'react-router-dom';

const TrackWorkouts = () => {
    const [duration, setDuration] = useState("");
    const [exerciseName, setExerciseName] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [notes, setNotes] = useState("");
    const [categoryId, setCategoryId] = useState("1"); // Default categoryId is set to 1 (Cardio)
    
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure all fields are filled
        if (!duration || !exerciseName || !sets || !reps || !weight || !notes || !categoryId) {
            toast.error("Please fill in all fields.");
            return;
        }

        // Prepare data to send to backend
        const workoutData = {
            duration: parseFloat(duration), // Ensure it's a number
            exerciseName,
            sets: parseInt(sets), // Ensure it's a number
            reps: parseInt(reps), // Ensure it's a number
            weight: parseFloat(weight), // Ensure it's a number
            notes,
            categoryId: parseInt(categoryId), // Ensure it's a number
        };

        console.log("Workout Data to be sent:", workoutData); // Log data to ensure it's correct

        try {
            const token = localStorage.getItem('token'); // Assuming you have a token stored in localStorage

            const response = await fetch('https://train-xion-backend.onrender.com/api/addworkout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Workout added successfully!");
                // Reset form after successful submission
                setDuration("");
                setExerciseName("");
                setSets("");
                setReps("");
                setWeight("");
                setNotes("");
                setCategoryId("1");
            } else {
                // Display error message from backend
                toast.error(data.message || "Failed to add workout");
            }
        } catch (error) {
            console.error("Error submitting workout:", error);
            toast.error("Failed to add workout. Please try again.");
        }
    };

    const handleClick = () => {
        navigate('/workout-history'); // Navigate to the goal history page
    };

    return (
        <div className="workout-container">
            <div className="workout-form-container">
                <h2 className="workout-form-title">
                    <FaDumbbell className="workout-form-icon workout-dumbbell-icon-left" />
                    Add New Workout
                    <FaDumbbell className="workout-form-icon workout-dumbbell-icon-right" />
                </h2>
                <form onSubmit={handleSubmit} className="workout-form">
                    <div className="workout-form-group">
                        <label htmlFor="duration">Duration (minutes)</label>
                        <input
                            type="number"
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                            placeholder="Duration in minutes"
                        />
                    </div>
                    <div className="workout-form-group">
                        <label htmlFor="exerciseName">Exercise Name</label>
                        <input
                            type="text"
                            id="exerciseName"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            required
                            placeholder="Enter exercise name"
                        />
                    </div>
                    <div className="workout-form-group">
                        <label htmlFor="sets">Sets</label>
                        <input
                            type="number"
                            id="sets"
                            value={sets}
                            onChange={(e) => setSets(e.target.value)}
                            required
                            placeholder="Number of sets"
                        />
                    </div>
                    <div className="workout-form-group">
                        <label htmlFor="reps">Reps per Set</label>
                        <input
                            type="number"
                            id="reps"
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            required
                            placeholder="Number of reps"
                        />
                    </div>
                    <div className="workout-form-group">
                        <label htmlFor="weight">Weight (if any)</label>
                        <input
                            type="number"
                            id="weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Weight (in kg)"
                        />
                    </div>
                    <div className="workout-form-group">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            required
                            placeholder="Any notes or comments"
                        />
                    </div>
                    <div className="workout-form-group">
                        <label htmlFor="categoryId">Category</label>
                        <select
                            id="categoryId"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="1">Cardio</option>
                            <option value="2">Strength Training</option>
                            <option value="3">Yoga</option>
                            <option value="4">HIIT</option>
                            <option value="5">Pilates</option>
                            <option value="6">Others</option>
                        </select>
                    </div>
                    <button type="submit" className="workout-submit-btn">
                        Add Workout
                    </button>
                </form>
            </div>

            <div className="workout-history-container">
                <button className="workout-navigate-button" onClick={handleClick}>
                    View Workout History
                    <FaHistory size={30} className="workout-button-icon" />
                </button>
            </div>
        </div>
    );
};

export default TrackWorkouts;
