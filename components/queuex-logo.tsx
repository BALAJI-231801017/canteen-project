"use client"

import { Zap } from "lucide-react"

export function QueueXLogo({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizes = {
    sm: { icon: 18, text: "text-lg" },
    default: { icon: 24, text: "text-2xl" },
    lg: { icon: 36, text: "text-4xl" },
  }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-2">
      <div className="gradient-primary rounded-xl p-2 text-primary-foreground">
        <Zap size={s.icon} />
      </div>
      <span className={`${s.text} font-bold tracking-tight text-foreground`}>
        Queue<span className="text-primary">X</span>
      </span>
    </div>
  )
}
