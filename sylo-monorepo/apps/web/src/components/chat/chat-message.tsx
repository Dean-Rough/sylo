import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg p-4",
        isUser
          ? "ml-auto bg-primary text-primary-foreground"
          : "bg-muted"
      )}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          {isUser ? (
            <>
              <AvatarImage src="/avatars/01.png" alt="@user" />
              <AvatarFallback>UN</AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="/avatars/ai.png" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="text-xs">
          {isUser ? "You" : "AI Assistant"}
        </div>
        <div className="text-xs text-muted-foreground/70">
          {formatTime(message.timestamp)}
        </div>
      </div>
      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
    </div>
  );
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}