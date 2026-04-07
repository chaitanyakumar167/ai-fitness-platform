import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Workout() {
  const [formData, setFormData] = useState({
    goal: "muscle_gain",
    fitnessLevel: "beginner",
    equipment: "full_gym",
    daysPerWeek: 3,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "https://ai-fitness-platform-cc1u.onrender.com/api/generate-workout",
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setGeneratedWorkout(response.data.plan);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to generate workout. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://ai-fitness-platform-cc1u.onrender.com/api/user/save-plan",
        { type: "workout", planData: generatedWorkout },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Workout plan saved to your profile successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save workout plan.");
    }
  };

  if (generatedWorkout) {
    return (
      <div className="w-full max-w-5xl p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center mb-10 border-b border-gray-700 pb-6">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            {generatedWorkout.routineName}
          </h2>
          <p className="text-emerald-400 mt-2 font-medium">
            AI-Optimized Training Protocol
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {generatedWorkout.days.map((day, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-colors"
            >
              <div className="mb-4">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Day {day.dayNumber}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {day.focusArea}
                </h3>
              </div>

              <ul className="space-y-4">
                {day.exercises.map((exercise, idx) => (
                  <li key={idx} className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-emerald-400 font-bold text-sm mb-1">
                      {exercise.name}
                    </p>
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>
                        {exercise.sets} Sets x {exercise.reps}
                      </span>
                      <span>Rest: {exercise.restSeconds}s</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-4 w-full">
          <button
            onClick={handleSavePlan}
            className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-lg transition-all shadow-lg"
          >
            Save to Profile
          </button>
          <button
            onClick={() => setGeneratedWorkout(null)}
            className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
          >
            Generate New Split
          </button>
        </div>
      </div>
    );
  }

  // --- WORKOUT ONBOARDING FORM UI ---
  return (
    <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Forge Your <span className="text-emerald-400">Path</span>
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          Select your parameters to construct a custom training split.
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Primary Goal
          </label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
          >
            <option value="weight_loss">Fat Loss</option>
            <option value="muscle_gain">Hypertrophy (Muscle Gain)</option>
            <option value="strength">Raw Strength</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Experience Level{" "}
            <span className="text-gray-500 text-xs ml-2 font-normal">
              (Time training consistently)
            </span>
          </label>
          <select
            name="fitnessLevel"
            value={formData.fitnessLevel}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
          >
            <option value="beginner">Beginner (0 - 6 Months)</option>
            <option value="intermediate">
              Intermediate (6 Months - 2 Years)
            </option>
            <option value="advanced">Advanced (2+ Years)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Available Equipment
          </label>
          <select
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
          >
            <option value="full_gym">Full Gym Access</option>
            <option value="dumbbells_only">Dumbbells Only</option>
            <option value="bodyweight">Bodyweight / Calisthenics</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Training Days Per Week
          </label>
          <input
            type="number"
            name="daysPerWeek"
            min="2"
            max="6"
            value={formData.daysPerWeek}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-lg shadow-lg disabled:opacity-50 transition-all"
        >
          {isLoading ? "Compiling Exercises..." : "Construct Workout"}
        </button>
      </form>
    </div>
  );
}
