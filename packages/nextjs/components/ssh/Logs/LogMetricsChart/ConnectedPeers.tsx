import React, { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_MARGIN } from "~~/lib/helper";
import { ParsedLog } from "~~/types/ssh/lighthouse";

const ConnectedPeers = ({ parsedLogs }: { parsedLogs: ParsedLog[] }) => {
  const peerMetrics = useMemo(() => {
    const rawMetrics = parsedLogs
      .filter(log => log.metadata?.peers && !isNaN(parseInt(log.metadata?.peers)))
      .map(log => ({
        timestamp: new Date(log.timestamp).getTime(), // Convert to numeric timestamp
        peers: parseInt(log.metadata?.peers || "0"),
      }));

    // Deduplicate by timestamp using a Set
    const seenTimestamps = new Set();
    const deduplicatedMetrics = rawMetrics.filter(entry => {
      if (seenTimestamps.has(entry.timestamp)) {
        return false;
      }
      seenTimestamps.add(entry.timestamp);
      return true;
    });

    return deduplicatedMetrics;
  }, [parsedLogs]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Connected Peers</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={peerMetrics} margin={CHART_MARGIN}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={timestamp => new Date(timestamp).toLocaleString()}
                formatter={(value, name) => [`${value}`, `${name}`]}
              />
              <Line type="monotone" dataKey="peers" stroke="#9966FF" name="Connected Peers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ConnectedPeers;
