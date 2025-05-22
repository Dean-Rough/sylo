"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
}

const alertVariants = {
  default: "relative w-full rounded border border-border bg-background p-4 text-primary-foreground",
  destructive:
    "relative w-full rounded border border-destructive bg-destructive/50 p-4 text-destructive-foreground",
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(alertVariants[variant], className)}
        {...props}
      />
    )
  }
)
Alert.displayName = "Alert"