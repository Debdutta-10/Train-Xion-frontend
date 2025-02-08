import React from 'react';
import { FaTint } from 'react-icons/fa';
import "../styles/WaterCard.css";

const WaterCard = ({ log }) => {
  const { date, waterIntake } = log;

  // Format the date to dd/mm/yyyy
  const formattedDate = new Date(date);
  const day = String(formattedDate.getDate()).padStart(2, '0');
  const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = formattedDate.getFullYear();
  const formattedDateString = `${day}/${month}/${year}`;

  return (
    <div className="water-card">
      <div className="date-ml">
        <h3 className="date">Date: {formattedDateString}</h3>
        <h4 className="ml">{waterIntake} ml</h4>
      </div>
      <div className="drop-icon">
        <FaTint size={50} color="#32a6f3" />
      </div>
    </div>
  );
};

export default WaterCard;
