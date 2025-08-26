"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { BrainCog, CloudUpload } from "lucide-react";

const UploadCard = ({
  uploading,
  progress,
  isGenerated,
  formData,
  preview,
  transcript,
  onGenerateTranscript,
  onUploadClick,
  onFileChange,
}) => {
  return (
    <Card className="w-full md:w-1/2 ">
      <CardHeader>
        <CardTitle>Upload Your Media</CardTitle>
        <CardDescription>Supports MP4 / MP3 / WAV formats</CardDescription>
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
          <Card className="overflow-y-auto max-h-1/2">
            <div>
              {formData.mediaFile?.type?.startsWith("video/") ? (
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
            <Card>
              <CardContent className="overflow-y-auto">
                {formData.mediaFile?.type?.startsWith("video/") ? (
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
                  onClick={onGenerateTranscript}
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
          onChange={onFileChange}
        />

        <Button variant="outline" className="w-full " onClick={onUploadClick}>
          <CloudUpload /> Upload File
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UploadCard;
