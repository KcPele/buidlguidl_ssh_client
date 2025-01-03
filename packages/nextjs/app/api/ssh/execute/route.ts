import { NextRequest, NextResponse } from "next/server";
import { connectionManager } from "../../lib/connectionManager";

interface ExecuteCommandRequest {
  command: string;
}

export async function POST(req: NextRequest) {
  try {
    const { command } = (await req.json()) as ExecuteCommandRequest;
    console.log("Original command:", command);

    const sessionId = req.cookies.get("ssh_session")?.value;
    if (!sessionId) {
      throw new Error("No active session");
    }

    const conn = await connectionManager.getConnection(sessionId);

    const wrappedCommand = `/bin/bash -i -c 'source ~/.bashrc 2>/dev/null; ${command}'`;
    console.log("Wrapped command:", wrappedCommand);

    const output = await new Promise<string>((resolve, reject) => {
      conn.exec(wrappedCommand, (err: any, stream: any) => {
        if (err) {
          console.error("SSH execution error:", err);
          reject(err);
          return;
        }

        let output = "";
        let errorOutput = "";

        stream.on("data", (data: Buffer) => {
          const str = data.toString();
          console.log("Stream data:", str);
          output += str;
        });

        stream.stderr.on("data", (data: Buffer) => {
          const str = data.toString();
          console.log("Stream error:", str);
          errorOutput += str;
        });

        stream.on("close", () => {
          console.log("Stream closed. Output:", output, "Error:", errorOutput);
          if (command.includes("git clone") && errorOutput) {
            resolve(output + errorOutput);
          } else if (errorOutput && !output) {
            reject(new Error(errorOutput));
          } else {
            resolve(output || errorOutput);
          }
        });

        stream.on("error", (err: any) => {
          console.error("Stream error event:", err);
          reject(err);
        });
      });
    });

    console.log("Final output:", output);
    return NextResponse.json({ output });
  } catch (error) {
    console.error("Command execution error:", error);
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
