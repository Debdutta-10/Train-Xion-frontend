import React from 'react';
import "../../styles/TodayNutriCard.css"

const TodayNutriCard = ({ title, nutrition }) => {
  return (
    <div className="nutrition-card">
      <h3>{title}</h3>
      <p>Calories: {nutrition.calories}</p>
      <p>Protein: {nutrition.protein}g</p>
      <p>Carbs: {nutrition.carbs}g</p>
      <p>Fat: {nutrition.fats}g</p>
    </div>
  );
};

export default TodayNutriCard;
