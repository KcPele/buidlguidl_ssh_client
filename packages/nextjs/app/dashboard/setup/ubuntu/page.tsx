"use client";

import React, { useState } from "react";
import { FaChartBar, FaFileAlt, FaTerminal } from "react-icons/fa";
import { LogViewer } from "~~/components/ssh/LogViewer";
import { NodeMonitor } from "~~/components/ssh/NodeMonitor";
import { Terminal } from "~~/components/ssh/Terminal";

const Ubuntu = () => {
  const [activeSection, setActiveSection] = useState("node-monitor");

  return (
    <main className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="md:w-64 bg-gray-800 text-white flex flex-col p-4 w-20">
        <h2 className="text-xl font-bold mb-4 hidden md:block">Navigation</h2>
        <nav className="flex flex-col space-y-2">
          <button
            onClick={() => setActiveSection("node-monitor")}
            className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${
              activeSection === "node-monitor" ? "bg-gray-700" : ""
            }`}
          >
            <FaChartBar className="text-lg" />
            <span className="hidden md:block">Node Monitor</span>
          </button>
          <button
            onClick={() => setActiveSection("reth-logs")}
            className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${
              activeSection === "reth-logs" ? "bg-gray-700" : ""
            }`}
          >
            <FaFileAlt className="text-lg" />
            <span className="hidden md:block">Reth Logs</span>
          </button>
          <button
            onClick={() => setActiveSection("lighthouse-logs")}
            className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${
              activeSection === "lighthouse-logs" ? "bg-gray-700" : ""
            }`}
          >
            <FaFileAlt className="text-lg" />
            <span className="hidden md:block">Lighthouse Logs</span>
          </button>
          <button
            onClick={() => setActiveSection("terminal")}
            className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 ${
              activeSection === "terminal" ? "bg-gray-700" : ""
            }`}
          >
            <FaTerminal className="text-lg" />
            <span className="hidden md:block">Terminal</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Linux Node Setup</h1>
          <div className="space-y-8">
            {/* Conditional Rendering */}
            {activeSection === "node-monitor" && <NodeMonitor />}
            {activeSection === "reth-logs" && <LogViewer title="Reth Logs" url="/api/ssh/logs/reth" />}
            {activeSection === "lighthouse-logs" && (
              <LogViewer title="Lighthouse Logs" url="/api/ssh/logs/lighthouse" />
            )}
            {activeSection === "terminal" && <Terminal />}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Ubuntu;
