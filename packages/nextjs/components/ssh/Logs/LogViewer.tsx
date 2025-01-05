import { useEffect, useRef, useState } from "react";
import ParsedLogView from "./ParsedLogView";
import { useQuery } from "@tanstack/react-query";
import { BUIDLGUIDL_DIRECTORY_KEY } from "~~/lib/helper";
import { ParsedLog } from "~~/types/ssh/lighthouse";

interface Log {
  level: string;
  message: string;
}

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 w-32 bg-gray-200 rounded"></div>
      <div className="flex space-x-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
    <div className="h-[400px] bg-gray-50 rounded p-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="mb-2 flex items-center">
          <div className="h-6 w-16 bg-gray-200 rounded mr-2"></div>
          <div className="h-6 w-full bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export function LogViewer({ url, title }: { url: string; title: string }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [parsedLogs, setParsedLogs] = useState<ParsedLog[]>([]);
  const [filter, setFilter] = useState<"all" | "info" | "warn" | "error">("all");
  const logContainerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["logs", url],
    queryFn: async () => {
      const directory = localStorage.getItem(BUIDLGUIDL_DIRECTORY_KEY) || "";
      const response = await fetch(url + "?directory=" + directory);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch metrics");
      }
      return response.json();
    },
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (data) {
      if (data.parsedLogs) {
        setParsedLogs(prevLogs => [...prevLogs, ...data.parsedLogs]);
      }
      if (data.logs && Array.isArray(data.logs)) {
        const parsedDataLogs = data.logs.map((logLine: string) => {
          const levelMatch = logLine.match(/INFO|WARN|ERROR|DEBG|CRIT|TRACE/);
          const level = levelMatch ? levelMatch[0].toLowerCase() : "info";
          const message = logLine.replace(levelMatch?.[0] || "", "").trim();
          return { level, message };
        });

        setLogs(prevLogs => [...prevLogs, ...parsedDataLogs]);
      }

      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }
  }, [data, isError, error]);

  const filteredLogs = logs.filter(log => (filter === "all" ? true : log.level === filter));

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {parsedLogs.length > 0 && <ParsedLogView parsedLogs={parsedLogs} />}
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex space-x-2">
            {["all", "info", "warn", "error"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-3 py-1 rounded transition-colors duration-200 ${
                  filter === f ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-red-600 mb-4 p-3 bg-red-50 rounded-md">{error.message}</div>}

        <div
          ref={logContainerRef}
          className="h-[400px] overflow-y-auto overflow-x-hidden bg-gray-50 rounded p-4 font-mono text-sm"
        >
          {filteredLogs.map((log, index) => (
            <div
              key={index}
              className={`mb-2 p-2 whitespace-pre-wrap break-all rounded transition-colors duration-200 ${
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
    </div>
  );
}
