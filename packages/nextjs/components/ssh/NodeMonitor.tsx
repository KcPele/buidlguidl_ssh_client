"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SystemMetrics {
  timestamp: number;
  cpu: number;
  memory: number;
  uptime: number;
}

const LoadingSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="h-7 w-48 bg-gray-200 rounded"></div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
        <div className="h-5 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div className="space-y-6 flex gap-3 flex-col md:flex-row md:items-end justify-center">
      <div className="flex-1 min-w-0">
        <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
        <div className="w-full h-[200px] bg-gray-200 rounded"></div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="w-full h-[200px] bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

export function NodeMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [status, setStatus] = useState<"running" | "stopped" | "error">("stopped");

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const res = await fetch("/api/ssh/metrics");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch metrics");
      }

      return res.json();
    },
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (data) {
      setStatus("running");
      setMetrics(prev => [...prev, data].slice(-30));
    }
    if (error) {
      setStatus("error");
    }
  }, [data, isError, error]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Node Status Monitor</h2>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              status === "running" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-gray-500"
            }`}
          />
          <span className="text-sm text-gray-600">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
      </div>

      <div className="space-y-6 flex gap-3 flex-col md:flex-row md:items-end justify-center">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium mb-4">CPU Usage</h3>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString()} />
                <YAxis />
                <Tooltip labelFormatter={timestamp => new Date(timestamp).toLocaleString()} />
                <Line type="monotone" dataKey="cpu" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium mb-4">Memory Usage</h3>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString()} />
                <YAxis />
                <Tooltip labelFormatter={timestamp => new Date(timestamp).toLocaleString()} />
                <Line type="monotone" dataKey="memory" stroke="#2563EB" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
