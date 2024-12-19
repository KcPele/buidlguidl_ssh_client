import React from "react";
import { LogViewer } from "~~/components/ssh/LogViewer";
import { NodeMonitor } from "~~/components/ssh/NodeMonitor";

const Ubuntu = () => {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Linux Node Setup</h1>
        <div className="space-y-8">
          <NodeMonitor />
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1 min-w-0">
              <LogViewer title="Reth Logs" url="/api/ssh/logs/reth" />
            </div>
            <div className="flex-1 min-w-0">
              <LogViewer title="Lighthouse Logs" url="/api/ssh/logs/lighthouse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Ubuntu;
