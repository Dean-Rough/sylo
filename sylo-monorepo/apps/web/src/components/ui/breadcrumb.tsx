"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {}

export function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex rounded-md bg-muted p-3", className)}
      {...props}
    />
  )
}

export interface BreadcrumbListProps extends React.HTMLAttributes<HTMLOListElement> {}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      role="list"
      className={cn("flex items-center space-x-2 overflow-x-auto", className)}
      {...props}
    />
  )
}

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      className={cn("flex items-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export function BreadcrumbLink({ className, href, ...props }: BreadcrumbLinkProps) {
  return (
    <Link
      href={href || "#"}
      className={cn(
        "hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function BreadcrumbSeparator({ className, ...props }: BreadcrumbSeparatorProps) {
  return (
    <span
      className={cn("select-none text-muted-foreground", className)}
      aria-hidden="true"
      {...props}
    >
      /
    </span>
  )
}