import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  console.log("[API] POST /api/interview/send video at", new Date().toISOString());

  try {
    const formData = await request.formData();
    const video = formData.get("video") as File | null;
    const email = formData.get("email") as string | null;

    if (!video || !email) {
      console.log("[API] Missing video or email");
      return NextResponse.json(
        { success: false, error: "Video and email are required" },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log("[API] Missing email configuration");
      return NextResponse.json(
        { success: false, error: "Email configuration missing" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify SMTP connection
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error("[API] SMTP verification failed:", error.message);
          reject(error);
        } else {
          console.log("[API] SMTP connection verified");
          resolve(success);
        }
      });
    });

    const videoBuffer = Buffer.from(await video.arrayBuffer());

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Mock Interview Video",
      text: "Attached is your mock interview video.",
      attachments: [
        {
          filename: `interview-${Date.now()}.mp4`,
          content: videoBuffer,
          contentType: video.type,
        },
      ],
    };

    console.log("[API] Sending email to", email);
    await transporter.sendMail(mailOptions);
    console.log("[API] Email sent successfully");

    return NextResponse.json(
      { success: true, message: "Video sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API] Error sending video:", error.message);
    return NextResponse.json(
      { success: false, error: `Failed to send video: ${error.message}` },
      { status: 500 }
    );
  }
}