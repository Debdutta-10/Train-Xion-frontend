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
  const [waterLevel, setWaterLevel] = useState(0);
  const [waterLogs, setWaterLogs] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  const [nutritionData, setNutritionData] = useState({
    total: { calories: 0, protein: 0, carbs: 0, fats: 0 }
  }); // To hold the nutrition data for today
  const [selectedNutrient, setSelectedNutrient] = useState('calories'); // Default to 'calories'

  const strokeDashArray = (waterLevel / 3700) * 100; // Percentage of the full circle
  const progressStrokeDashArray = `${strokeDashArray} 100`;


  const fetchFoodLogsHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://train-xion-backend.onrender.com/api/getallfoodlog', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFoodLogsHistory(data.foodLogs);  // Set foodLogs to empty array or data from backend
      } else {
        setError(data.message || 'Error fetching history');
      }
    } catch (error) {
      setError('Failed to fetch food log history');
      toast.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchTotalNutrition = async () => {
    try {
      const token = localStorage.getItem('token');
      const date = new Date().toISOString().split('T')[0];

      const response = await fetch('https://train-xion-backend.onrender.com/api/getdatefoodlog?date=' + date, {
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
        console.log('Error fetching total nutrition data');
      }
    } catch (error) {
      toast.error('Failed to fetch total nutrition data');
      console.error('Error:', error);
    }
  };

  const fetchTodayWaterLog = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await fetch('https://train-xion-backend.onrender.com/api/getwaterlogforday?date=' + new Date().toISOString().split('T')[0], {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to fetch water log for today');
        console.error('Error fetching water log:', data);
        // toast.error(`Error: ${data.message || 'Failed to fetch water log for today'}`);
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

  const fetchWaterLogs = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('https://train-xion-backend.onrender.com/api/getallwaterlog', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Sort the water logs by date in descending order
        const sortedLogs = data.waterLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setWaterLogs(sortedLogs);
      } else {
        setError(data.message || 'Error fetching data');
      }
    } catch (error) {
      setError('Failed to fetch water logs');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('https://train-xion-backend.onrender.com/api/getallworkouts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setWorkouts(data.workouts); // Set the workouts data from the response
      } else {
        setError(data.message || 'Error fetching data');
      }
    } catch (error) {
      setError('Failed to fetch workout data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchWaterLogs();
      await fetchTodayWaterLog();
      await fetchTotalNutrition();
      await fetchFoodLogsHistory();
      await fetchWorkouts();
    };

    fetchData();

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

    if (foodLogsHistory.length === 0) {
      return weeklyNutrients; // No logs, return zeros
    }

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
          <p>{foodLogsHistory.length > 0 ? `${foodLogsHistory.length} entries` : 'No food logs available'}</p>
        </div>


        <div className="card water-log">
          <FaWater className="icon" />
          <h3>Water Intake</h3>
          <p>{waterLogs.length > 0 ? `${waterLogs.length} logs` : 'No water intake logs available'}</p>
        </div>

        <div className="card workout-log">
          <FaDumbbell className="icon" />
          <h3>Workouts</h3>
          <p>{workouts.length > 0 ? `${workouts.length} workouts` : 'No workout logs available'}</p>
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
            <p>Calories: {nutritionData.total.calories || 0} kcal</p>
            <p>Protein: {nutritionData.total.protein || 0}g</p>
            <p>Carbs: {nutritionData.total.carbs || 0}g</p>
            <p>Fat: {nutritionData.total.fats || 0}g</p>
          </div>
        </div>
        <div className="chart charty-hydro">
          <h2>Daily Hydration Summary</h2>
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
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
