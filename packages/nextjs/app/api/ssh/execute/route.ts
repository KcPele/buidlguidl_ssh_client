import { NextRequest, NextResponse } from "next/server";
import { connectionManager } from "../../lib/connectionManager";

interface ExecuteCommandRequest {
  command: string;
}
function parseErrorMessage(error: unknown): string {
  const errorString = String(error);

  // Check if it's a bash error
  if (errorString.includes("bash:")) {
    // Split by "bash:" and take the last meaningful error
    const parts = errorString.split("bash:");
    const lastPart = parts[parts.length - 1].trim();

    // Look for common command-not-found pattern
    if (lastPart.includes("Command '") && lastPart.includes("not found")) {
      return lastPart.trim();
    }

    // For other bash errors, remove common noise
    const cleanedError = lastPart
      .replace(/cannot set terminal process group.*?device/g, "")
      .replace(/no job control in this shell/g, "")
      .trim();

    return cleanedError || lastPart;
  }

  // For non-bash errors, return the original message
  return errorString;
}

export async function POST(req: NextRequest) {
  try {
    const { command } = (await req.json()) as ExecuteCommandRequest;
    const sessionId = req.cookies.get("ssh_session")?.value;
    if (!sessionId) {
      throw new Error("No active session login again");
    }

    const conn = await connectionManager.getConnection(sessionId);
    const wrappedCommand = `/bin/bash -i -c 'source ~/.bashrc 2>/dev/null; ${command}'`;
    const output = await new Promise<string>((resolve, reject) => {
      conn.exec(wrappedCommand, (err: any, stream: any) => {
        if (err) {
          reject(err);
          return;
        }

        let output = "";
        let errorOutput = "";

        stream.on("data", (data: Buffer) => {
          const str = data.toString();
          // console.log("Stream data:", str);
          output += str;
        });

        stream.stderr.on("data", (data: Buffer) => {
          const str = data.toString();
          // console.log("Stream error:", str);
          errorOutput += str;
        });

        stream.on("close", () => {
          // console.log("Stream closed. Output:", output, "Error:", errorOutput);
          if (command.includes("git clone") && errorOutput) {
            resolve(output + errorOutput);
          } else if (errorOutput && !output) {
            reject(new Error(errorOutput));
          } else {
            resolve(output || errorOutput);
          }
        });

        stream.on("error", (err: any) => {
          // console.error("Stream error event:", err);
          reject(err);
        });
      });
    });

    return NextResponse.json({ output });
    // Usage in your error handler:
  } catch (error) {
    const parsedMessage = parseErrorMessage(error);
    return NextResponse.json({ message: parsedMessage }, { status: 500 });
  }
}
