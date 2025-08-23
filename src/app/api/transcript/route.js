/**
 * @desc    API route to upload video/audio -> S3 -> AssemblyAI -> Filter Data -> Save to MongoDB - Send Res to Client
 * @author  Shriyansh
 * @since   2025
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { AssemblyAI } from "assemblyai";
import FeedData from "@/lib/models/Feed.model";
import dbConnect from "@/lib/db/ConnectDb";
import { errorResponse, successResponse } from "@/lib/types/ApiResponse";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_S3_ACCESS_KEY,
  },
});

const client = new AssemblyAI({
  apiKey: process.env.NEXT_PUBLIC_ASSEMBLY_API_KEY,
});

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("mediaFile");
  const min_speaker = formData.get("min_speaker");
  const max_speaker = formData.get("max_speaker");

  if (!file) {
    return errorResponse(400, "No file provided");
  }

  try {
    await dbConnect();

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const fileName = file.name || `upload-${Date.now()}`;
    const params = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(params));

    // Construct file URL
    const url = `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileName}`;

    const contentType = file.type.startsWith("video") ? "video" : "audio";

    // Transcribe with AssemblyAI
    const transcript = await client.transcripts.transcribe({
      audio: url,
      speech_model: "universal",
      speaker_labels: true,
      speaker_options: {
        min_speakers_expected: parseInt(min_speaker),
        max_speakers_expected: parseInt(max_speaker),
      },
    });

    //Assembly AI has very big response array object
    //So, Filter the data before sending
    const clearedUtterances = (transcript.utterances || []).map((u) => ({
      speaker: u.speaker,
      text: u.text,
    }));

    // Save in MongoDB
    const newFeedData = await FeedData.create({
      url,
      contentType,
      transcriptText: transcript.text,
      utterances: clearedUtterances,
      analysesText: "",
    });

    return successResponse(
      201,
      "Upload + transcription successful",
      newFeedData
    );
  } catch (error) {
    return errorResponse(500, error.message, error);
  }
}
