import {GoogleGenerativeAI} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const askGeminiModel= async(prompt)=>{
try {
    const result  = await model.generateContent(prompt);
    return result.response.text();
} catch (error) {
    console.log(error);
    throw new Error("Failed to generate AI response.");
}
};