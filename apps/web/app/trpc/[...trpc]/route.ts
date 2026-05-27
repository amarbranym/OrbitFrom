import { NextRequest, NextResponse } from "next/server";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8000";

async function handleProxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Construct the target API URL
  // e.g., /trpc/auth.getSession -> http://localhost:8000/trpc/auth.getSession
  const targetUrl = `${API_INTERNAL_URL}${pathname}${search}`;

  // Clone headers from the incoming request
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Avoid overriding Host or Content-Length incorrectly
    if (key.toLowerCase() !== "host") {
      headers.set(key, value);
    }
  });

  // Read the body for POST requests
  let body: any = undefined;
  if (request.method === "POST") {
    body = await request.blob();
  }

  // Fetch from the backend API
  const apiResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  // Create the NextResponse object
  const responseHeaders = new Headers();
  
  // Copy all headers from the backend API response except potentially some server-specific headers
  apiResponse.headers.forEach((value, key) => {
    // We want to preserve Set-Cookie, Content-Type, etc.
    responseHeaders.append(key, value);
  });

  // Return the response with the backend's status, body and headers
  const response = new NextResponse(apiResponse.body, {
    status: apiResponse.status,
    statusText: apiResponse.statusText,
    headers: responseHeaders,
  });

  return response;
}

export async function GET(request: NextRequest) {
  return handleProxy(request);
}

export async function POST(request: NextRequest) {
  return handleProxy(request);
}

export async function OPTIONS(request: NextRequest) {
  return handleProxy(request);
}
