import { NextRequest, NextResponse } from "next/server";
import { connections } from "../../connect/route";
import { parseLogLine } from "~~/app/api/utils";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("ssh_session")?.value;
    if (!sessionId) {
      throw new Error("No active session");
    }
    const conn = connections.get(sessionId);

    if (!conn) {
      throw new Error("No active connection");
    }
    const logPath = "~/Desktop/buidlguidl-client/ethereum_clients/lighthouse/logs";
    const command = `
    tail -n 50 $(ls -t ${logPath}/lighthouse_*.log | head -n 1)
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
    const parsedLogs = logs.map(line => parseLogLine(line)); //
    console.log(parsedLogs);
    return NextResponse.json({
      logs: Array.isArray(logs) ? logs : [],
      parsedLogs,
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
