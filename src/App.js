import './App.css';
import './index.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Navbar from './components/Navbar';
import TrackNutrition from './components/NutriComponent/TrackNutrition';
import TrackWater from './components/WaterComponents/TrackWater';
import TrackGoals from './components/GoalComponents/TrackGoals';
import TrackWorkouts from './components/WorkoutComponent/TrackWorkouts';
import WaterHistory from './components/WaterComponents/WaterHistory';
import GoalHistory from './components/GoalComponents/GoalHistory'

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

function MainApp() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path="/track-nutrition" element={<TrackNutrition />} />
          <Route path="/track-water" element={<TrackWater />} />
          <Route path="/track-goals" element={<TrackGoals />} />
          <Route path="/track-workouts" element={<TrackWorkouts />} />
          <Route path="/water-history" element={<WaterHistory></WaterHistory>} />
          <Route path="/goal-history" element={<GoalHistory></GoalHistory>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
