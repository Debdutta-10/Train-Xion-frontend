import './App.css';
import './index.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Navbar from './components/Navbar';
import TrackNutrition from './components/TrackNutrition';
import TrackWater from './components/TrackWater';
import TrackGoals from './components/TrackGoals';
import TrackWorkouts from './components/TrackWorkouts';
import WaterHistory from './components/WaterHistory';

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
        </Routes>
      </div>
    </>
  );
}

export default App;
