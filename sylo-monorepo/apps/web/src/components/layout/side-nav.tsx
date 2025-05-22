"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Settings,
  Lightbulb,
  Calendar,
  CheckSquare,
  Users,
  Globe
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SideNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

const sidebarNavItems: SideNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Prompts",
    href: "/prompts",
    icon: FileText,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: CheckSquare,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Workspace",
    href: "/workspace",
    icon: Globe,
  },
  {
    title: "Team",
    href: "/team",
    icon: Users,
    disabled: true,
  },
  {
    title: "Ideas",
    href: "/ideas",
    icon: Lightbulb,
    disabled: true,
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2 px-2 py-4">
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.disabled ? "#" : item.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "transparent hover:bg-accent hover:text-accent-foreground",
            item.disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.title}</span>
          {item.disabled && (
            <span className="ml-auto text-xs text-muted-foreground">Soon</span>
          )}
        </Link>
      ))}
    </nav>
  );
}