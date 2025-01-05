import React, { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ParsedLog } from "~~/types/ssh/lighthouse";

const parseTimestamp = (timestamp: string) => {
  const currentYear = new Date().getFullYear();
  const timestampWithYear = `${timestamp} ${currentYear}`;
  return new Date(timestampWithYear).getTime();
};

const NetworkHealthMetrics = React.memo(({ parsedLogs }: { parsedLogs: ParsedLog[] }) => {
  const deduplicateByTimestamp = (data: any) => {
    return data.filter((entry: any, index: any, array: any) => {
      return index === 0 || entry.timestamp !== array[index - 1].timestamp;
    });
  };
  const networkHealthData = useMemo(() => {
    const rawData = parsedLogs
      .filter(log => log.metadata?.peers || log.metadata?.target_peers)
      .map(log => ({
        timestamp: parseTimestamp(log.timestamp),
        current_peers: parseInt(log.metadata.peers || "0"),
        target_peers: parseInt(log.metadata.target_peers || "0"),
        peer_difference: parseInt(log.metadata.peers || "0") - parseInt(log.metadata.target_peers || "0"),
      }))
      .filter(entry => !Object.values(entry).some(val => isNaN(val)))
      .sort((a, b) => a.timestamp - b.timestamp);

    return deduplicateByTimestamp(rawData);
  }, [parsedLogs]);

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Network Health Metrics</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={networkHealthData.slice(0, 500)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              scale="time"
              type="number"
              domain={["dataMin - 1000", "dataMax + 1000"]}
              tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString()}
            />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip
              labelFormatter={timestamp => new Date(timestamp).toLocaleString()}
              formatter={(value, name) => [`${value}`, `${name}`]}
            />
            <Legend />
            <Line type="monotone" dataKey="current_peers" stroke="#36A2EB" name="Current Peers" />
            <Line type="monotone" dataKey="target_peers" stroke="#FF6384" name="Target Peers" />
            <Line type="monotone" dataKey="peer_difference" stroke="#4BC0C0" name="Peer Difference" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

NetworkHealthMetrics.displayName = "NetworkHealthMetrics";

export default NetworkHealthMetrics;
