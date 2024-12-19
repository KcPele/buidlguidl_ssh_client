import { NextRequest, NextResponse } from "next/server";
import { connectionManager } from "../../lib/connectionManager";

interface ExecuteCommandRequest {
  command: string;
}

export async function POST(req: NextRequest) {
  try {
    const { command } = (await req.json()) as ExecuteCommandRequest;
    const sessionId = req.cookies.get("ssh_session")?.value;
    if (!sessionId) {
      throw new Error("No active session");
    }
    const conn = await connectionManager.getConnection(sessionId);

    const output = await new Promise<string>((resolve, reject) => {
      conn.exec(command, (err: any, stream: any) => {
        if (err) {
          reject(err);
          return;
        }

        let output = "";
        stream.on("data", (data: Buffer) => {
          output += data.toString();
        });

        stream.on("close", () => {
          resolve(output);
        });

        stream.on("error", (err: any) => {
          reject(err);
        });
      });
    });

    return NextResponse.json({ output });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Command execution failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
