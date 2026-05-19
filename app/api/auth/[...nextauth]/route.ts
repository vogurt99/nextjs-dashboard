import { handlers } from "@/auth";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
): Promise<Response> {
  return handlers.GET(request) as Promise<Response>;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
): Promise<Response> {
  return handlers.POST(request) as Promise<Response>;
}