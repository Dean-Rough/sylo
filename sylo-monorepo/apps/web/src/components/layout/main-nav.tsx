import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 flex items-center space-x-2">
      <Link href="/" className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        <span className="hidden font-bold sm:inline-block">Sylo</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/chat"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/chat") ? "text-foreground" : "text-foreground/60"
          )}
        >
          Chat
        </Link>
        <Link
          href="/prompts"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/prompts") ? "text-foreground" : "text-foreground/60"
          )}
        >
          Prompts
        </Link>
        <Link
          href="/settings"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/settings") ? "text-foreground" : "text-foreground/60"
          )}
        >
          Settings
        </Link>
      </nav>
    </div>
  );
}