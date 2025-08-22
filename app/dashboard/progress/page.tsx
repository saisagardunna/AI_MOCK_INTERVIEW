import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Code, TrendingUp, Target, Award } from "lucide-react"

export default function ProgressPage() {
  const skillProgress = [
    { skill: "React", current: 85, target: 90, improvement: "+15%" },
    { skill: "TypeScript", current: 78, target: 85, improvement: "+12%" },
    { skill: "System Design", current: 65, target: 80, improvement: "+25%" },
    { skill: "Node.js", current: 72, target: 85, improvement: "+18%" },
    { skill: "Problem Solving", current: 88, target: 95, improvement: "+8%" },
  ]

  const achievements = [
    { title: "First Interview", description: "Completed your first mock interview", earned: true },
    { title: "Week Streak", description: "Practiced for 7 consecutive days", earned: true },
    { title: "High Scorer", description: "Achieved 90% or higher in an interview", earned: true },
    { title: "Improvement Master", description: "Improved score by 20% or more", earned: false },
    { title: "Interview Expert", description: "Completed 50 interviews", earned: false },
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
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard/interviews">
              Interviews
            </Link>
            <Link
              className="text-sm font-medium hover:underline underline-offset-4 text-primary"
              href="/dashboard/progress"
            >
              Progress
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor your improvement and skill development</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+8 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3/5</div>
              <p className="text-xs text-muted-foreground">Unlocked</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Skill Progress</CardTitle>
              <CardDescription>Track your improvement in different areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillProgress.map((skill) => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge variant="outline" className="text-green-600">
                        {skill.improvement}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {skill.current}% / {skill.target}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${skill.current}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Unlock badges as you progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      achievement.earned
                        ? "bg-green-100 text-green-600 dark:bg-green-900/20"
                        : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                    }`}
                  >
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${achievement.earned ? "" : "text-muted-foreground"}`}>
                      {achievement.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Badge variant="outline" className="text-green-600">
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
