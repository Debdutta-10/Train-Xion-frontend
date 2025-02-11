import React, { useEffect, useState } from 'react';
import WorkoutCard from './WorkoutCard';  // Assuming you have a WorkoutCard component to display each workout
import "../../styles/WorkoutHistory.css";  // Include the CSS for styling

const WorkoutHistory = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchWorkouts();
  }, []);

  const handleDeleteWorkout = (workoutId) => {
    setWorkouts((prevWorkouts) => prevWorkouts.filter(workout => workout.id !== workoutId));
  };
  

  const handleUpdate = (updatedWorkout) => {
    // Find the updated workout and update it in the state
    setWorkouts(prevWorkouts => 
      prevWorkouts.map(workout => workout.id === updatedWorkout.id ? updatedWorkout : workout)
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="workout-history-container">
      <h1 className="workout-h1">Workout History</h1>
      <div className="all-workouts">
        {workouts.length > 0 ? (
          workouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onDelete={handleDeleteWorkout}  // Pass the delete handler
              onUpdate={handleUpdate}  // Your update function
            />
          ))
        ) : (
          <p>No workouts found</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutHistory;
