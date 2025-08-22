import { NextResponse } from "next/server";
import { connectDB, Interview } from "@/lib/db";

export async function GET(request: Request) {
  console.log(`[API] GET /api/interviews at ${new Date().toISOString()}`);
  console.log("[API] Route handler executed");

  try {
    // Hardcode userId from test-mongo-and-api.js
    const userId = "user_2zSeFf0zY5Ogk6M5FnWd9BFjZVN";
    console.log("[API] Using userId:", userId);

    if (!userId) {
      console.log("[API] No userId provided");
      return NextResponse.json(
        { success: false, error: "Unauthorized: No user ID" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    console.log("[API] Attempting MongoDB connection");
    try {
      await connectDB();
      console.log("[API] MongoDB connected");
    } catch (dbError: any) {
      console.error("[API] MongoDB error:", {
        message: dbError.message,
        stack: dbError.stack,
      });
      return NextResponse.json(
        { success: false, error: `Database connection failed: ${dbError.message}` },
        { status: 500 }
      );
    }

    // Fetch interviews
    console.log(`[API] Fetching interviews for userId: ${userId}`);
    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
    console.log(`[API] Fetched ${interviews.length} interviews`);

    return NextResponse.json(
      {
        success: true,
        interviews: interviews.map((interview) => ({
          id: interview._id.toString(),
          title: interview.title,
          type: interview.type,
          topics: interview.topics,
          difficulty: interview.difficulty,
          score: interview.score || null,
          feedback: interview.feedback ? JSON.parse(interview.feedback) : null,
          duration: interview.duration || "00:00",
          createdAt: interview.createdAt.toISOString(),
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API] Error in /api/interviews:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { success: false, error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}