import { Metadata } from "next";
import { ChatInterface } from "@/components/chat/chat-interface";

export const metadata: Metadata = {
  title: "Chat - Sylo",
  description: "Chat with your AI assistant",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat</h1>
          <p className="text-muted-foreground">
            Chat with your AI assistant to get help with tasks
          </p>
        </div>
      </div>
      <ChatInterface />
    </div>
  );
}