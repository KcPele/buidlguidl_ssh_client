import { NextRequest, NextResponse } from "next/server";
import { connectionManager } from "~~/app/api/lib/connectionManager";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("ssh_session")?.value;
    if (!sessionId) {
      throw new Error("No active session");
    }
    // Get the directory from query parameters, with a default value
    const { searchParams } = new URL(req.url);
    const directory = searchParams.get("directory") || "~/buidlguidl-client";

    const conn = await connectionManager.getConnection(sessionId);
    console.log("directory", directory);
    const logPath = directory + "/ethereum_clients/reth/logs";
    const command = `
    tail -n 50 $(ls -t ${logPath}/reth_*.log | head -n 1)
  `;

    const output = await new Promise<string>((resolve, reject) => {
      conn.exec(command, (err, stream) => {
        if (err) {
          console.error("SSH command error:", err);
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
          console.error("Stream error:", err);
          reject(err);
        });
      });
    });
    const logs = output.split("\n").filter(line => line.trim()); // Remove empty lines

    return NextResponse.json({
      logs: Array.isArray(logs) ? logs : [],
    });
  } catch (error) {
    console.error("Log fetching error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch logs",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
