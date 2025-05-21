import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

interface Params {
  params: {
    id: string;
    taskId: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id: projectId, taskId } = params;
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}/dependencies`, {
      headers: {
        "Authorization": `Bearer ${session.accessToken}`,
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching task dependencies:", error);
    return NextResponse.json(
      { error: "Failed to fetch task dependencies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id: projectId, taskId } = params;
    const body = await request.json();
    
    // Ensure the task_id is set to the current task
    const dependencyData = {
      ...body,
      task_id: taskId,
    };
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks/${taskId}/dependencies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(dependencyData),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating task dependency:", error);
    return NextResponse.json(
      { error: "Failed to create task dependency" },
      { status: 500 }
    );
  }
}