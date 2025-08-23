"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";
import { Progress } from "../ui/progress";

const Uploadform = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);

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

  return (
    <>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Upload your Video or Audio</CardTitle>
          <CardDescription>Format allowed are mp4a</CardDescription>
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

          {preview && !uploading ? (
            <Card className="px-2 py-2">
              {file.type.startsWith("video/") ? (
                <video controls width="100%" className="rounded-xl">
                  <source src={preview} type={file.type} />
                </video>
              ) : (
                <audio controls style={{ width: "100%" }}>
                  <source src={preview} type={file.type} />
                </audio>
              )}
            </Card>
          ) : (
            <CardDescription>No File is Selected</CardDescription>
          )}
        </CardContent>

        <CardFooter className="w-full">
          <input
            id="hiddenInput"
            type="file"
            accept="video/*,audio/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <Button onClick={handleClick} className="w-full">
            <Upload /> <span>Upload your File</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Uploadform;
