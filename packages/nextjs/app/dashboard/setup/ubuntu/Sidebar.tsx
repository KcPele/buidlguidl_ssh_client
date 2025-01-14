import React from "react";
import Action from "./Action";
import { FaChartBar, FaChartLine, FaFileAlt, FaTerminal } from "react-icons/fa";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  return (
    <aside className="xl:w-64 w-20 bg-gray-800 text-white flex-shrink-0">
      <div className="h-full flex flex-col justify-between p-4">
        <div>
          <h2 className="text-xl font-bold mb-4 hidden xl:block">Navigation</h2>
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setActiveSection("node-monitor")}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors ${
                activeSection === "node-monitor" ? "bg-gray-700" : ""
              }`}
            >
              <FaChartBar className="text-lg" />
              <span className="hidden xl:block">Node Monitor</span>
            </button>
            <button
              onClick={() => setActiveSection("system-metrics")}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors ${
                activeSection === "system-metrics" ? "bg-gray-700" : ""
              }`}
            >
              <FaChartLine className="text-lg" />
              <span className="hidden xl:block">System Metrics</span>
            </button>
            <button
              onClick={() => setActiveSection("reth-logs")}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors ${
                activeSection === "reth-logs" ? "bg-gray-700" : ""
              }`}
            >
              <FaFileAlt className="text-lg" />
              <span className="hidden xl:block">Reth Logs</span>
            </button>
            <button
              onClick={() => setActiveSection("lighthouse-logs")}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors ${
                activeSection === "lighthouse-logs" ? "bg-gray-700" : ""
              }`}
            >
              <FaFileAlt className="text-lg" />
              <span className="hidden xl:block">Lighthouse Logs</span>
            </button>
            <button
              onClick={() => setActiveSection("terminal")}
              className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors ${
                activeSection === "terminal" ? "bg-gray-700" : ""
              }`}
            >
              <FaTerminal className="text-lg" />
              <span className="hidden xl:block">Terminal</span>
            </button>
          </nav>
        </div>
        <Action />
      </div>
    </aside>
  );
};
