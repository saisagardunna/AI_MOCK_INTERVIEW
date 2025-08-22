"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">Enter your credentials to access InterviewAI</p>
        </div>
        <div suppressHydrationWarning>
          <SignIn
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2",
                card: "bg-background border-none shadow-none",
                formFieldInput: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}