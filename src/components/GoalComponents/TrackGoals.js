import React, { useState } from "react";
import { FaDumbbell, FaHistory } from "react-icons/fa"; // Import the Dumbbell icon
import "../../styles/Goals.css";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const TrackGoals = () => {
    const [goalName, setGoalName] = useState("");
    const [targetValue, setTargetValue] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Format the data to match the expected API structure
        const goalData = {
            goalName,
            targetValue: parseFloat(targetValue), // Ensure target value is a number
            currentValue: parseFloat(currentValue), // Ensure current value is a number
            startDate: new Date(startDate).toISOString(), // Convert to ISO format
            endDate: new Date(endDate).toISOString(), // Convert to ISO format
        };

        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            const response = await fetch('https://train-xion-backend.onrender.com/api/addgoal', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(goalData), // Send the formatted goal data
            });

            const data = await response.json();

            if (response.ok) {
                // If goal is added successfully, reset the form or show a success message
                console.log('Goal added successfully:', data);
                toast.success('Goal added successfully!');
                // You can also reset the form fields if needed
                setGoalName("");
                setTargetValue("");
                setCurrentValue("");
                setStartDate("");
                setEndDate("");
            } else {
                console.error('Error adding goal:', data.message);
                toast.error(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to add goal. Please try again.');
        }
    };

    const handleClick = () => {
        navigate('/goal-history'); // Navigate to the goal history page
    };

    return (
        <div className="goal-container">
            <div className="goal-form-container">
                <h2 className="goal-form-title">
                    <FaDumbbell className="goal-form-icon goal-dumbbell-icon-left" />
                    Add New Goal
                    <FaDumbbell className="goal-form-icon goal-dumbbell-icon-right" />
                </h2>
                <form onSubmit={handleSubmit} className="goal-form">
                    <div className="goal-form-group">
                        <label htmlFor="goalName">Goal Name</label>
                        <input
                            type="text"
                            id="goalName"
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            required
                            placeholder="Enter goal name"
                        />
                    </div>
                    <div className="goal-form-group">
                        <label htmlFor="targetValue">Target Value</label>
                        <input
                            type="number"
                            id="targetValue"
                            value={targetValue}
                            onChange={(e) => setTargetValue(e.target.value)}
                            required
                            placeholder="Target value"
                        />
                    </div>
                    <div className="goal-form-group">
                        <label htmlFor="currentValue">Current Value</label>
                        <input
                            type="number"
                            id="currentValue"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            required
                            placeholder="Current progress"
                        />
                    </div>
                    <div className="goal-form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="goal-form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="goal-submit-btn">
                        Add Goal
                    </button>
                </form>
            </div>

            <div className="goal-history-container">
                <button className="goal-navigate-button" onClick={handleClick}>
                    View Goals History
                    <FaHistory size={30} className="goal-button-icon" />
                </button>
            </div>
        </div>
    );
};

export default TrackGoals;
