// Dashboardapis.js
import axios from 'axios';
import "../styles/DashBoard.css"

export const fetchFoodLogsHistory = async (setFoodLogsHistory, setError, setLoading) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token is missing');
            return;
        }

        setLoading(true); // Start loading

        const response = await axios.get('https://train-xion-backend.onrender.com/api/getallfoodlog', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        setFoodLogsHistory(response.data.foodLogs); // Update the state with fetched food logs
    } catch (error) {
        setError('Failed to fetch food log history');
        console.error('Error fetching food logs:', error);
    } finally {
        setLoading(false); // Set loading to false after the request finishes
    }
};


