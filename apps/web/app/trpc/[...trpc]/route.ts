import { NextRequest, NextResponse } from "next/server";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8000";

function parseSetCookie(cookieStr: string) {
  const parts = cookieStr.split(";").map((p) => p.trim());
  const [firstPart, ...restParts] = parts;
  if (!firstPart) return null;

  const index = firstPart.indexOf("=");
  if (index === -1) return null;

  const name = firstPart.slice(0, index);
  const value = firstPart.slice(index + 1);

  const options: any = {};

  for (const part of restParts) {
    const partLower = part.toLowerCase();
    if (partLower === "httponly") {
      options.httpOnly = true;
    } else if (partLower === "secure") {
      options.secure = true;
    } else if (partLower.startsWith("samesite=")) {
      const val = part.slice(9).toLowerCase();
      options.sameSite =
        val === "lax" || val === "strict" || val === "none" ? val : undefined;
    } else if (partLower.startsWith("path=")) {
      options.path = part.slice(5);
    } else if (partLower.startsWith("domain=")) {
      options.domain = part.slice(7);
    } else if (partLower.startsWith("max-age=")) {
      options.maxAge = parseInt(part.slice(8), 10);
    } else if (partLower.startsWith("expires=")) {
      options.expires = new Date(part.slice(8));
    }
  }

  return { name, value, options };
}

async function handleProxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Construct the target API URL
  const targetUrl = `${API_INTERNAL_URL}${pathname}${search}`;

  // Clone headers from the incoming request
  const headers = new Headers();
  request.headers.forEach((value, key) => {
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

  // Copy all headers from the backend API response except Set-Cookie
  apiResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      responseHeaders.append(key, value);
    }
  });

  // Return the response with the backend's status, body and headers
  const response = new NextResponse(apiResponse.body, {
    status: apiResponse.status,
    statusText: apiResponse.statusText,
    headers: responseHeaders,
  });

  // Extract Set-Cookie headers from the API response and set them in Next.js response.cookies
  // using getSetCookie() to support multiple cookies correctly.
  let setCookieHeaders: string[] = [];
  if (typeof apiResponse.headers.getSetCookie === "function") {
    setCookieHeaders = apiResponse.headers.getSetCookie();
  } else {
    const rawSetCookie = apiResponse.headers.get("set-cookie");
    if (rawSetCookie) {
      setCookieHeaders = [rawSetCookie];
    }
  }

  for (const cookieStr of setCookieHeaders) {
    const parsed = parseSetCookie(cookieStr);
    if (parsed) {
      response.cookies.set(parsed.name, parsed.value, parsed.options);
    }
  }

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
