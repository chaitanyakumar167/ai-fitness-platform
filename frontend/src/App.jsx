import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Register from './components/Register';
import Workout from './components/Workout'; 
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/workout" element={<Workout />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}