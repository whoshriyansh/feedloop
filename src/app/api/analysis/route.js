/**
 * @desc    API route gets id of the feedata -> we find feeddata with associated id -> use groq api to analyze -> send the data to the client
 * @author  Shriyansh
 * @since   2025
 */

import dbConnect from "@/lib/db/ConnectDb";
import FeedData from "@/lib/models/Feed.model";
import Groq from "groq-sdk";
import { errorResponse, successResponse } from "@/lib/types/ApiResponse";
import { safeParseAIJson } from "@/lib/utils/parseAIJson";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_SECRET,
});

export async function POST(request) {
  const { feedId } = await request.json();
  if (!feedId) return errorResponse(400, "feedId is required");
  try {
    await dbConnect();

    const feed = await FeedData.findById(feedId);
    if (!feed) return errorResponse(404, "Transcript not found");

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Analyze this interview transcript: "${feed.transcriptText}". Provide feedback for:
- Interviewees: what went well, what could improve, actionable tips.
- Recruiters: areas they may have missed, or questions they could have asked but didn’t.
Output in structured JSON for easy parsing.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const analyzedText = response.choices[0].message.content;
    console.log(analyzedText);

    const parsed = safeParseAIJson(analyzedText);

    feed.analysesText = parsed;
    await feed.save();
    return successResponse(200, "Analysis complete", feed);
  } catch (error) {
    return errorResponse(500, error.message, error);
  }
}
