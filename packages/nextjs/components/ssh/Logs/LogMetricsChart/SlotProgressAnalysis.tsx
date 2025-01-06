import React, { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_MARGIN } from "~~/lib/helper";
import { ParsedLog } from "~~/types/ssh/lighthouse";

const parseTimestamp = (timestamp: string) => {
  const currentYear = new Date().getFullYear();
  return new Date(`${timestamp} ${currentYear}`).getTime();
};

// Normalize or deduplicate timestamps
const normalizeTimestamps = (data: any[]) => {
  const seenTimestamps = new Set();

  return data.map(entry => {
    let { timestamp } = entry;

    // Ensure uniqueness of timestamps
    while (seenTimestamps.has(timestamp)) {
      timestamp += 1; // Add 1ms offset for duplicates
    }
    seenTimestamps.add(timestamp);

    return { ...entry, timestamp };
  });
};

const SlotProgressAnalysis = React.memo(({ parsedLogs }: { parsedLogs: ParsedLog[] }) => {
  const slotData = useMemo(() => {
    const rawData = parsedLogs
      .filter(log => log.metadata?.our_head_slot && log.metadata?.their_head_slot)
      .map(log => ({
        timestamp: parseTimestamp(log.timestamp),
        our_slot: parseInt(log.metadata.our_head_slot || "0"),
        their_slot: parseInt(log.metadata.their_head_slot || "0"),
        slot_difference: Math.abs(
          parseInt(log.metadata.their_head_slot || "0") - parseInt(log.metadata.our_head_slot || "0"),
        ),
      }))
      .filter(entry => !Object.values(entry).some(val => isNaN(val)))
      .sort((a, b) => a.timestamp - b.timestamp);

    return normalizeTimestamps(rawData);
  }, [parsedLogs]);

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Slot Progress Analysis</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={slotData} margin={CHART_MARGIN}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              scale="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString()}
            />
            <YAxis domain={[10600000, 10800000]} />
            <Tooltip
              labelFormatter={timestamp => new Date(timestamp).toLocaleString()}
              formatter={value => [value, "Slots"]}
            />
            <Legend />
            <Line type="monotone" dataKey="our_slot" stroke="#36A2EB" name="Our Slot" />
            <Line type="monotone" dataKey="their_slot" stroke="#FF6384" name="Peer Slot" />
            <Line type="monotone" dataKey="slot_difference" stroke="#4BC0C0" name="Slot Difference" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

SlotProgressAnalysis.displayName = "SlotProgressAnalysis";

export default SlotProgressAnalysis;
