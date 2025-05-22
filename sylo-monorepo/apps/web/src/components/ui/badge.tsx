"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

const badgeVariants = {
  default: "inline-flex items-center rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground",
  secondary: "inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground",
  destructive: "inline-flex items-center rounded-md bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground",
  outline: "inline-flex items-center rounded-md border border-input px-2 py-1 text-xs font-medium",
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants[variant], className)}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"