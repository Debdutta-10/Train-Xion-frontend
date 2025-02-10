import React, { useState, useEffect } from 'react';
import { FaAppleAlt, FaWater, FaDumbbell } from 'react-icons/fa'; // Example icons
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify'; // For toast notifications
import "../styles/DashBoard.css"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [foodLogsHistory, setFoodLogsHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // For loading state
  const [nutritionData, setNutritionData] = useState({
    total: { calories: 0, protein: 0, carbs: 0, fats: 0 }
  }); // To hold the nutrition data for today
  const [selectedNutrient, setSelectedNutrient] = useState('calories'); // Default to 'calories'

  // Fetch food logs history when the component mounts
  useEffect(() => {
    const fetchFoodLogsHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/getallfoodlog', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFoodLogsHistory(data.foodLogs);
        } else {
          setError(data.message || 'Error fetching history');
        }
      } catch (error) {
        setError('Failed to fetch food log history');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodLogsHistory();
  }, []);

  // Function to fetch nutrition data for today
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
          total: data.totalNutrients || { calories: 0, protein: 0, carbs: 0, fats: 0 },
        }));
      } else {
        toast.error('Error fetching total nutrition data');
      }
    } catch (error) {
      toast.error('Failed to fetch total nutrition data');
      console.error('Error:', error);
    }
  };

  // Fetch the nutrition data when the component mounts
  useEffect(() => {
    fetchTotalNutrition();
  }, []);

  // Group food logs by day of the week and sum the nutrients for each day
  const getWeeklyNutrients = () => {
    const weeklyNutrients = {
      Monday: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      Tuesday: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      Wednesday: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      Thursday: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      Friday: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      Saturday: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      Sunday: { calories: 0, protein: 0, carbs: 0, fats: 0 },
    };

    foodLogsHistory.forEach((log) => {
      if (weeklyNutrients.hasOwnProperty(log.dayOfWeek)) {
        weeklyNutrients[log.dayOfWeek].calories += log.calories;
        weeklyNutrients[log.dayOfWeek].protein += log.protein;
        weeklyNutrients[log.dayOfWeek].carbs += log.carbs;
        weeklyNutrients[log.dayOfWeek].fats += log.fats;
      }
    });

    return weeklyNutrients;
  };

  // Prepare data for the weekly graph based on selected nutrient
  const weeklyNutrients = getWeeklyNutrients();
  const chartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: `${selectedNutrient.charAt(0).toUpperCase() + selectedNutrient.slice(1)} Intake`,
        data: [
          weeklyNutrients.Monday[selectedNutrient],
          weeklyNutrients.Tuesday[selectedNutrient],
          weeklyNutrients.Wednesday[selectedNutrient],
          weeklyNutrients.Thursday[selectedNutrient],
          weeklyNutrients.Friday[selectedNutrient],
          weeklyNutrients.Saturday[selectedNutrient],
          weeklyNutrients.Sunday[selectedNutrient],
        ],
        borderColor: '#FF5733',
        backgroundColor: '#FF5733',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Render the component based on loading and error states
  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if fetch fails
  }

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Welcome to Your Dashboard</h1>
      </div>

      <div className="dashboard-cards">
        <div className="card food-log">
          <FaAppleAlt className="icon" />
          <h3>Food Logs</h3>
          <p>{foodLogsHistory.length} entries</p>
        </div>

        <div className="card water-log">
          <FaWater className="icon" />
          <h3>Water Intake</h3>
          <p>10 logs</p>
        </div>

        <div className="card workout-log">
          <FaDumbbell className="icon" />
          <h3>Workouts</h3>
          <p>5 workouts</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart">
          <h2>Food Log over the Week</h2>
          <div className="nutrient-selector">
            <button onClick={() => setSelectedNutrient('calories')}>Calories</button>
            <button onClick={() => setSelectedNutrient('protein')}>Protein</button>
            <button onClick={() => setSelectedNutrient('carbs')}>Carbs</button>
            <button onClick={() => setSelectedNutrient('fats')}>Fats</button>
          </div>
          <Line data={chartData} />
        </div>

        <div className="chart">
          <h2>Daily Nutrition Summary</h2>
          <div className="nutrition-stats">
            <p>Calories: {nutritionData.total.calories} kcal</p>
            <p>Protein: {nutritionData.total.protein}g</p>
            <p>Carbs: {nutritionData.total.carbs}g</p>
            <p>Fat: {nutritionData.total.fats}g</p>
          </div>
        </div>
        <div className="chart">
          <h2>Daily Hydration Summary</h2>
          <div className="nutrition-stats">
            <p>Calories: {nutritionData.total.calories} kcal</p>
            <p>Protein: {nutritionData.total.protein}g</p>
            <p>Carbs: {nutritionData.total.carbs}g</p>
            <p>Fat: {nutritionData.total.fats}g</p>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
