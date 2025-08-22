"use client";

import React, { useState } from "react";
import Groq from "groq-sdk";
import OpenAI from "openai";
import { Button } from "../ui/button";

const Uploadform = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
      console.log("This is the file", file);
    }
  };

  console.log("This is videoFile", videoFile);

  const whisper = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_WHISPER_API_KEY,
    dangerouslyAllowBrowser: true,
    baseURL: "https://api.lemonfox.ai/v1",
  });

  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_SECRET,
    dangerouslyAllowBrowser: true,
  });

  async function main() {
    if (!videoFile) {
      console.error("No file selected");
      return;
    }

    const transcription = await whisper.audio.transcriptions.create({
      file: videoFile,
      model: "whisper-1",
    });

    setTranscript(transcription.text);
  }

  async function analyze() {
    if (!transcript.trim()) {
      console.error("No transcript available");
      return;
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Free, strong model
      messages: [
        {
          role: "user",
          content: `Analyze this interview transcript: "${transcript}". Provide feedback for:
- Interviewees: what went well, what could improve, actionable tips.
- Recruiters: areas they may have missed, or questions they could have asked but didn’t.
Output in structured JSON for easy parsing.`,
        },
      ],
      temperature: 0.7, // Adjust for creativity
      max_tokens: 1000, // Limit for cost/speed
    });

    const analyzedText = response.choices[0].message.content;
    setFeedback(analyzedText);
    console.log("Feedback:", analyzedText);
  }

  return (
    <div className="w-3/5 h-1/2 bg-amber-500">
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      <Button onClick={main}>Generate</Button>
      <Button onClick={analyze}>Analyze</Button>
    </div>
  );
};

export default Uploadform;
