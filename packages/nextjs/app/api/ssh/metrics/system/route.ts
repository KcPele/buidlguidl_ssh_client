import { NextRequest, NextResponse } from "next/server";
import { connectionManager } from "~~/app/api/lib/connectionManager";

const OPTIMIZED_COMMANDS = {
  disk: "df -B1 / --output=size,used,avail,pcent | tail -n1",
  network: `
    iface=$(ip route show default | awk '/default/ {print $5}' | head -n1)
    rx_prev=$(cat /sys/class/net/$iface/statistics/rx_bytes)
    tx_prev=$(cat /sys/class/net/$iface/statistics/tx_bytes)
    sleep 1
    rx_curr=$(cat /sys/class/net/$iface/statistics/rx_bytes)
    tx_curr=$(cat /sys/class/net/$iface/statistics/tx_bytes)
    echo "$rx_curr $tx_curr $((rx_curr-rx_prev)) $((tx_curr-tx_prev))"
  `,
  processes: "ps --no-headers -eo state | sort | uniq -c",
  loadAvg: "cat /proc/loadavg",
  temps:
    "for f in /sys/class/thermal/thermal_zone*/; do echo \"$(cat $f/type) $(cat $f/temp)\"; done 2>/dev/null || echo 'NA NA'",
};

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("ssh_session")?.value;
    if (!sessionId) throw new Error("No active session");

    const conn = await connectionManager.getConnection(sessionId);

    const results = await Promise.all(
      Object.entries(OPTIMIZED_COMMANDS).map(
        ([key, cmd]) =>
          new Promise<[string, string]>((resolve, reject) => {
            conn.exec(cmd, (err, stream) => {
              if (err) reject(err);
              let output = "";
              stream.on("data", (data: Buffer) => {
                output += data.toString();
              });
              stream.on("close", () => resolve([key, output.trim()]));
              stream.on("error", reject);
            });
          }),
      ),
    );

    const metrics = Object.fromEntries(results);
    const [total, used, free] = metrics.disk.split(/\s+/).map(Number);
    const [totalRx, totalTx, rxSpeed, txSpeed] = metrics.network.split(/\s+/).map(Number);
    const processStates = new Map(
      metrics.processes
        .split("\n")
        .map(line => line.trim().split(/\s+/))
        .map(([count, state]) => [state, parseInt(count)]),
    );

    const [load1, load5, load15] = metrics.loadAvg.split(/\s+/).slice(0, 3).map(Number);
    const temperatures = Object.fromEntries(
      metrics.temps
        .split("\n")
        .filter(line => !line.includes("NA"))
        .map(line => {
          const [type, temp] = line.split(/\s+/);
          return [type, parseInt(temp) / 1000];
        }),
    );
    return NextResponse.json({
      timestamp: Date.now(),
      disk: {
        total: total / 1024 ** 3,
        used: used / 1024 ** 3,
        free: free / 1024 ** 3,
        //calculate percentage
        usagePercent: (used / total) * 100,
      },
      network: { rxSpeed, txSpeed, totalRx, totalTx },
      processes: {
        total: Array.from(processStates.values()).reduce((a, b) => a + b, 0),
        running: processStates.get("R") || 0,
        sleeping: processStates.get("S") || 0,
      },
      loadAverage: { "1min": load1, "5min": load5, "15min": load15 },
      temperatures,
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
