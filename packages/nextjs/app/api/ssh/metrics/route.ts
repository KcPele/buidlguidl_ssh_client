// app/api/ssh/metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connections } from "../connect/route";
import { Stream } from "stream";

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
    const [cpuOutput, memoryOutput, uptimeOutput] = await Promise.all([
      // Get CPU usage
      new Promise<string>((resolve, reject) => {
        conn.exec(
          "top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'",
          (err: any, stream: Stream) => {
            if (err) {
              reject(err);
              return;
            }

            let output = "";
            stream.on("data", (data: Buffer) => {
              output += data.toString();
            });
            stream.on("close", () => resolve(output.trim()));
            stream.on("error", reject);
          },
        );
      }),
      // Get memory usage
      new Promise<string>((resolve, reject) => {
        conn.exec("free | grep Mem | awk '{print $3/$2 * 100.0}'", (err: any, stream: Stream) => {
          if (err) {
            reject(err);
            return;
          }

          let output = "";
          stream.on("data", (data: Buffer) => {
            output += data.toString();
          });
          stream.on("close", () => resolve(output.trim()));
          stream.on("error", reject);
        });
      }),
      // Get uptime
      new Promise<string>((resolve, reject) => {
        conn.exec("cat /proc/uptime | awk '{print $1}'", (err: any, stream: Stream) => {
          if (err) {
            reject(err);
            return;
          }

          let output = "";
          stream.on("data", (data: Buffer) => {
            output += data.toString();
          });
          stream.on("close", () => resolve(output.trim()));
          stream.on("error", reject);
        });
      }),
    ]);

    return NextResponse.json({
      timestamp: Date.now(),
      cpu: parseFloat(cpuOutput),
      memory: parseFloat(memoryOutput),
      uptime: parseFloat(uptimeOutput),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch metrics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
