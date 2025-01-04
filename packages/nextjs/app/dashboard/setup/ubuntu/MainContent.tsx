import React from "react";
import { LogViewer } from "~~/components/ssh/LogViewer";
import { NodeMonitor } from "~~/components/ssh/NodeMonitor";
import Terminal from "~~/components/ssh/Terminal";

interface MainContentProps {
  activeSection: string;
}

export const MainContent = ({ activeSection }: MainContentProps) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 p-4 overflow-auto">
        <div className="h-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Linux Node Setup</h1>
          <div className="h-[calc(100%-6rem)]">
            {activeSection === "node-monitor" && <NodeMonitor />}
            {activeSection === "reth-logs" && <LogViewer title="Reth Logs" url="/api/ssh/logs/reth" />}
            {activeSection === "lighthouse-logs" && (
              <LogViewer title="Lighthouse Logs" url="/api/ssh/logs/lighthouse" />
            )}
            {activeSection === "terminal" && <Terminal />}
          </div>
        </div>
      </div>
    </div>
  );
};
