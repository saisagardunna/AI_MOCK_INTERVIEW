import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB, Interview, Message } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const interviewId = params.id;

    const conversationHistory = await Message.find({ interviewId })
      .sort({ createdAt: 1 })
      .exec();

    const interview = await Interview.findById(interviewId).exec();

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    if (interview.userId.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const conversationText = conversationHistory
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert technical interviewer evaluating a candidate's performance in a ${interview.type} interview about ${interview.topics.join(", ")}.
      
      Below is the interview conversation:
      
      ${conversationText}
      
      Provide detailed feedback on the candidate's performance with the following structure:
      1. Strengths (list 3-5 bullet points)
      2. Areas for Improvement (list 3-5 bullet points)
      3. Overall Score (a percentage between 0-100%)
      4. Suggested Resources (2-3 specific learning resources)
      
      Format your response as JSON:
      {
        "strengths": ["point1", "point2", ...],
        "improvements": ["point1", "point2", ...],
        "score": 85,
        "resources": [
          {"title": "Resource Title", "description": "Brief description"}
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const feedbackText = result.response.text();

    let feedback;
    try {
      feedback = JSON.parse(feedbackText);
    } catch (e) {
      console.error("Failed to parse feedback JSON:", e);
      return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
    }

    await Interview.findByIdAndUpdate(interviewId, {
      feedback: feedbackText,
      score: feedback.score,
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error generating feedback:", error);
    return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
  }
}