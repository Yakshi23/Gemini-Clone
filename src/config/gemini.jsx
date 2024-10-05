import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDp4Pj-rDnBX2H3jmnUctIfi0sWrEEJ36E");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 3000, // Reduced output tokens
  responseMimeType: "text/plain",
};

const MAX_HISTORY_LENGTH = 10; // Limit the chat history length

async function run(prompt) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const response=result.response;
    console.log(response.text());
    return response.text();

    // Manage history size
    if (chatSession.history.length > MAX_HISTORY_LENGTH) {
      chatSession.history.splice(0, chatSession.history.length - MAX_HISTORY_LENGTH);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export default run;
