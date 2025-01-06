import React, { useEffect, useState } from "react";
import ChartSkeleton from "./Skeleton/SystemMetrics/ChartSkeleton";
import MetricCardSkeleton from "./Skeleton/SystemMetrics/MetricCardSkeleton";
import { useQuery } from "@tanstack/react-query";
import { Activity, Cpu, HardDrive, Network } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_MARGIN } from "~~/lib/helper";

interface SystemMetrics {
  timestamp: number;
  disk: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  network: {
    rxSpeed: number;
    txSpeed: number;
    totalRx: number;
    totalTx: number;
  };
  processes: {
    total: number;
    running: number;
    sleeping: number;
  };
  loadAverage: {
    "1min": number;
    "5min": number;
    "15min": number;
  };
  temperatures: Record<string, number>;
}

const MetricCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <Icon className={`w-8 h-8 ${color}`} />
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const SystemMonitor = () => {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["system-metrics"],
    queryFn: async () => {
      const res = await fetch("/api/ssh/metrics/system");
      if (!res.ok) throw new Error("Failed to fetch metrics");
      return res.json();
    },
    refetchInterval: 5000,
  });

  if (error) {
    return <div className="text-red-500">Error loading metrics: {error.message} refresh the page</div>;
  }

  useEffect(() => {
    if (data) {
      setMetrics(prev => [...prev, data].slice(-30));
    }
  }, [data]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6 p-6">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Disk Usage"
            value={`${data?.disk.usagePercent.toFixed(1)}%`}
            icon={HardDrive}
            color="text-purple-500"
          />
          <MetricCard
            title="Network Speed"
            value={formatBytes(data?.network.rxSpeed || 0) + "/s"}
            icon={Network}
            color="text-blue-500"
          />
          <MetricCard
            title="Active Processes"
            value={data?.processes.running.toString() || "0"}
            icon={Activity}
            color="text-green-500"
          />
          <MetricCard
            title="System Load"
            value={data?.loadAverage["1min"].toFixed(2) || "0"}
            icon={Cpu}
            color="text-red-500"
          />
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Disk Usage</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[data?.disk].filter(Boolean)} margin={CHART_MARGIN}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" name="Used Space" fill="#8b5cf6" />
                <Bar dataKey="free" name="Free Space" fill="#c4b5fd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">System Temperatures</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={metrics} margin={CHART_MARGIN}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={ts => new Date(ts).toLocaleTimeString()} />
                <YAxis unit="°C" />
                <Tooltip labelFormatter={ts => new Date(ts).toLocaleString()} />
                <Legend />
                {Object.keys(data?.temperatures || {}).map((sensor, i) => (
                  <Line
                    key={sensor}
                    type="monotone"
                    dataKey={`temperatures.${sensor}`}
                    name={sensor}
                    stroke={`hsl(${i * 60}, 70%, 50%)`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Network Traffic</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={metrics} margin={CHART_MARGIN}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={ts => new Date(ts).toLocaleTimeString()} />
                <YAxis tickFormatter={value => `${formatBytes(value)}/s`} />
                <Tooltip
                  labelFormatter={ts => new Date(ts).toLocaleString()}
                  formatter={(value: any) => [`${formatBytes(value)}/s`]}
                />
                <Legend />
                <Area type="monotone" dataKey="network.rxSpeed" name="Download" stroke="#3b82f6" fill="#93c5fd" />
                <Area type="monotone" dataKey="network.txSpeed" name="Upload" stroke="#2563eb" fill="#60a5fa" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">System Load Average</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={metrics} margin={CHART_MARGIN}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={ts => new Date(ts).toLocaleTimeString()} />
                <YAxis />
                <Tooltip labelFormatter={ts => new Date(ts).toLocaleString()} />
                <Legend />
                <Line type="monotone" dataKey="loadAverage.1min" name="1 min" stroke="#ef4444" />
                <Line type="monotone" dataKey="loadAverage.5min" name="5 min" stroke="#f87171" />
                <Line type="monotone" dataKey="loadAverage.15min" name="15 min" stroke="#fca5a5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Process States</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={metrics} margin={CHART_MARGIN}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={ts => new Date(ts).toLocaleTimeString()} />
                <YAxis />
                <Tooltip labelFormatter={ts => new Date(ts).toLocaleString()} />
                <Legend />
                <Area type="monotone" dataKey="processes.running" name="Running" stroke="#22c55e" fill="#86efac" />
                <Area type="monotone" dataKey="processes.sleeping" name="Sleeping" stroke="#16a34a" fill="#4ade80" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemMonitor;
