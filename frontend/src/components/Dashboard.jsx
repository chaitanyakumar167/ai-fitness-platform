import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [viewDiet, setViewDiet] = useState(false);       
  const [viewWorkout, setViewWorkout] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://ai-fitness-platform-cc1u.onrender.com/api/user/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData(response.data.user);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
        console.log(err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!userData) return <p className="text-emerald-500 text-center mt-10 text-xl font-bold">Loading Profile...</p>;

  return (
    <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 relative">
      <div className="mb-8 border-b border-gray-700 pb-4">
        <h2 className="text-3xl font-extrabold text-white">
          Welcome back, <span className="text-emerald-400">{userData.name}</span>
        </h2>
        <p className="text-gray-400">Manage your active AI fitness protocols.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Saved Diet Plan Card */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Active Diet Plan</h3>
          {userData.savedDietPlan ? (
            <div>
              <p className="text-emerald-400 font-bold mb-2">
                Target: {userData.savedDietPlan.targetCalories} kcal
              </p>
              <p className="text-gray-300 text-sm mb-6">
                You have a custom {userData.savedDietPlan.meals.length}-meal protocol saved.
              </p>
              <button 
                onClick={() => setViewDiet(true)} 
                className="w-full py-3 bg-emerald-500/10 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500/20 transition-colors border border-emerald-500/30"
              >
                View Full Diet
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No diet plan saved yet.</p>
              <Link to="/" className="text-emerald-400 hover:underline">Generate One</Link>
            </div>
          )}
        </div>

        {/* Saved Workout Plan Card */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Active Workout</h3>
          {userData.savedWorkoutPlan ? (
            <div>
              <p className="text-emerald-400 font-bold mb-2">
                Routine: {userData.savedWorkoutPlan.routineName}
              </p>
              <p className="text-gray-300 text-sm mb-6">
                You have a {userData.savedWorkoutPlan.days.length}-day training split saved.
              </p>
              <button 
                onClick={() => setViewWorkout(true)}
                className="w-full py-3 bg-emerald-500/10 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500/20 transition-colors border border-emerald-500/30"
              >
                View Full Workout
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">No workout plan saved yet.</p>
              <Link to="/workout" className="text-emerald-400 hover:underline">Generate One</Link>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL FOR FULL DIET PLAN --- */}
      {viewDiet && userData.savedDietPlan && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-3xl my-8 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Diet Protocol</h2>
              <button onClick={() => setViewDiet(false)} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {userData.savedDietPlan.meals.map((meal, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-xl border border-gray-700">
                  <h3 className="font-bold text-white mb-2">{meal.mealName} <span className="text-emerald-400 text-sm float-right">{meal.calories} kcal</span></h3>
                  <ul className="space-y-1">
                    {meal.items.map((item, idx) => (
                      <li key={idx} className="text-gray-400 text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL FOR FULL WORKOUT PLAN --- */}
      {viewWorkout && userData.savedWorkoutPlan && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-4xl my-8 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{userData.savedWorkoutPlan.routineName}</h2>
              <button onClick={() => setViewWorkout(false)} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userData.savedWorkoutPlan.days.map((day, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-xl border border-gray-700">
                  <span className="text-emerald-400 text-xs font-bold uppercase">Day {day.dayNumber}</span>
                  <h3 className="font-bold text-white mb-3">{day.focusArea}</h3>
                  <ul className="space-y-3">
                    {day.exercises.map((exercise, idx) => (
                      <li key={idx} className="bg-gray-800 p-2 rounded">
                        <p className="text-gray-200 font-bold text-sm">{exercise.name}</p>
                        <p className="text-gray-400 text-xs">{exercise.sets}x{exercise.reps} | Rest: {exercise.restSeconds}s</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}