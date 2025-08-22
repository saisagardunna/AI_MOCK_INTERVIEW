"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, ThumbsDown, ThumbsUp, X, Video, VideoOff, Mic, MicOff } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

// Declare SpeechRecognition types for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Message {
  role: "system" | "assistant" | "user";
  content: string;
  timestamp: Date;
  score?: number;
}

interface FeedbackData {
  strengths: string[];
  improvements: string[];
  score: number;
  resources: { title: string; description: string }[];
  detailedAnalysis: string;
  questionScores: { question: string; answer: string; score: number; feedback: string }[];
}

interface QuestionData {
  question: string;
  keywords: string[];
  expectedConcepts: string[];
  difficulty: number;
}

export default function InterviewPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const interviewId = searchParams.get("interviewId");
  const interviewType = searchParams.get("type") || "frontend";
  const topics = searchParams.get("topics")?.split(",") || ["React"];
  const difficulty = searchParams.get("difficulty") || "intermediate";

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: `Welcome to your ${interviewType} mock interview! I'll be asking you technical questions about ${topics.join(", ")} at ${difficulty} level. Let's get started!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<{ answer: string; score: number; feedback: string }[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isClientSide, setIsClientSide] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setIsClientSide(true);
    // Initialize SpeechRecognition
    if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognitionRef.current = new SpeechRecognitionConstructor();
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;
      speechRecognitionRef.current.lang = "en-US";

      speechRecognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInput(transcript);
      };

      speechRecognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsVoiceRecording(false);
        alert("Speech recognition failed. Please ensure microphone permissions are granted and you're using HTTPS.");
      };
    } else {
      console.warn("SpeechRecognition API is not supported in this browser.");
    }
  }, []);

  // Question bank (unchanged)
  const questionBank = {
    frontend: {
      beginner: [
        {
          question: "What is the difference between HTML, CSS, and JavaScript?",
          keywords: ["html", "structure", "css", "styling", "javascript", "behavior", "markup", "presentation", "logic"],
          expectedConcepts: ["HTML for structure", "CSS for styling", "JavaScript for behavior"],
          difficulty: 1,
        },
      ],
      intermediate: [
        {
          question: "Explain how React's virtual DOM works and its benefits.",
          keywords: ["virtual", "dom", "react", "reconciliation", "diff", "performance", "fiber", "rendering", "update"],
          expectedConcepts: ["Virtual DOM concept", "Reconciliation process", "Performance benefits"],
          difficulty: 3,
        },
      ],
      advanced: [
        {
          question: "How would you implement a custom React hook for data fetching with caching?",
          keywords: ["custom", "hook", "data", "fetching", "caching", "useeffect", "usestate", "usecallback", "usememo"],
          expectedConcepts: ["Custom hook patterns", "Caching strategies", "Dependency management"],
          difficulty: 5,
        },
      ],
    },
    backend: {
      beginner: [
        {
          question: "What is the difference between HTTP and HTTPS?",
          keywords: ["http", "https", "ssl", "tls", "encryption", "security", "certificate", "protocol"],
          expectedConcepts: ["Protocol differences", "Security features", "SSL/TLS"],
          difficulty: 1,
        },
      ],
      intermediate: [
        {
          question: "How would you design a RESTful API for a blog system?",
          keywords: ["rest", "api", "design", "resources", "endpoints", "blog", "posts", "users", "comments", "crud"],
          expectedConcepts: ["Resource modeling", "Endpoint design", "CRUD operations"],
          difficulty: 3,
        },
      ],
      advanced: [
        {
          question: "Design a distributed system for handling millions of requests per second.",
          keywords: ["distributed", "system", "scalability", "load", "balancing", "caching", "database", "sharding"],
          expectedConcepts: ["System architecture", "Scalability patterns", "Performance optimization"],
          difficulty: 5,
        },
      ],
    },
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  useEffect(() => {
    if (!userId || !interviewId) return;

    const questions =
      questionBank[interviewType as keyof typeof questionBank]?.[difficulty as keyof typeof questionBank.frontend] ||
      questionBank.frontend.intermediate;

    if (questions.length > 0) {
      const initialMessage: Message = {
        role: "assistant",
        content: questions[0].question,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, initialMessage]);

      // Save initial message via API
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          role: "assistant",
          content: questions[0].question,
          createdAt: new Date(),
        }),
      }).catch((error) => console.error("Error saving initial message:", error));
    }
  }, [interviewType, difficulty, interviewId, userId]);

  const copyToClipboard = async (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        console.log("Copied to clipboard:", text);
      } catch (error) {
        console.warn("Clipboard copy failed:", error);
        alert("Clipboard copy failed. Please ensure you're using HTTPS.");
      }
    } else {
      console.warn("Clipboard API not supported or not in a secure context.");
      alert("Clipboard copy is not supported. Please use HTTPS and a compatible browser (e.g., Chrome, Edge).");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const analyzeResponse = (userAnswer: string, questionData: QuestionData) => {
    const answer = userAnswer.toLowerCase();
    const wordCount = userAnswer.split(" ").length;

    const foundKeywords = questionData.keywords.filter((keyword) => answer.includes(keyword.toLowerCase()));
    const keywordScore = (foundKeywords.length / questionData.keywords.length) * 100;

    const foundConcepts = questionData.expectedConcepts.filter(
      (concept) =>
        answer.includes(concept.toLowerCase()) ||
        concept
          .toLowerCase()
          .split(" ")
          .some((word) => answer.includes(word))
    );
    const conceptScore = (foundConcepts.length / questionData.expectedConcepts.length) * 100;

    let lengthScore = 0;
    if (wordCount < 5) lengthScore = 10;
    else if (wordCount < 15) lengthScore = 30;
    else if (wordCount < 30) lengthScore = 50;
    else if (wordCount < 50) lengthScore = 70;
    else lengthScore = 85;

    const finalScore = Math.round(keywordScore * 0.4 + conceptScore * 0.4 + lengthScore * 0.2);

    let feedback = "";
    if (finalScore < 30) {
      feedback = "Your answer lacks key concepts and technical details. Try to include more specific information about the topic.";
    } else if (finalScore < 50) {
      feedback = "Your answer touches on some relevant points but could be more comprehensive. Consider explaining the concepts in more detail.";
    } else if (finalScore < 70) {
      feedback = "Good answer! You covered several important points. You could enhance it by discussing additional aspects or providing examples.";
    } else if (finalScore < 85) {
      feedback = "Excellent answer! You demonstrated good understanding of the topic with relevant details and concepts.";
    } else {
      feedback = "Outstanding answer! You provided comprehensive coverage of the topic with excellent technical depth.";
    }

    return { score: Math.max(0, Math.min(100, finalScore)), feedback, foundKeywords, foundConcepts };
  };

  const generateFollowUp = (userAnswer: string, currentQuestionData: QuestionData, analysis: any) => {
    const questions =
      questionBank[interviewType as keyof typeof questionBank]?.[difficulty as keyof typeof questionBank.frontend] ||
      questionBank.frontend.intermediate;

    const nextQuestionIndex = Math.min(currentQuestionIndex + 1, questions.length - 1);
    const nextQuestion = questions[nextQuestionIndex];

    if (analysis.score < 30) {
      return `I notice your answer could be more detailed and specific. ${analysis.feedback} Let me ask you another question: ${nextQuestion.question}`;
    } else if (analysis.score < 50) {
      return `${analysis.feedback} Let's continue with the next question: ${nextQuestion.question}`;
    } else if (analysis.score < 70) {
      return `${analysis.feedback} Moving on to our next topic: ${nextQuestion.question}`;
    } else {
      return `${analysis.feedback} Great! Let's proceed to the next question: ${nextQuestion.question}`;
    }
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || !userId || !interviewId) return;

    const userMessage: Message = { role: "user", content: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      // Save user message via API
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          role: "user",
          content: input,
          createdAt: new Date(),
        }),
      });

      const questions =
        questionBank[interviewType as keyof typeof questionBank]?.[difficulty as keyof typeof questionBank.frontend] ||
        questionBank.frontend.intermediate;

      const currentQuestionData = questions[currentQuestionIndex];

      const analysis = analyzeResponse(input, currentQuestionData);

      setUserResponses((prev) => [
        ...prev,
        {
          answer: input,
          score: analysis.score,
          feedback: analysis.feedback,
        },
      ]);

      let aiResponse = "";
      if (currentQuestionIndex < questions.length - 1) {
        aiResponse = generateFollowUp(input, currentQuestionData, analysis);
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        aiResponse = `${analysis.feedback} That concludes our interview. You can now request feedback to see your detailed performance analysis.`;
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        score: analysis.score,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Save AI response via API
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId,
          role: "assistant",
          content: aiResponse,
          createdAt: new Date(),
        }),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsThinking(false);
    }
  }, [input, currentQuestionIndex, interviewType, difficulty, userId, interviewId]);

  const toggleVideoRecording = async () => {
    if (!isClientSide || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("MediaDevices API is not supported or not in a secure context.");
      alert("Video recording is not supported. Please use HTTPS and a compatible browser (e.g., Chrome, Edge).");
      return;
    }

    if (!isVideoRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          await sendVideoToEmail(blob);
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        recordedChunksRef.current = chunks;
        setIsVideoRecording(true);
        console.log("Started video recording...");
      } catch (error) {
        console.error("Error starting video recording:", error);
        alert("Could not start video recording. Please check camera and microphone permissions and ensure HTTPS.");
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        setIsVideoRecording(false);
        console.log("Stopped video recording...");
      }
    }
  };

  const toggleVoiceRecording = () => {
    if (!isClientSide || !speechRecognitionRef.current) {
      console.warn("SpeechRecognition is not available.");
      alert("Voice input is not supported. Please use HTTPS and a compatible browser (e.g., Chrome, Edge).");
      return;
    }

    if (!isVoiceRecording) {
      try {
        speechRecognitionRef.current?.start();
        setIsVoiceRecording(true);
        console.log("Started voice recording...");
      } catch (error) {
        console.error("Error starting voice recording:", error);
        alert("Could not start voice recording. Please check microphone permissions and ensure HTTPS.");
      }
    } else {
      speechRecognitionRef.current?.stop();
      setIsVoiceRecording(false);
      console.log("Stopped voice recording...");
    }
  };

  const sendVideoToEmail = async (videoBlob: Blob) => {
    if (!isClientSide) return;

    try {
      const formData = new FormData();
      formData.append("video", videoBlob, `interview-${Date.now()}.webm`);
      formData.append("email", "saisagardunna04@gmail.com");
      formData.append("interviewType", interviewType);
      formData.append("topics", topics.join(", "));
      formData.append("duration", formatTime(timeElapsed));

      const response = await fetch("/api/interview/send-video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Video recording sent to saisagardunna04@gmail.com successfully!");
      } else {
        throw new Error("Failed to send video");
      }
    } catch (error) {
      console.error("Error sending video:", error);
      alert("Failed to send video to email. Please try again.");
    }
  };

  const handleExit = async () => {
    setIsTimerRunning(false);
    if (isVideoRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (isVoiceRecording && speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }

    // Ensure feedback is saved before exiting
    if (userResponses.length > 0 && !feedbackData) {
      await requestFeedback();
    }

    router.push("/dashboard");
  };

  const requestFeedback = async () => {
    setIsLoadingFeedback(true);
    setIsTimerRunning(false);

    try {
      const questions =
        questionBank[interviewType as keyof typeof questionBank]?.[difficulty as keyof typeof questionBank.frontend] ||
        questionBank.frontend.intermediate;

      const questionScores = userResponses.map((response, index) => ({
        question: questions[index]?.question || "Question not found",
        answer: response.answer,
        score: response.score,
        feedback: response.feedback,
      }));

      const averageScore =
        userResponses.length > 0
          ? Math.round(userResponses.reduce((sum, r) => sum + r.score, 0) / userResponses.length)
          : 0;

      const strengths = [];
      const improvements = [];

      const highScoreCount = userResponses.filter((r) => r.score >= 70).length;
      const lowScoreCount = userResponses.filter((r) => r.score < 50).length;
      const avgResponseLength = userResponses.reduce((sum, r) => sum + r.answer.length, 0) / userResponses.length || 0;

      if (highScoreCount > userResponses.length / 2) {
        strengths.push("Demonstrated strong technical knowledge in most areas");
      }
      if (avgResponseLength > 100) {
        strengths.push("Provided detailed and comprehensive answers");
      }
      if (userResponses.length >= 5) {
        strengths.push("Engaged actively throughout the interview process");
      }
      if (averageScore >= 70) {
        strengths.push("Showed good understanding of core concepts");
      }

      if (lowScoreCount > userResponses.length / 3) {
        improvements.push("Focus on understanding fundamental concepts more deeply");
      }
      if (avgResponseLength < 50) {
        improvements.push("Provide more detailed explanations with specific examples");
      }
      if (averageScore < 60) {
        improvements.push("Review key technical concepts and practice explaining them clearly");
      }
      if (userResponses.length < 3) {
        improvements.push("Engage more actively and provide more comprehensive responses");
      }

      const detailedFeedback: FeedbackData = {
        strengths: strengths.length > 0 ? strengths : ["Completed the interview session", "Showed willingness to participate"],
        improvements: improvements.length > 0 ? improvements : ["Continue practicing technical interviews", "Review fundamental concepts"],
        score: averageScore,
        detailedAnalysis: `Based on ${userResponses.length} responses with an average score of ${averageScore}%. Your performance varied across different topics, with ${highScoreCount} strong answers and ${lowScoreCount} areas needing improvement.`,
        questionScores,
        resources: [
          {
            title: `${interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview Mastery`,
            description: `Comprehensive preparation guide covering ${topics.join(", ")} with practice questions and detailed explanations`,
          },
          {
            title: "Technical Communication Skills",
            description: "Learn how to structure and articulate technical concepts clearly during interviews",
          },
        ],
      };

      // Save feedback via API
      await fetch(`/api/interview/${interviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback: JSON.stringify(detailedFeedback),
          score: averageScore,
          duration: formatTime(timeElapsed),
        }),
      });

      setFeedbackData(detailedFeedback);
      setShowFeedback(true);
    } catch (error) {
      console.error("Error generating feedback:", error);
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  if (!userId) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleExit}>
              <X className="h-4 w-4 mr-2" />
              Exit
            </Button>
            <div>
              <h1 className="text-lg font-semibold capitalize">{interviewType} Developer Interview</h1>
              <p className="text-sm text-muted-foreground">
                {topics.join(", ")} • {difficulty} • Question {currentQuestionIndex + 1}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isClientSide && (
              <Badge variant="outline" className={isVideoRecording ? "bg-blue-50 text-blue-600 border-blue-200" : ""}>
                <span className={`mr-1 ${isVideoRecording ? "animate-pulse" : ""}`}>●</span>
                {isVideoRecording ? "Recording Video" : "Video Off"}
              </Badge>
            )}
            {isClientSide && (
              <Badge variant="outline" className={isVoiceRecording ? "bg-green-50 text-green-600 border-green-200" : ""}>
                <span className={`mr-1 ${isVoiceRecording ? "animate-pulse" : ""}`}>●</span>
                {isVoiceRecording ? "Recording Voice" : "Voice Off"}
              </Badge>
            )}
            <Badge variant="outline">{formatTime(timeElapsed)}</Badge>
            <Button variant="outline" size="sm" onClick={requestFeedback} disabled={isLoadingFeedback}>
              {isLoadingFeedback ? "Analyzing..." : "Get Feedback"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-4 pb-20">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : message.role === "system"
                      ? "bg-muted text-muted-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                    {message.score !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        Score: {message.score}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">Analyzing your response...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showFeedback && feedbackData && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Comprehensive Interview Analysis</CardTitle>
                <CardDescription>Detailed performance breakdown for your {interviewType} interview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-green-600 flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {feedbackData.strengths.map((strength, index) => (
                        <li key={index} className="text-sm bg-green-50 p-3 rounded border-l-4 border-green-200">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-medium text-orange-600 flex items-center gap-2">
                      <ThumbsDown className="h-4 w-4" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {feedbackData.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm bg-orange-50 p-3 rounded border-l-4 border-orange-200">
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Overall Performance Score</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-full rounded-full bg-muted relative overflow-hidden">
                      <div
                        className="h-8 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-1000"
                        style={{ width: `${feedbackData.score}%` }}
                      />
                    </div>
                    <span className="font-bold text-3xl min-w-[80px]">{feedbackData.score}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{feedbackData.detailedAnalysis}</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Question-by-Question Analysis</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {feedbackData.questionScores.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Question {index + 1}</h4>
                          <Badge
                            variant={item.score >= 70 ? "default" : item.score >= 50 ? "secondary" : "destructive"}
                          >
                            {item.score}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.question}</p>
                        <p className="text-xs bg-gray-50 p-2 rounded">{item.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Recommended Learning Resources</h3>
                  <div className="grid gap-3">
                    {feedbackData.resources.map((resource, index) => (
                      <div key={index} className="rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                        <div className="font-medium text-sm">{resource.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{resource.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Interview Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Duration:</span>
                      <div className="font-medium">{formatTime(timeElapsed)}</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Questions:</span>
                      <div className="font-medium">{feedbackData.questionScores.length}</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Type:</span>
                      <div className="font-medium capitalize">{interviewType}</div>
                    </div>
                    <div>
                      <span className="text-blue-600">Level:</span>
                      <div className="font-medium capitalize">{difficulty}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(feedbackData))}>
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Copy Feedback
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Helpful
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowFeedback(false)}>
                    Continue Interview
                  </Button>
                  <Button onClick={handleExit}>End Interview</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>

      <div className="sticky bottom-0 border-t bg-background p-4">
        <div className="mx-auto flex max-w-4xl items-center gap-2">
          {isClientSide && (
            <Button
              variant="outline"
              size="icon"
              className={isVideoRecording ? "bg-blue-100 text-blue-500 dark:bg-blue-900/20" : ""}
              onClick={toggleVideoRecording}
              title="Toggle video recording - will be sent to saisagardunna04@gmail.com"
            >
              {isVideoRecording ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
          )}
          {isClientSide && (
            <Button
              variant="outline"
              size="icon"
              className={isVoiceRecording ? "bg-green-100 text-green-500 dark:bg-green-900/20" : ""}
              onClick={toggleVoiceRecording}
              title="Toggle voice input for answers"
            >
              {isVoiceRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or speak your answer..."
            className="min-h-10 flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim() || isThinking}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}