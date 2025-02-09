import React, { useState } from "react";
import { FaDumbbell, FaHistory } from "react-icons/fa"; // Import the Dumbbell icon
import "../../styles/Goals.css";
import { useNavigate } from 'react-router-dom';

const TrackGoals = () => {
    const [goalName, setGoalName] = useState("");
    const [targetValue, setTargetValue] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle goal submission logic here
        console.log("Goal added:", { goalName, targetValue, currentValue, startDate, endDate });
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
