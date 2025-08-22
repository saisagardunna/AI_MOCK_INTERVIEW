import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const interviewSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // String for Clerk userId
  title: { type: String, required: true },
  type: { type: String, required: true },
  topics: { type: [String], default: [] },
  difficulty: { type: String },
  score: { type: Number },
  feedback: { type: String },
  duration: { type: String }, // New field for duration
  createdAt: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview", required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Interview = mongoose.models.Interview || mongoose.model("Interview", interviewSchema);
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "interviewDB",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}