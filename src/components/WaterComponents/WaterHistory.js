import React, { useEffect, useState } from 'react';
import WaterCard from './WaterCard';
import "../../styles/WaterHistory.css";

const WaterHistory = () => {
  const [waterLogs, setWaterLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWaterLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:8000/api/getallwaterlog', {
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

    fetchWaterLogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="water-history-container">
      <h1 className="water-h1">Drink History</h1>
      <div className="all-histories">
        {waterLogs.length > 0 ? (
          waterLogs.map((log) => (
            <WaterCard key={log.id} log={log} />
          ))
        ) : (
          <p>No water logs found</p>
        )}
      </div>
    </div>
  );
};

export default WaterHistory;
