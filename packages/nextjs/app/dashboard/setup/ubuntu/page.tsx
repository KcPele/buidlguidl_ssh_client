import React from "react";
import { NodeMonitor } from "~~/components/ssh/NodeMonitor";

const Ubuntu = () => {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Linux Node Setup</h1>
        <div className="space-y-8">
          <NodeMonitor />
        </div>
      </div>
    </main>
  );
};

export default Ubuntu;
