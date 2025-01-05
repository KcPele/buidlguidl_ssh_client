import React, { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ParsedLog } from "~~/types/ssh/lighthouse";

const parseTimestamp = (timestamp: string) => {
  const currentYear = new Date().getFullYear();
  return new Date(`${timestamp} ${currentYear}`).getTime();
};

const SlotProgressAnalysis = React.memo(({ parsedLogs }: { parsedLogs: ParsedLog[] }) => {
  const slotData = useMemo(() => {
    return parsedLogs
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
  }, [parsedLogs]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Slot Progress Analysis</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={slotData}>
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
                formatter={value => [value, "Slots"]}
              />
              <Legend />
              <Line type="monotone" dataKey="our_slot" stroke="#36A2EB" name="Our Slot" dot={false} />
              <Line type="monotone" dataKey="their_slot" stroke="#FF6384" name="Peer Slot" dot={false} />
              <Line type="monotone" dataKey="slot_difference" stroke="#4BC0C0" name="Slot Difference" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

SlotProgressAnalysis.displayName = "SlotProgressAnalysis";

export default SlotProgressAnalysis;
