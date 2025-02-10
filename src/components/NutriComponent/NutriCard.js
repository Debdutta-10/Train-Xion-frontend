import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import "../../styles/NutriCard.css";

const NutriCard = ({ log, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editLog, setEditLog] = useState(log);

    // Handle edit mode toggle
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Handle delete log
    const handleDelete = () => {
        onDelete(log.id);
        toast.success('Food log deleted successfully');
    };

    // Handle the update form submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const updatedLog = {
            dayOfWeek: editLog.dayOfWeek,
            mealType: editLog.mealType,
            foodName: editLog.foodName,
        };

        onUpdate(updatedLog);
        setIsEditing(false);
        toast.success('Food log updated successfully');
    };

    return (
        <div className="food-log-card">
            {!isEditing ? (
                <>
                    <h3>{log.foodName}</h3>
                    <p>Meal: {log.mealType} | Day: {log.dayOfWeek}</p>
                    <p>Calories: {log.calories}</p>
                    <p>Protein: {log.protein}g | Carbs: {log.carbs}g | Fats: {log.fats}g</p>

                    <div className="food-log-actions">
                        <FaEdit onClick={handleEdit} className="icon edit-icon" />
                        <FaTrashAlt onClick={handleDelete} className="icon delete-icon" />
                    </div>
                </>
            ) : (
                <div className="food-log-edit-form">
                    <div className="overlay" onClick={() => setIsEditing(false)}></div>
                    <div className="edit-form-container">
                        <FaTimes onClick={() => setIsEditing(false)} className="close-icon" />
                        <h2>Edit Food Log</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div>
                                <label>Food Name</label>
                                <input
                                    type="text"
                                    value={editLog.foodName}
                                    onChange={(e) => setEditLog({ ...editLog, foodName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Meal Type</label>
                                <input
                                    type="text"
                                    value={editLog.mealType}
                                    onChange={(e) => setEditLog({ ...editLog, mealType: e.target.value })}
                                />
                            </div>
                            <div>
                                <label>Day of Week</label>
                                <input
                                    type="text"
                                    value={editLog.dayOfWeek}
                                    onChange={(e) => setEditLog({ ...editLog, dayOfWeek: e.target.value })}
                                />
                            </div>
                            <button type="submit">Update Food Log</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutriCard;
