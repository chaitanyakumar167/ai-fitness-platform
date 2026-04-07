const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API using your secret key
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

const generateDietPlan = async (req, res) => {
  try {
    // 1. Extract the user's fitness metrics from the incoming request
    const { heightCm, weightKg, goal, dietType } = req.body;

    // 2. Select the AI model (gemini-1.5-flash is very fast and great for JSON data)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Construct the strict prompt
    const prompt = `
      Act as an expert sports nutritionist. 
      Create a 1-day sample diet plan for a user with the following metrics:
      - Height: ${heightCm} cm
      - Weight: ${weightKg} kg
      - Goal: ${goal}
      - Dietary Preference: ${dietType}

      You MUST respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json. 
      Use this exact structure:
      {
        "estimatedTDEE": number,
        "targetCalories": number,
        "meals": [
          { "mealName": "Breakfast", "items": ["item 1", "item 2"], "calories": number }
        ]
      }
    `;

    // 4. Call the AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // 5. Clean the response (just in case the AI adds formatting) and parse to JSON
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonPlan = JSON.parse(text);

    // 6. Send the generated plan back to the frontend
    res.status(200).json({ success: true, plan: jsonPlan });

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate diet plan. Please try again." });
  }
};


const generateWorkoutPlan = async (req, res) => {
  try {
    // 1. Extract the workout specific data from the request body
    const { goal, fitnessLevel, equipment, daysPerWeek } = req.body;

    // 2. Select the active Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Construct the strict prompt for a personal trainer
    const prompt = `
      Act as an expert personal trainer. 
      Create a ${daysPerWeek}-day workout routine for a ${fitnessLevel} individual.
      - Goal: ${goal}
      - Available Equipment: ${equipment}

      You MUST respond ONLY with a valid JSON object. Do not include any markdown formatting like \`\`\`json. 
      Use this exact structure:
      {
        "routineName": "String (e.g., 3-Day Dumbbell Split)",
        "days": [
          {
            "dayNumber": number,
            "focusArea": "String (e.g., Upper Body, Leg Day, Active Recovery)",
            "exercises": [
              { "name": "String", "sets": number, "reps": "String (e.g., 8-10)", "restSeconds": number }
            ]
          }
        ]
      }
    `;

    // 4. Call the AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // 5. Clean the response and parse to JSON
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonWorkout = JSON.parse(text);

    // 6. Send the generated plan back
    res.status(200).json({ success: true, plan: jsonWorkout });

  } catch (error) {
    console.error("AI Workout Generation Error:", error);
    res.status(500).json({ success: false, message: "Failed to generate workout plan." });
  }
};

// Update your exports at the very bottom!
module.exports = { generateDietPlan, generateWorkoutPlan };