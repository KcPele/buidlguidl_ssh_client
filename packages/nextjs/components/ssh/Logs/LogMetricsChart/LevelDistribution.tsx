import React, { useMemo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ParsedLog } from "~~/types/ssh/lighthouse";

const COLORS = ["#36A2EB", "#FF6384", "#4BC0C0", "#FF9F40", "#9966FF"];

const LevelDistribution = React.memo(({ parsedLogs }: { parsedLogs: ParsedLog[] }) => {
  const levelData = useMemo(() => {
    const levelCounts = parsedLogs.reduce(
      (acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(levelCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [parsedLogs]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Log Level Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={levelData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={entry => `${entry.name} (${entry.value})`}
              >
                {levelData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={value => [value, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

LevelDistribution.displayName = "LevelDistribution";

export default LevelDistribution;
