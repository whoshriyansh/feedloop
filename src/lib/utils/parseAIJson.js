export function safeParseAIJson(aiResponse) {
  if (!aiResponse) return { error: "Empty AI response" };

  let cleaned = aiResponse.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    return {
      error: "Invalid JSON from AI",
      raw: aiResponse,
      cleaned,
    };
  }
}
