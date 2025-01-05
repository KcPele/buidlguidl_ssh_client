import { useMemo } from "react";
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
  console.log(parsedLogs[parsedLogs.length - 1]);
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

    // Enhanced timing metrics
    const timingData = parsedLogs
      .filter(log => log.metadata?.total_delay_ms)
      .map(log => ({
        timestamp: new Date(log.timestamp).getTime(),
        total_delay: parseInt(log.metadata.total_delay_ms || "0"),
        execution_time: parseInt(log.metadata.execution_time_ms || "0"),
        consensus_time: parseInt(log.metadata.consensus_time_ms || "0"),
        attestable_delay: parseInt(log.metadata.attestable_delay_ms || "0"),
        available_delay: parseInt(log.metadata.available_delay_ms || "0"),
      }))
      .filter(entry => !Object.values(entry).some(val => isNaN(val)));

    // New - Epoch Analysis
    const epochData = parsedLogs
      .filter(log => log.metadata?.our_finalized_epoch && log.metadata?.their_finalized_epoch)
      .map(log => ({
        timestamp: new Date(log.timestamp).getTime(),
        our_epoch: parseInt(log.metadata.our_finalized_epoch || "0"),
        their_epoch: parseInt(log.metadata.their_finalized_epoch || "0"),
        epoch_difference: Math.abs(
          parseInt(log.metadata.their_finalized_epoch || "0") - parseInt(log.metadata.our_finalized_epoch || "0"),
        ),
      }))
      .filter(entry => !Object.values(entry).some(val => isNaN(val)));

    // New - Slot Progress Analysis
    const slotData = parsedLogs
      .filter(log => log.metadata?.our_head_slot && log.metadata?.their_head_slot)
      .map(log => ({
        timestamp: new Date(log.timestamp).getTime(),
        our_slot: parseInt(log.metadata.our_head_slot || "0"),
        their_slot: parseInt(log.metadata.their_head_slot || "0"),
        slot_difference: Math.abs(
          parseInt(log.metadata.their_head_slot || "0") - parseInt(log.metadata.our_head_slot || "0"),
        ),
      }))
      .filter(entry => !Object.values(entry).some(val => isNaN(val)));

    // New - Network Health Metrics
    const networkHealthData = parsedLogs
      .filter(log => log.metadata?.peers || log.metadata?.target_peers)
      .map(log => ({
        timestamp: new Date(log.timestamp).getTime(),
        current_peers: parseInt(log.metadata.peers || "0"),
        target_peers: parseInt(log.metadata.target_peers || "0"),
        peer_difference: parseInt(log.metadata.peers || "0") - parseInt(log.metadata.target_peers || "0"),
      }))
      .filter(entry => !Object.values(entry).some(val => isNaN(val)));

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
      epochData,
      slotData,
      networkHealthData,
      peerMetrics,
    };
  }, [parsedLogs]);
  return (
    <div className="p-6 space-y-8 bg-base-200 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">Lighthouse Node Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Existing charts */}
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
        <div className="card bg-base-100 shadow-xl ">
          <div className="card-body">
            <h3 className="card-title">Timing Metrics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.timingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={["auto", "auto"]}
                    tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={timestamp => new Date(timestamp).toLocaleString()} />
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

        {/* New - Epoch Analysis */}
        <div className="card bg-base-100 shadow-xl ">
          <div className="card-body">
            <h3 className="card-title">Epoch Synchronization</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.epochData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={["auto", "auto"]}
                    tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={timestamp => new Date(timestamp).toLocaleString()} />
                  <Legend />
                  <Line type="monotone" dataKey="our_epoch" stroke="#36A2EB" name="Our Epoch" />
                  <Line type="monotone" dataKey="their_epoch" stroke="#FF6384" name="Peer Epoch" />
                  <Line type="monotone" dataKey="epoch_difference" stroke="#4BC0C0" name="Epoch Difference" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* New - Slot Progress */}
        <div className="card bg-base-100 shadow-xl ">
          <div className="card-body">
            <h3 className="card-title">Slot Progress Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.slotData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={["auto", "auto"]}
                    tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={timestamp => new Date(timestamp).toLocaleString()} />
                  <Legend />
                  <Line type="monotone" dataKey="our_slot" stroke="#36A2EB" name="Our Slot" />
                  <Line type="monotone" dataKey="their_slot" stroke="#FF6384" name="Peer Slot" />
                  <Line type="monotone" dataKey="slot_difference" stroke="#4BC0C0" name="Slot Difference" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* New - Network Health */}
        <div className="card bg-base-100 shadow-xl ">
          <div className="card-body">
            <h3 className="card-title">Network Health Metrics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.networkHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={["auto", "auto"]}
                    tickFormatter={timestamp => new Date(timestamp).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={timestamp => new Date(timestamp).toLocaleString()} />
                  <Legend />
                  <Line type="monotone" dataKey="current_peers" stroke="#36A2EB" name="Current Peers" />
                  <Line type="monotone" dataKey="target_peers" stroke="#FF6384" name="Target Peers" />
                  <Line type="monotone" dataKey="peer_difference" stroke="#4BC0C0" name="Peer Difference" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Connected Peers */}
        <div className="card bg-base-100 shadow-xl 2">
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
