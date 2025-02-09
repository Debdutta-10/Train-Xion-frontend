import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaEdit, FaHistory } from 'react-icons/fa';
import "../../styles/Water.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const TrackWater = () => {
  const navigate = useNavigate();
  const [waterLevel, setWaterLevel] = useState(0);  // Water level state
  const [error, setError] = useState(null); // To store error messages

  // Fetch today's water log
  const fetchTodayWaterLog = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await fetch('http://localhost:8000/api/getwaterlogforday?date=' + new Date().toISOString().split('T')[0], {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to fetch water log for today');
        console.error('Error fetching water log:', data);
        toast.error(`Error: ${data.message || 'Failed to fetch water log for today'}`);
      } else {
        setError(null);
        // Set the fetched water log to the waterLevel state
        const totalWaterIntake = data.waterLogs.reduce((total, log) => total + log.waterIntake, 0);
        setWaterLevel(totalWaterIntake); // Assuming totalWaterIntake is in milliliters
      }
    } catch (err) {
      setError('Failed to fetch water log');
      console.error('Error:', err);
      toast.error('An error occurred while fetching the water log!');
    }
  };

  // Fetch today's water log when the component mounts
  useEffect(() => {
    fetchTodayWaterLog();
  }, []); // Empty dependency array to fetch only on component mount

  // Update water level based on input
  const handleChange = (event) => {
    const value = event.target.value;
    if (value <= 3700 && value >= 0) {
      setWaterLevel(value);
    }
  };
  // Calculate the stroke-dasharray value as a percentage of the water level
  const strokeDashArray = (waterLevel / 3700) * 100; // Percentage of the full circle
  const progressStrokeDashArray = `${strokeDashArray} 100`;

  // Add water log to the database
  const handleAddWater = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage

      // Convert waterLevel to a number before sending the request
      const waterIntake = Number(waterLevel); // Ensure it's a number

      const response = await fetch('http://localhost:8000/api/addwaterlog', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ waterIntake }), // Send the number in the request body
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to add water log');
        console.error('Error adding water log:', data); // Log the full error response
        toast.error(`Error: ${data.message || 'Failed to add water log'}`);
      } else {
        setError(null);
        setWaterLevel(0); // Optionally clear the input on success
        toast.success('Water log added successfully!');

        // Re-fetch today's water log to update the displayed data
        fetchTodayWaterLog();
      }
    } catch (err) {
      setError('Failed to add water log');
      console.error('Error:', err);
      toast.error('An error occurred while adding the water log!'); // Log any additional errors, including network issues
    }
  };

  const handleEditWater = async () => {
    try {
      const token = localStorage.getItem('token');

      // Convert waterLevel to a number before sending the request
      const waterIntake = Number(waterLevel); // Ensure it's a number

      // Get today's date in 'YYYY-MM-DD' format
      const today = new Date().toISOString().split('T')[0];

      // Construct the API URL with the date query parameter
      const apiUrl = `http://localhost:8000/api/updwaterlog?date=${today}`;

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ waterIntake }), // Send the waterIntake in the request body
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update water log');
        console.error('Error updating water log:', data);
        toast.error(`Error: ${data.message || 'Failed to update water log'}`);
      } else {
        setError(null);
        setWaterLevel(0); // Optionally clear the input on success
        toast.success('Water log updated successfully!');
        fetchTodayWaterLog();
      }
    } catch (err) {
      setError('Failed to update water log');
      console.error('Error:', err);
      toast.error('An error occurred while updating the water log!');
    }
  };

  const handleClick = () => {
    navigate('/water-history'); // Navigate to the water history page
  };

  return (
    <>
      <div className="water-container">
        <h1 className="water-h1">Track Water</h1>

        <div className="add-water-container">
          <h3>Time to hydrate !! How much water have you had so far?</h3>
          <div className="water-input">
            <input
              type="number"
              placeholder="Enter water (ml)"
              value={waterLevel}
              onChange={handleChange}
            />
          </div>

          <div className="add-edit-water">
            <button className="add" onClick={handleAddWater}>
              <FaPlusCircle size={30} />
            </button>
            <button className="edit" onClick={handleEditWater}>
              <FaEdit size={30} />
            </button>
          </div>
        </div>

        <div className="gauge-container">
          <div className="gauge">
            <svg className="gauge-svg" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-current text-gray-200"
                strokeWidth="1.5"
                strokeDasharray="100 100"
                strokeLinecap="round"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-current text-blue-600"
                strokeWidth="1.5"
                strokeDasharray={progressStrokeDashArray}
                strokeLinecap="round"
              />
            </svg>

            <div className="gauge-text">
              <span className="text-2xl font-bold text-blue-600">{waterLevel}/3700</span>
              <span className="text-blue-600 block">ml</span>
            </div>
          </div>
        </div>

        <div className="goal-history-container">
          <button className="navigate-button" onClick={handleClick}>
            View Water History
            <FaHistory size={30} className="button-icon" />
          </button>
        </div>
      </div>
    </>
  );
};

export default TrackWater;
