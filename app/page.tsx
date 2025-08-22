import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, CheckCircle, Clock, Code } from "lucide-react";
import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold">
            <Code className="h-6 w-6" />
            <span>InterviewAI</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Features
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <SignOutButton>
                <Button>Sign Out</Button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Ace Your Next Tech Interview with AI
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Practice with our AI-powered mock interviews. Get real-time feedback and improve your skills.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-2">
                      Start Practicing
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button size="lg" variant="outline">
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden border bg-white dark:bg-gray-950 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">Mock Interview</div>
                      </div>
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <p className="text-sm font-medium">Interviewer AI:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Can you explain how React's virtual DOM works and why it's beneficial?
                          </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg shadow-sm self-end">
                          <p className="text-sm font-medium">You:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            The virtual DOM is a lightweight copy of the actual DOM...
                          </p>
                        </div>
                        <div className="mt-auto flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-titter sm:text-4xl md:text-5xl">Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to prepare for your technical interviews
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Role-specific Questions</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Practice with questions tailored to your target role and experience level.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Real-time Feedback</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Get instant feedback on your answers with suggestions for improvement.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Progress Tracking</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Monitor your improvement over time with detailed performance analytics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 font-bold">
              <Code className="h-6 w-6" />
              <span>InterviewAI</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI-powered mock interviews to help you land your dream job.
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                    Features
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                    About
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-between gap-4 border-t py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 InterviewAI. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link className="hover:underline" href="#">
              Terms of Service
            </Link>
            <Link className="hover:underline" href="#">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}