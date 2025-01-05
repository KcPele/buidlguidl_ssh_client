import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ParsedLog } from "~~/types/ssh/lighthouse";

const COLORS = ["#36A2EB", "#FF6384", "#4BC0C0", "#FF9F40", "#9966FF"];

const ParsedLogView = ({ parsedLogs }: { parsedLogs: ParsedLog[] }) => {
  const [timeRange, setTimeRange] = useState("all");

  const stats = useMemo(() => {
    // Log levels distribution
    const levelCounts = parsedLogs.reduce((acc: Record<string, number>, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {});

    // Service distribution
    const serviceCounts = parsedLogs.reduce((acc: Record<string, number>, log) => {
      acc[log.service] = (acc[log.service] || 0) + 1;
      return acc;
    }, {});

    // Timing metrics
    const timingData = parsedLogs
      .filter(log => log.metadata?.total_delay_ms && !isNaN(parseInt(log.metadata?.total_delay_ms)))
      .map(log => ({
        timestamp: log.timestamp,
        total_delay: parseInt(log.metadata?.total_delay_ms || "0"),
        execution_time: parseInt(log.metadata?.execution_time_ms || "0"),
        consensus_time: parseInt(log.metadata?.consensus_time_ms || "0"),
      }));

    // Peer metrics
    const peerMetrics = parsedLogs
      .filter(log => log.metadata?.peers && !isNaN(parseInt(log.metadata?.peers)))
      .map(log => ({
        timestamp: log.timestamp,
        peers: parseInt(log.metadata?.peers || "0"),
      }));

    return {
      levelData: Object.entries(levelCounts).map(([name, value]) => ({ name, value })),
      serviceData: Object.entries(serviceCounts).map(([name, value]) => ({ name, value })),
      timingData,
      peerMetrics,
    };
  }, [parsedLogs]);
  return (
    <div className="p-6 space-y-8 bg-base-200 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">Lighthouse Node Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Log Levels Distribution */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Log Level Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.levelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {stats.levelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Service Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.serviceData}>
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

        {/* Timing Metrics */}
        <div className="card bg-base-100 shadow-xl col-span-1 md:col-span-2">
          <div className="card-body">
            <h3 className="card-title">Timing Metrics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.timingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total_delay" stroke="#FF6384" name="Total Delay" dot={false} />
                  <Line type="monotone" dataKey="execution_time" stroke="#36A2EB" name="Execution Time" dot={false} />
                  <Line type="monotone" dataKey="consensus_time" stroke="#4BC0C0" name="Consensus Time" dot={false} />
                  <Line
                    type="monotone"
                    dataKey="attestable_delay"
                    stroke="#FF9F40"
                    name="Attestable Delay"
                    dot={false}
                  />
                  <Line type="monotone" dataKey="available_delay" stroke="#9966FF" name="Available Delay" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Connected Peers */}
        <div className="card bg-base-100 shadow-xl col-span-1 md:col-span-2">
          <div className="card-body">
            <h3 className="card-title">Connected Peers</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.peerMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="peers" stroke="#9966FF" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParsedLogView;
