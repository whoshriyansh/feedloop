import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_S3_ACCESS_KEY,
  },
});

export async function POST(request) {
  const formData = await request.formData();
  console.log(formData);
  const file = formData.get("videoFile");

  if (!file) {
    return NextResponse.json(
      { success: false, message: "No file provided." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const params = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      Key: file.name || `upload-${Date.now()}`,
      Body: buffer,
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(params));

    return NextResponse.json(
      { success: true, message: "Upload successful" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
