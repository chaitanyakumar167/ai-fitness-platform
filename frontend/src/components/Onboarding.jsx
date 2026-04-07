import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [formData, setFormData] = useState({
    heightCm: "",
    weightKg: "",
    goal: "muscle_gain",
    dietType: "none",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Grab the VIP wristband (Token) from local storage
      const token = localStorage.getItem("token");

      // If they don't have a token, force them to log in
      if (!token) {
        navigate("/login");
        return;
      }

      // 2. Send the data to the AI Backend with the token in the Headers
      const response = await axios.post(
        "https://ai-fitness-platform-cc1u.onrender.com/api/generate-diet",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // 3. Save the returned plan to state so React renders it
      setGeneratedPlan(response.data.plan);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Your session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to generate plan. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ---> NEW FUNCTION TO SAVE THE PLAN TO MONGODB <---
  const handleSavePlan = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://ai-fitness-platform-cc1u.onrender.com/api/user/save-plan",
        { type: "diet", planData: generatedPlan },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Plan saved to your profile successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save plan.");
    }
  };

  if (generatedPlan) {
    return (
      <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h2 className="text-3xl font-extrabold text-white">
            Your <span className="text-emerald-400">AI Diet Plan</span>
          </h2>
          <div className="text-right">
            <p className="text-emerald-400 font-bold text-xl">
              {generatedPlan.targetCalories} kcal
            </p>
            <p className="text-gray-400 text-sm">Daily Target</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {generatedPlan.meals.map((meal, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {meal.mealName}
                </h3>
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">
                  {meal.calories} kcal
                </span>
              </div>
              <ul className="space-y-2">
                {meal.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-gray-300 text-sm flex items-start"
                  >
                    <span className="text-emerald-500 mr-2">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4 w-full">
          <button
            onClick={handleSavePlan}
            className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-lg transition-all shadow-lg"
          >
            Save to Profile
          </button>
          <button
            onClick={() => setGeneratedPlan(null)}
            className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
          >
            Recalibrate Metrics
          </button>
        </div>
      </div>
    );
  }

  // --- ORIGINAL ONBOARDING FORM UI ---
  return (
    <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Unlock Your <span className="text-emerald-400">Potential</span>
        </h2>
        <p className="text-gray-400 mt-2 text-sm">
          Enter your metrics to generate a personalized AI diet plan.
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              name="heightCm"
              value={formData.heightCm}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weightKg"
              value={formData.weightKg}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

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
            <option value="weight_loss">Weight Loss</option>
            <option value="maintenance">Maintenance</option>
            <option value="muscle_gain">Muscle Gain</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Dietary Preference
          </label>
          <select
            name="dietType"
            value={formData.dietType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
          >
            <option value="none">No Restrictions</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="high_protein">High Protein</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-lg shadow-lg disabled:opacity-50 transition-all"
        >
          {isLoading ? "Calibrating AI Model..." : "Generate My Plan"}
        </button>
      </form>
    </div>
  );
}
