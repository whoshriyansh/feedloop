"use client";

import React, { useState } from "react";
import Groq from "groq-sdk";
import { AssemblyAI } from "assemblyai";
import OpenAI from "openai";
import { Button } from "../ui/button";

const TextBox = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  // const whisper = new OpenAI({
  //   apiKey: process.env.NEXT_PUBLIC_WHISPER_API_KEY,
  //   dangerouslyAllowBrowser: true,
  //   baseURL: "https://api.lemonfox.ai/v1",
  // });

  // async function main() {
  //   if (!videoFile) {
  //     console.error("No file selected");
  //     return;
  //   }

  //   const transcription = await whisper.audio.transcriptions.create({
  //     file: videoFile,
  //     model: "whisper-1",
  //     speaker_labels: true,
  //     min_speakers: 1,
  //     max_speakers: 2,
  //   });

  //   setTranscript(transcription.text);
  // }

  const client = new AssemblyAI({
    apiKey: process.env.NEXT_PUBLIC_ASSEMBLY_API_KEY,
  });

  async function transcribeVideo() {
    if (!videoFile) {
      console.error("No file selected");
      return;
    }

    const transcript = await client.transcripts.transcribe({
      audio: videoFile,
      speech_model: "universal",
      speaker_labels: true,
      speaker_options: {
        min_speakers_expected: 1,
        max_speakers_expected: 2,
      },
    });

    console.log(`This is normal text`, transcript);

    transcript.utterances.forEach((w) => {
      console.log(`[Speaker ${w.speaker}] ${w.text}`);
    });
  }

  const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_SECRET,
    dangerouslyAllowBrowser: true,
  });

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
      <Button onClick={transcribeVideo}>Generate</Button>
      <Button onClick={analyze}>Analyze</Button>
    </div>
  );
};

export default TextBox;
