"use client"

import { useState } from "react"
import { QueueXLogo } from "@/components/queuex-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, adminLogin } from "@/lib/store"
import { GraduationCap, Lock, ArrowRight } from "lucide-react"

export function LoginPage() {
  const [collegeId, setCollegeId] = useState("")
  const [password, setPassword] = useState("")

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (collegeId.trim() && password.trim()) {
      login(collegeId)
    }
  }

  return (
    <div className="gradient-bg flex min-h-screen items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="glass-strong relative w-full max-w-md rounded-2xl p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center gap-4">
          <QueueXLogo size="lg" />
          <p className="text-lg text-muted-foreground">Skip the Queue. Eat Smart.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="college-id" className="text-sm font-medium text-foreground">
              College ID
            </Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="college-id"
                placeholder="Enter your College ID"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                className="h-12 rounded-xl border-border bg-secondary/50 pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="password"
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-border bg-secondary/50 pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="gradient-primary mt-2 h-12 rounded-xl text-base font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
          >
            Sign In as Student
            <ArrowRight className="ml-2" size={18} />
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          variant="outline"
          onClick={adminLogin}
          className="mt-4 h-12 w-full rounded-xl border-border bg-secondary/30 text-sm font-medium text-foreground transition-all hover:bg-secondary"
        >
          Sign In as Admin
        </Button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Smart Canteen Management System
        </p>
      </div>
    </div>
  )
}
