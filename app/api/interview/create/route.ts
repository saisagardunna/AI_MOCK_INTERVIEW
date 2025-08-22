import { NextResponse } from "next/server";
import { connectDB, Interview } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    console.log("Received request to create interview");

    const { userId } = auth();
    console.log("User ID from Clerk:", userId);
    if (!userId) {
      console.log("Authentication failed: No userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, topics, difficulty } = await request.json();
    console.log("Request body:", { type, topics, difficulty });

    if (!type || !topics || !Array.isArray(topics) || topics.length === 0) {
      console.log("Validation failed: Missing or invalid fields");
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    console.log("Attempting to connect to MongoDB");
    await connectDB();
    console.log("Connected to MongoDB");

    const interviewTypes = {
      frontend: { title: "Frontend Developer" },
      backend: { title: "Backend Developer" },
      fullstack: { title: "Full Stack Developer" },
      "system-design": { title: "System Design" },
      behavioral: { title: "Behavioral Interview" },
    };

    if (!interviewTypes[type as keyof typeof interviewTypes]) {
      console.log("Validation failed: Invalid interview type");
      return NextResponse.json({ error: "Invalid interview type" }, { status: 400 });
    }

    const interview = new Interview({
      userId,
      title: `${interviewTypes[type as keyof typeof interviewTypes].title} Interview`,
      type,
      topics,
      difficulty,
    });

    console.log("Saving interview:", JSON.stringify(interview, null, 2));
    await interview.save();
    console.log("Interview saved successfully");

    return NextResponse.json({
      success: true,
      interviewId: interview._id.toString(),
    });
  } catch (error: any) {
    console.error("Error creating interview:", error.message, error.stack);
    return NextResponse.json({ error: `Failed to create interview: ${error.message}` }, { status: 500 });
  }
}