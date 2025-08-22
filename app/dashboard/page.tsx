"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, RefreshCw, Sparkles, Zap, Bell, Settings, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

interface FeedbackData {
  strengths: string[];
  improvements: string[];
  score: number;
  resources: { title: string; description: string }[];
  detailedAnalysis: string;
  questionScores: { question: string; answer: string; score: number; feedback: string }[];
}

interface Interview {
  id: string;
  title: string;
  type: string;
  topics: string[];
  difficulty: string;
  score: number | null;
  feedback: FeedbackData | null;
  duration: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const fetchInterviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("[DASHBOARD] Fetching interviews at", new Date().toISOString());
      const response = await fetch("/api/interview", { cache: "no-store" });
      console.log("[DASHBOARD] API response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers),
      });

      const text = await response.text();
      console.log("[DASHBOARD] Response body (truncated):", text.substring(0, 200));

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${text.substring(0, 50)}... (Check server logs)`);
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
      }

      console.log("[DASHBOARD] Received interviews:", data.interviews.length);
      setInterviews(data.interviews);
    } catch (err: any) {
      console.error("[DASHBOARD] Error fetching interviews:", err.message);
      setError(
        `Failed to load interviews: ${err.message}. Check server logs or try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const stats = [
    {
      title: "Total Interviews",
      value: interviews.length.toString(),
      change: "+10%",
      trend: "up",
      icon: Code,
      color: "from-green-400 to-emerald-600",
    },
    {
      title: "Average Score",
      value: interviews.length > 0
        ? `${Math.round(
            interviews.reduce((sum, i) => sum + (i.score || 0), 0) / interviews.length
          )}%`
        : "0%",
      change: "+5%",
      trend: "up",
      icon: Sparkles,
      color: "from-blue-400 to-cyan-600",
    },
    {
      title: "Total Questions",
      value: interviews.reduce((sum, i) => sum + (i.feedback?.questionScores.length || 0), 0).toString(),
      change: "+20%",
      trend: "up",
      icon: Zap,
      color: "from-purple-400 to-pink-600",
    },
    {
      title: "Topics Covered",
      value: new Set(interviews.flatMap(i => i.topics)).size.toString(),
      change: "+2",
      trend: "up",
      icon: Globe,
      color: "from-orange-400 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-8" variants={itemVariants}>
          <div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Interview Dashboard
            </motion.h1>
            <motion.p
              className="text-gray-400 mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Real-time insights into your mock interview performance
            </motion.p>
          </div>
          <motion.div className="flex items-center gap-4" variants={itemVariants}>
            <Link href="/interview/new">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Start New Interview
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => router.push("/sign-in")}
              >
                <Bell className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" variants={containerVariants}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
              onHoverStart={() => setActiveCard(index)}
              onHoverEnd={() => setActiveCard(null)}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white overflow-hidden relative">
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0`}
                  animate={{
                    opacity: activeCard === index ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                  <motion.div variants={pulseVariants} animate="animate">
                    <stat.icon className="h-4 w-4 text-gray-400" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-2xl font-bold"
                    key={stat.value}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.div>
                  <motion.p
                    className={`text-xs flex items-center gap-1 mt-1 ${
                      stat.trend === "up" ? "text-green-400" : "text-red-400"
                    }`}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.change} from last month
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Interview History */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Interview History
              </CardTitle>
              <CardDescription className="text-gray-400">Your past mock interviews and detailed feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <motion.div
                  className="bg-red-50 text-red-600 p-4 rounded-md flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span>{error}</span>
                  <Button variant="outline" size="sm" onClick={fetchInterviews}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </motion.div>
              )}
              {isLoading ? (
                <motion.div
                  className="flex items-center gap-2 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <p>Loading interview history...</p>
                </motion.div>
              ) : interviews.length === 0 ? (
                <motion.p
                  className="text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No interviews found. Start a new interview to begin!
                </motion.p>
              ) : (
                <AnimatePresence>
                  {interviews.map((interview, index) => (
                    <motion.div
                      key={interview.id}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex flex-col gap-2">
                        <p className="font-medium text-white">{interview.title}</p>
                        <p className="text-sm text-gray-400">
                          {interview.topics.join(", ")} • {interview.difficulty} • {new Date(interview.createdAt).toLocaleDateString()}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-blue-400">Type:</span>
                            <div className="font-medium">{interview.type}</div>
                          </div>
                          <div>
                            <span className="text-blue-400">Score:</span>
                            <div className="font-medium">{interview.score !== null ? `${interview.score}%` : "Not scored"}</div>
                          </div>
                          <div>
                            <span className="text-blue-400">Duration:</span>
                            <div className="font-medium">{interview.duration}</div>
                          </div>
                          <div>
                            <span className="text-blue-400">Questions:</span>
                            <div className="font-medium">{interview.feedback?.questionScores.length || 0}</div>
                          </div>
                        </div>
                        {interview.feedback && (
                          <div className="mt-2 space-y-2">
                            <h4 className="font-medium">Feedback Summary</h4>
                            <p className="text-sm">{interview.feedback.detailedAnalysis}</p>
                            <h4 className="font-medium">Strengths</h4>
                            <ul className="text-sm list-disc pl-5">
                              {interview.feedback.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                            <h4 className="font-medium">Areas for Improvement</h4>
                            <ul className="text-sm list-disc pl-5">
                              {interview.feedback.improvements.map((i, idx) => (
                                <li key={idx}>{i}</li>
                              ))}
                            </ul>
                            <h4 className="font-medium">Question-by-Question Analysis</h4>
                            <ul className="text-sm list-disc pl-5">
                              {interview.feedback.questionScores.map((q, i) => (
                                <li key={i}>
                                  Question {i + 1}: {q.question} (Score: {q.score}%) - {q.feedback}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Floating Action Button */}
        <motion.div className="fixed bottom-8 right-8" variants={floatingVariants} animate="animate">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl"
              onClick={() => router.push("/interview/new")}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              New Interview
            </Button>
          </motion.div>
        </motion.div>

        {/* Animated Counter */}
        <motion.div
          className="fixed top-8 right-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-lg px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            {counter}
          </Badge>
        </motion.div>
      </motion.div>
    </div>
  );
}