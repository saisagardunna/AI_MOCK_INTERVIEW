"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Code, Play } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const copyToClipboard = async (text: string) => {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
    } catch (error) {
      console.warn("Clipboard copy failed:", error);
    }
  } else {
    console.warn("Clipboard API not supported");
  }
};

export default function NewInterviewPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedType = searchParams.get("type");

  const [selectedType, setSelectedType] = useState(preselectedType || "frontend");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("intermediate");
  const [error, setError] = useState<string | null>(null);

  const interviewTypes = {
    frontend: {
      title: "Frontend Developer",
      description: "Focus on client-side technologies and user interfaces",
      topics: [
        "React",
        "Vue.js",
        "Angular",
        "JavaScript",
        "TypeScript",
        "CSS",
        "HTML",
        "Responsive Design",
        "Performance Optimization",
      ],
    },
    backend: {
      title: "Backend Developer",
      description: "Server-side development and API design",
      topics: [
        "Node.js",
        "Python",
        "Java",
        "APIs",
        "Databases",
        "Authentication",
        "Microservices",
        "Cloud Services",
        "Security",
      ],
    },
    fullstack: {
      title: "Full Stack Developer",
      description: "Both frontend and backend development",
      topics: [
        "React",
        "Node.js",
        "Databases",
        "APIs",
        "DevOps",
        "System Architecture",
        "Testing",
        "Security",
        "Performance",
      ],
    },
    "system-design": {
      title: "System Design",
      description: "Architecture and scalability discussions",
      topics: [
        "Scalability",
        "Load Balancing",
        "Databases",
        "Caching",
        "Microservices",
        "Message Queues",
        "CDN",
        "Monitoring",
        "Security",
      ],
    },
    behavioral: {
      title: "Behavioral Interview",
      description: "Soft skills and experience-based questions",
      topics: [
        "Leadership",
        "Teamwork",
        "Problem Solving",
        "Communication",
        "Conflict Resolution",
        "Time Management",
        "Adaptability",
        "Decision Making",
      ],
    },
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleStartInterview = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    if (selectedTopics.length === 0) {
      setError("Please select at least one topic");
      return;
    }

    try {
      setError(null);
      console.log("Sending request to /api/interview/create", {
        type: selectedType,
        topics: selectedTopics,
        difficulty,
      });
      const response = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          topics: selectedTopics,
          difficulty,
        }),
      });

      const data = await response.json();
      console.log("API response:", data, "Status:", response.status);

      if (!response.ok) {
        throw new Error(data.error || `Failed to create interview (Status: ${response.status})`);
      }

      const params = new URLSearchParams({
        type: selectedType,
        topics: selectedTopics.join(","),
        difficulty,
        interviewId: data.interviewId,
      });

      router.push(`/interview?${params.toString()}`);
    } catch (error: any) {
      console.error("Error creating interview:", error.message);
      setError(error.message || "Failed to create interview. Please try again.");
    }
  };

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>
          Please <Link href="/sign-in" className="underline">sign in</Link> to create a new interview.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 font-bold">
              <Code className="h-6 w-6" />
              <span>InterviewAI</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New Interview</h1>
            <p className="text-muted-foreground">Configure your mock interview session</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Interview Type</CardTitle>
                <CardDescription>Choose the type of interview you want to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedType} onValueChange={setSelectedType}>
                  {Object.entries(interviewTypes).map(([key, type]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <RadioGroupItem value={key} id={key} />
                      <Label htmlFor={key} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">{type.title}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Difficulty Level</CardTitle>
                <CardDescription>Select the difficulty level for your interview</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={difficulty} onValueChange={setDifficulty}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner" className="cursor-pointer">
                      <div>
                        <div className="font-medium">Beginner</div>
                        <div className="text-sm text-muted-foreground">Basic concepts and fundamentals</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="cursor-pointer">
                      <div>
                        <div className="font-medium">Intermediate</div>
                        <div className="text-sm text-muted-foreground">Practical application and problem-solving</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced" className="cursor-pointer">
                      <div>
                        <div className="font-medium">Advanced</div>
                        <div className="text-sm text-muted-foreground">Complex scenarios and optimization</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Topics</CardTitle>
              <CardDescription>
                Select the topics you want to focus on for{" "}
                {interviewTypes[selectedType as keyof typeof interviewTypes].title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {interviewTypes[selectedType as keyof typeof interviewTypes].topics.map((topic) => (
                  <div key={topic} className="flex items-center space-x-2">
                    <Checkbox
                      id={topic}
                      checked={selectedTopics.includes(topic)}
                      onCheckedChange={() => handleTopicToggle(topic)}
                    />
                    <Label htmlFor={topic} className="cursor-pointer">
                      {topic}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleStartInterview} disabled={selectedTopics.length === 0}>
              <Play className="mr-2 h-4 w-4" />
              Start Interview
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}