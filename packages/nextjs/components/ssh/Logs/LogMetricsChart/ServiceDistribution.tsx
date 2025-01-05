import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ParsedLog } from "~~/types/ssh/lighthouse";

const ServiceDistribution = React.memo(({ parsedLogs }: { parsedLogs: ParsedLog[] }) => {
  const serviceData = useMemo(() => {
    const serviceCounts = parsedLogs.reduce((acc: Record<string, number>, log) => {
      acc[log.service] = (acc[log.service] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(serviceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [parsedLogs]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title">Service Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#36A2EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

ServiceDistribution.displayName = "ServiceDistribution";

export default ServiceDistribution;
