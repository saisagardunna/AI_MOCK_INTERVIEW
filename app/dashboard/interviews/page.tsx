import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Code, Plus } from "lucide-react"

export default function InterviewsPage() {
  const interviews = [
    {
      id: 1,
      title: "Frontend Developer Interview",
      type: "Frontend",
      topics: ["React", "TypeScript", "CSS"],
      score: 85,
      date: "2 days ago",
      duration: "45 min",
      status: "completed",
    },
    {
      id: 2,
      title: "System Design Interview",
      type: "System Design",
      topics: ["Architecture", "Scalability", "Database Design"],
      score: 72,
      date: "5 days ago",
      duration: "60 min",
      status: "completed",
    },
    {
      id: 3,
      title: "Backend Developer Interview",
      type: "Backend",
      topics: ["Node.js", "APIs", "Database"],
      score: 88,
      date: "1 week ago",
      duration: "50 min",
      status: "completed",
    },
    {
      id: 4,
      title: "Behavioral Interview",
      type: "Behavioral",
      topics: ["Leadership", "Teamwork", "Problem-solving"],
      score: 90,
      date: "1 week ago",
      duration: "30 min",
      status: "completed",
    },
  ]

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
          <nav className="hidden md:flex gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
              Dashboard
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4 text-primary"
              href="/dashboard/interviews"
            >
              Interviews
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard/progress">
              Progress
            </Link>
          </nav>
          <Link href="/interview/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Interview
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Interview History</h1>
            <p className="text-muted-foreground">Review your past interview sessions and performance</p>
          </div>
        </div>
        <div className="grid gap-4">
          {interviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{interview.title}</CardTitle>
                    <CardDescription>{interview.topics.join(", ")}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-lg font-semibold">
                      {interview.score}%
                    </Badge>
                    <Badge variant={interview.status === "completed" ? "default" : "secondary"}>
                      {interview.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {interview.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {interview.duration}
                    </div>
                    <Badge variant="outline">{interview.type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Retake
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
