import React, { useEffect, useState } from 'react';
import GoalCard from './GoalCard';
import "../../styles/GoalHistory.css";

const GoalHistory = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:8000/api/getallgoals', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setGoals(data.goals); // Set the goals data from the response
        } else {
          setError(data.message || 'Error fetching data');
        }
      } catch (error) {
        setError('Failed to fetch goal data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const handleGoalDelete = (goalId) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  };

  const handleUpdate = (updatedGoal) => {
    // Find the updated goal and update it in the state
    setGoals(prevGoals => 
      prevGoals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal)
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="goal-history-container">
      <h1 className="goal-h1">Goal History</h1>
      <div className="all-goals">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onDelete={handleGoalDelete} onUpdate={handleUpdate}/>
          ))
        ) : (
          <p>No goals found</p>
        )}
      </div>
    </div>
  );
};

export default GoalHistory;
