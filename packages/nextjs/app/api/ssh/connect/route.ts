import { NextRequest, NextResponse } from "next/server";
import { Client } from "ssh2";
import { v4 as uuidv4 } from "uuid";

export const connections = new Map<string, Client>();

export async function POST(req: NextRequest) {
  try {
    const { host, username, password, port } = await req.json();

    // Validate input
    if (!host || !username || !password) {
      return NextResponse.json({ error: "Missing required connection parameters" }, { status: 400 });
    }
    const conn = new Client();
    const sessionId = uuidv4();

    await new Promise<void>((resolve, reject) => {
      conn
        .on("ready", () => {
          connections.set(sessionId, conn);
          resolve();
        })
        .on("error", err => {
          reject(err);
        })
        .connect({
          host,
          port,
          username,
          password,
        });
    });

    // Set session cookie
    const apiResponse = NextResponse.json({
      success: true,
      sessionId: sessionId,
    });

    apiResponse.cookies.set("ssh_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return apiResponse;
  } catch (error) {
    console.error("SSH connection error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Connection failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
