import React, { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ParsedLog } from "~~/types/ssh/lighthouse";

export const parseTimestamp = (timestamp: string) => {
  const currentYear = new Date().getFullYear();
  return new Date(`${timestamp} ${currentYear}`).getTime();
};

const TimingMetrics = React.memo(({ parsedLogs }: { parsedLogs: ParsedLog[] }) => {
  const timingData = useMemo(() => {
    return parsedLogs
      .filter(log => log.metadata?.total_delay_ms)
      .map(log => ({
        timestamp: parseTimestamp(log.timestamp),
        total_delay: parseInt(log.metadata?.total_delay_ms || "0"),
        execution_time: parseInt(log.metadata?.execution_time_ms || "0"),
        consensus_time: parseInt(log.metadata?.consensus_time_ms || "0"),
        attestable_delay: parseInt(log.metadata?.attestable_delay_ms || "0"),
        available_delay: parseInt(log.metadata?.available_delay_ms || "0"),
      }))
      .filter(entry => !Object.values(entry).some(val => isNaN(val)))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [parsedLogs]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Timing Metrics</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={["auto", "auto"]}
                tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip
                labelFormatter={timestamp => new Date(timestamp).toLocaleString()}
                formatter={value => [value, "ms"]}
              />
              <Legend />
              <Line type="monotone" dataKey="total_delay" stroke="#FF6384" name="Total Delay" dot={false} />
              <Line type="monotone" dataKey="execution_time" stroke="#36A2EB" name="Execution Time" dot={false} />
              <Line type="monotone" dataKey="consensus_time" stroke="#4BC0C0" name="Consensus Time" dot={false} />
              <Line type="monotone" dataKey="attestable_delay" stroke="#FF9F40" name="Attestable Delay" dot={false} />
              <Line type="monotone" dataKey="available_delay" stroke="#9966FF" name="Available Delay" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

TimingMetrics.displayName = "TimingMetrics";

export default TimingMetrics;
