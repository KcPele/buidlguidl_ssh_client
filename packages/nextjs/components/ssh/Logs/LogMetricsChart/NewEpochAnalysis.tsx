import React, { useMemo } from "react";
import { parseTimestamp } from "./TimingMetrics";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_MARGIN } from "~~/lib/helper";
import { ParsedLog } from "~~/types/ssh/lighthouse";

const NewEpochAnalysis = React.memo(({ parsedLogs }: { parsedLogs: ParsedLog[] }) => {
  const epochData = useMemo(() => {
    return parsedLogs
      .filter(log => log.metadata?.our_finalized_epoch && log.metadata?.their_finalized_epoch)
      .map(log => ({
        timestamp: parseTimestamp(log.timestamp), // Using raw timestamp for now
        our_epoch: parseInt(log.metadata.our_finalized_epoch || "0"),
        their_epoch: parseInt(log.metadata.their_finalized_epoch || "0"),
        epoch_difference: Math.abs(
          parseInt(log.metadata.their_finalized_epoch || "0") - parseInt(log.metadata.our_finalized_epoch || "0"),
        ),
      }))
      .filter(entry => !Object.values(entry).some(val => isNaN(val)))
      .sort((a, b) => a.our_epoch - b.our_epoch); // Sort by epoch instead of timestamp
  }, [parsedLogs]);
  if (epochData.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Epoch Synchronization</h3>
          <p>No epoch data available</p>
        </div>
      </div>
    );
  }
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
  };

  return (
    <div className="w-full bg-base-100 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Epoch Synchronization</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={epochData} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              scale="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatTimestamp}
            />
            <YAxis domain={[330000, 340000]} />
            <Tooltip formatter={(value, name) => [value, name]} labelFormatter={formatTimestamp} />
            <Legend />
            <Line type="monotone" dataKey="our_epoch" stroke="#36A2EB" name="Our Epoch" />
            <Line type="monotone" dataKey="their_epoch" stroke="#FF6384" name="Peer Epoch" />
            <Line type="monotone" dataKey="epoch_difference" stroke="#4BC0C0" name="Epoch Difference" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

NewEpochAnalysis.displayName = "NewEpochAnalysis";

export default NewEpochAnalysis;
