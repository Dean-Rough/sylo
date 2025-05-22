"use client";

import { Metadata } from "next";
import { WhiteboardInterface } from "@/components/whiteboard/whiteboard-interface";

export const metadata = {
  title: "Whiteboard - Sylo",
  description: "Quick notes and whiteboard for ideation",
};

export default function WhiteboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Whiteboard & Notes</h1>
          <p className="text-muted-foreground">
            Capture ideas, create notes, and organize your thoughts
          </p>
        </div>
      </div>
      <WhiteboardInterface />
    </div>
  );
}