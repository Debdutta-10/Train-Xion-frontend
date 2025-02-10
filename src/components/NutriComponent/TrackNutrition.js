import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify"; // For displaying notifications
import { FaPlusCircle, FaCalendarAlt, FaUtensils } from 'react-icons/fa'; // Added icons
import TodayNutriCard from './TodayNutriCard';
import "../../styles/TrackNutrition.css";

const TrackNutrition = () => {
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [mealType, setMealType] = useState('');
  const [foodName, setFoodName] = useState('');


  // State to hold the nutrition data for each meal
  const [nutritionData, setNutritionData] = useState({
    breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    snacks: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    total: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  });

  const getCurrentDayOfWeek = () => {
    const currentDay = new Date().toLocaleString('en-US', { weekday: 'long' });
    return currentDay;
  };

  const fetchMealNutrition = async (mealType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/totalNutritionForToday?mealType=${mealType}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNutritionData((prevState) => ({
          ...prevState,
          [mealType.toLowerCase()]: data.totalNutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 }
        }));
      } else {
        // toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error('Failed to fetch meal nutrition data');
      console.error('Error:', error);
    }
  };

  const fetchTotalNutrition = async () => {
    try {
      const token = localStorage.getItem('token');
      const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

      const response = await fetch('http://localhost:8000/api/getdatefoodlog?date=' + date, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setNutritionData((prevState) => ({
          ...prevState,
          total: data.totalNutrients || { calories: 0, protein: 0, carbs: 0, fat: 0 }
        }));
      } else {
        toast.error('Error fetching total nutrition data');
      }
    } catch (error) {
      toast.error('Failed to fetch total nutrition data');
      console.error('Error:', error);
    }
  };

  // Fetch data for each meal and total when the component mounts
  useEffect(() => {
    fetchMealNutrition('Breakfast');
    fetchMealNutrition('Lunch');
    fetchMealNutrition('Snacks');
    fetchMealNutrition('Dinner');
    setDayOfWeek(getCurrentDayOfWeek());
    fetchTotalNutrition();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const foodLogData = {
      dayOfWeek,
      mealType,
      foodName
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/addfoodlog', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(foodLogData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Food log added successfully!');
        setDayOfWeek('');
        setMealType('');
        setFoodName('');
        fetchMealNutrition('Breakfast');
        fetchMealNutrition('Lunch');
        fetchMealNutrition('Snacks');
        fetchMealNutrition('Dinner');
        fetchTotalNutrition();
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error('Failed to add food log. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="food-log-container">
        <div className="form-container">
          <h2>Track Your Nutrition</h2>
          <form onSubmit={handleSubmit} className="nutrition-form">
            <div className="nutrition-form-group-inline">
              <div className="nutrition-form-group">
                <label htmlFor="dayOfWeek">
                  <FaCalendarAlt /> Day of the Week
                </label>
                <select
                  id="dayOfWeek"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  required
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div className="nutrition-form-group">
                <label htmlFor="mealType">
                  <FaUtensils /> Meal Type
                </label>
                <select
                  id="mealType"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  required
                >
                  <option value="">Select Meal</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div className="nutrition-form-group">
                <label htmlFor="foodName">
                  <FaUtensils /> Food Name
                </label>
                <input
                  type="text"
                  id="foodName"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  required
                  placeholder="Enter food name (e.g., 3 boiled eggs)"
                />
              </div>

              {/* Round plus icon button */}
              <button type="submit" className="nutrition-submit-btn">
                <FaPlusCircle size={40} />
              </button>
            </div>
          </form>
        </div>
        <h2>What's in Your Plate? Total Calories & Nutritional Breakdown</h2>

        {/* Display Nutrition Cards */}
        <div className="nutrition-cards">
          <TodayNutriCard title="Breakfast" nutrition={nutritionData.breakfast} />
          <TodayNutriCard title="Lunch" nutrition={nutritionData.lunch} />
          <TodayNutriCard title="Snacks" nutrition={nutritionData.snacks} />
          <TodayNutriCard title="Dinner" nutrition={nutritionData.dinner} />
          <TodayNutriCard title="Total" nutrition={nutritionData.total} />
        </div>
      </div>
    </>
  );
};

export default TrackNutrition;
