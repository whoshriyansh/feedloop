"use client";

import React, { useState } from "react";
import axios from "axios";
import Header from "@/components/app/Header";
import UploadCard from "@/components/app/UploadCard";
import AnalysisCard from "@/components/app/AnalysisCard";

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
      <Header />
      {/* Cards Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 container mx-auto">
        {/* Upload Card */}

        <UploadCard
          formData={formData}
          preview={preview}
          uploading={uploading}
          progress={progress}
          isGenerated={isGenerated}
          transcript={transcript}
          onGenerateTranscript={getTranscript}
          onUploadClick={handleClick}
          onFileChange={handleFileChange}
        />

        {isGenerated && (
          <AnalysisCard
            isGenerated={isGenerated}
            transcript={transcript}
            analyzedData={analyzedData}
            getAnalyzedData={getAnalyzedData}
          />
        )}
      </div>
    </div>
  );
};

export default Analyze;
