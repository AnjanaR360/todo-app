import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all tasks
export async function GET() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(todos);
}

// Add a new task
export async function POST(req: Request) {
  const data = await req.json();
  const todo = await prisma.todo.create({ data });
  return NextResponse.json(todo);
}
