import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

interface Params {
  params: {
    id: string;
    taskId: string;
    dependsOnTaskId: string;
  };
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id: projectId, taskId, dependsOnTaskId } = params;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}/dependencies/${dependsOnTaskId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Task dependency not found" }, { status: 404 });
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting task dependency:", error);
    return NextResponse.json(
      { error: "Failed to delete task dependency" },
      { status: 500 }
    );
  }
}