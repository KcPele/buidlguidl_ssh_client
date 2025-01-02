"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface Log {
  level: string; // info, warn, error
  message: string;
}

export function LogViewer({ url, title }: { url: string; title: string }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filter, setFilter] = useState<"all" | "info" | "warn" | "error">("all");
  const logContainerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["logs", url],
    queryFn: async () => {
      const directory = JSON.stringify(localStorage.getItem("buildguildDirectory"));

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch metrics");
      }
      return response.json();
    },

    refetchInterval: 10000,
  });
  useEffect(() => {
    console.log(error);
    if (data) {
      if (data.logs && Array.isArray(data.logs)) {
        const parsedLogs = data.logs.map((logLine: string) => {
          const levelMatch = logLine.match(/INFO|WARN|ERROR|DEBG|CRIT|TRACE/);
          const level = levelMatch ? levelMatch[0].toLowerCase() : "info";
          const message = logLine.replace(levelMatch?.[0] || "", "").trim();
          return { level, message };
        });

        setLogs(prevLogs => [...prevLogs, ...parsedLogs]);
      }

      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }
  }, [data, isError, error]);

  const filteredLogs = logs.filter(log => (filter === "all" ? true : log.level === filter));
  console.log(url);
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex space-x-2">
          {["all", "info", "warn", "error"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-3 py-1 rounded ${filter === f ? "bg-indigo-100 text-indigo-800" : "bg-gray-100"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error.message}</div>}

      <div
        ref={logContainerRef}
        className="h-[400px] overflow-y-auto overflow-x-hidden bg-gray-50 rounded p-4 font-mono text-sm"
      >
        {filteredLogs.map((log, index) => (
          <div
            key={index}
            className={`mb-2 p-2 whitespace-pre-wrap break-all rounded ${
              log.level === "error"
                ? "bg-red-50 text-red-800"
                : log.level === "warn"
                  ? "bg-yellow-50 text-yellow-800"
                  : "bg-blue-50 text-blue-800"
            }`}
          >
            <span className="font-bold capitalize">{log.level}</span>
            <span className="mx-2">|</span>
            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
