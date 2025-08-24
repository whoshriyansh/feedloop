"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrainCog, CloudUpload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

const Analyze = () => {
  const [formData, setFormData] = useState({
    mediaFile: null,
    min_speaker: 1,
    max_speaker: 2,
  });

  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const [transcript, setTranscript] = useState(null); // will store transcript object
  const [feedId, setFeedId] = useState(null);
  const [analyzedData, setAnalyzedData] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFormData((prev) => ({ ...prev, mediaFile: uploadedFile }));

      const previewUrl = URL.createObjectURL(uploadedFile);
      setPreview(previewUrl);

      setUploading(true);
      let prog = 0;
      const interval = setInterval(() => {
        prog += 5;
        setProgress(prog);

        if (prog > 100) {
          clearInterval(interval);
          setUploading(false);
        }
      }, 200);
    }
  };

  const handleClick = () => {
    document.getElementById("hiddenInput").click();
  };

  const getTranscript = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/transcript", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data.data;

      setIsGenerated(true);
      setTranscript(data);
      setFeedId(data._id);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getAnalyzedData = async () => {
    if (!feedId) return;
    try {
      setLoading(true);
      const response = await axios.post("/api/analysis", { feedId });
      setAnalyzedData(response.data.data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sidebar via-background to-sidebar text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-10">
        <h1 className="text-5xl md:text-4xl font-bold bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-clip-text text-transparent drop-shadow-lg">
          FeedLoop
        </h1>

        <p className="mt-4 max-w-xl text-sm text-muted-foreground">
          AI-powered media analysis tool that converts your audio/video into
          clean transcripts, summaries, and insights. Upload. Analyze. Learn.
        </p>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 container mx-auto">
        {/* Upload Card */}
        <Card className="w-full md:w-1/2 ">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Upload Your Media
            </CardTitle>
            <CardDescription className="text-gray-300">
              Supports MP4 / MP3 / WAV formats
            </CardDescription>
          </CardHeader>

          <CardContent>
            {uploading && (
              <div className="w-full">
                <Progress
                  value={progress}
                  className="bg-transparent border border-success [&>div]:bg-success"
                />
              </div>
            )}

            {isGenerated ? (
              <Card className="overflow-y-auto">
                <div>
                  {formData.mediaFile.type.startsWith("video/") ? (
                    <video controls width="100%" className="rounded-xl">
                      <source src={preview} type={formData.mediaFile.type} />
                    </video>
                  ) : (
                    <audio controls style={{ width: "100%" }}>
                      <source src={preview} type={formData.mediaFile.type} />
                    </audio>
                  )}
                </div>
                <div>
                  {transcript?.utterances?.map((u, i) => (
                    <div key={i} className="mt-2">
                      <h1 className="font-semibold">Speaker: {u.speaker}</h1>
                      <p>Sentence: {u.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              preview &&
              !uploading && (
                <Card className="">
                  <div className="w-full flex items-center justify-end gap-3 px-2">
                    {/* min-speaker */}
                    <Select>
                      <SelectTrigger className="px-2">
                        <SelectValue placeholder="Min Speaker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">At least 1</SelectItem>
                          <SelectItem value="2">2 People</SelectItem>
                          <SelectItem value="3">3 People</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {/* max-speaker */}
                    <Select>
                      <SelectTrigger className="px-2">
                        <SelectValue placeholder="Max Speaker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="2">2 People</SelectItem>
                          <SelectItem value="3">3 People</SelectItem>
                          <SelectItem value="4">4 People</SelectItem>
                          <SelectItem value="5">5 People</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <CardContent>
                    {formData.mediaFile.type.startsWith("video/") ? (
                      <video controls width="100%" className="rounded-xl">
                        <source src={preview} type={formData.mediaFile.type} />
                      </video>
                    ) : (
                      <audio controls style={{ width: "100%" }}>
                        <source src={preview} type={formData.mediaFile.type} />
                      </audio>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={getTranscript}
                    >
                      <BrainCog /> Generate Transcript
                    </Button>
                  </CardFooter>
                </Card>
              )
            )}
          </CardContent>

          <CardFooter>
            <Input
              id="hiddenInput"
              type="file"
              accept="video/*,audio/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <Button variant="outline" className="w-full " onClick={handleClick}>
              <CloudUpload /> Upload File
            </Button>
          </CardFooter>
        </Card>

        {/* Transcript Preview Card */}
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Transcript Preview
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isGenerated
                ? "Transcript generated successfully"
                : "Your transcript will appear here"}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 max-h-96 overflow-y-auto">
            {!isGenerated ? (
              <div className="flex items-center justify-center h-32 text-gray-400 italic">
                No file uploaded yet
              </div>
            ) : (
              <>
                <p>{transcript.transcriptText}</p>
              </>
            )}

            {analyzedData && (
              <div className="mt-4 p-3 border border-gray-700 rounded-lg">
                <h2 className="font-semibold text-lg">Analysis</h2>

                {/* Show interviewee feedback */}
                <div className="mt-2">
                  <h3 className="font-semibold">Interviewee Feedback</h3>
                  <p>
                    <strong>What went well:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {analyzedData.analysesText.interviewee_feedback.what_went_well.map(
                      (point, i) => (
                        <li key={i}>{point}</li>
                      )
                    )}
                  </ul>

                  <p className="mt-2">
                    <strong>What could improve:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {analyzedData.analysesText.interviewee_feedback.what_could_improve.map(
                      (point, i) => (
                        <li key={i}>{point}</li>
                      )
                    )}
                  </ul>
                </div>

                {/* Show recruiter feedback */}
                <div className="mt-4">
                  <h3 className="font-semibold">Recruiter Feedback</h3>
                  <p>
                    <strong>Areas missed:</strong>
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-300">
                    {analyzedData.analysesText.recruiter_feedback.areas_missed.map(
                      (point, i) => (
                        <li key={i}>{point}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>

          {isGenerated && (
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={getAnalyzedData}
              >
                <BrainCog /> Generate Analysis
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analyze;
