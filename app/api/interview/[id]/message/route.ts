import { NextResponse } from "next/server";
import { connectDB, Interview } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  console.log(`[API] GET /api/interviews at ${new Date().toISOString()}`);
  console.log("[API] Request headers:", Object.fromEntries(request.headers));

  try {
    // Verify Clerk authentication
    const { userId } = auth();
    console.log("[API] Clerk auth result - userId:", userId);

    if (!userId) {
      console.log("[API] Authentication failed: No userId provided");
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please sign in" },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to MongoDB
    console.log("[API] Attempting to connect to MongoDB");
    try {
      await connectDB();
      console.log("[API] Successfully connected to MongoDB");
    } catch (dbError: any) {
      console.error("[API] MongoDB connection error:", {
        message: dbError.message,
        stack: dbError.stack,
      });
      return NextResponse.json(
        { success: false, error: `Database connection failed: ${dbError.message}` },
        { status: 500, headers: { "Content-Type": "application/json" } }
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
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[API] Error in /api/interviews:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { success: false, error: `Failed to fetch interviews: ${error.message}` },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}