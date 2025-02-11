import React, { useEffect, useState } from 'react';
import NutriCard from './NutriCard'; // Assuming NutriCard is in the same folder
import "../../styles/NutriHistory.css";

const NutriHistory = () => {
    const [foodLogsHistory, setFoodLogsHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch food logs history
    useEffect(() => {
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

    // Handle delete of a food log
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://train-xion-backend.onrender.com/api/delfoodlog/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setFoodLogsHistory(foodLogsHistory.filter(log => log.id !== id));
            } else {
                setError('Error deleting food log: ' + data.message);
            }
        } catch (error) {
            setError('Failed to delete food log');
        }
    };

    // Handle update of a food log
    const handleUpdate = async (updatedLog) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://train-xion-backend.onrender.com/api/updfoodlog/${updatedLog.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedLog),
            });

            const data = await response.json();

            if (response.ok) {
                setFoodLogsHistory(foodLogsHistory.map(log => log.id === updatedLog.id ? updatedLog : log));
            } else {
                setError('Error updating food log: ' + data.message);
            }
        } catch (error) {
            setError('Failed to update food log');
        }
    };

    if (loading) {
        return <div>Loading history...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='entire-food-log-container'>
            <h1 className="food-log-h1">Explore Your Health & Nutrition Timeline</h1>
            <div className="food-log-history">
                {foodLogsHistory.length > 0 ? (
                    foodLogsHistory.map((log) => (
                        <NutriCard
                            key={log.id}
                            log={log}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))
                ) : (
                    <p>No history found</p>
                )}
            </div>
        </div>
    );
};

export default NutriHistory;
