import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  const handleLogout = () => {
    // 1. Destroy the token
    localStorage.removeItem('token');
    // 2. Kick the user back to the login screen
    navigate('/login');
  };

  return (
    <nav className="w-full bg-gray-800 border-b border-gray-700 p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
       
        <Link to="/" className="text-2xl font-extrabold text-white tracking-tight">
          AI<span className="text-emerald-400">Fitness</span>
        </Link>

        
        <div className="space-x-6 flex items-center">
          {token ? (
            <>
              
              <Link to="/dashboard" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors">
                Diet Plan
              </Link>
              <Link to="/workout" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors">
                Workouts
              </Link>
              
              
              <button 
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 px-5 py-2 rounded-lg font-bold transition-all shadow-md">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}