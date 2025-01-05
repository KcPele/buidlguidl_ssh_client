import React, { memo } from "react";
import ConnectedPeers from "./LogMetricsChart/ConnectedPeers";
import LevelDistribution from "./LogMetricsChart/LevelDistribution";
import NetworkHealthMetrics from "./LogMetricsChart/NetworkHealthMetrics";
import NewEpochAnalysis from "./LogMetricsChart/NewEpochAnalysis";
import ServiceDistribution from "./LogMetricsChart/ServiceDistribution";
import TimingMetrics from "./LogMetricsChart/TimingMetrics";
import { ParsedLog } from "~~/types/ssh/lighthouse";

const ParsedLogView = memo(({ parsedLogs }: { parsedLogs: ParsedLog[] }) => (
  <div className="bg-base-200">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LevelDistribution parsedLogs={parsedLogs} />
      <ServiceDistribution parsedLogs={parsedLogs} />
      <TimingMetrics parsedLogs={parsedLogs} />
      <NewEpochAnalysis parsedLogs={parsedLogs} />
      {/* <SlotProgressAnalysis parsedLogs={parsedLogs} /> */}

      <NetworkHealthMetrics parsedLogs={parsedLogs} />
      <ConnectedPeers parsedLogs={parsedLogs} />
    </div>
  </div>
));

ParsedLogView.displayName = "ParsedLogView";

export default ParsedLogView;
