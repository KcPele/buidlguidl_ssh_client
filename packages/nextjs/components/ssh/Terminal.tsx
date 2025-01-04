import React, { useEffect, useRef, useState } from "react";

const Terminal = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentInput, setCurrentInput] = useState("");
  const [log, setLog] = useState<Array<{ type: "input" | "output" | "error"; content: string }>>([
    { type: "output", content: 'Terminal initialized. Type "help" for commands.' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const executeCommand = async (command: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ssh/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Command execution failed");
      }

      const { output } = await response.json();
      setLog(prev => [...prev, { type: "input", content: command }, { type: "output", content: output }]);
      setHistory(prev => [...prev, command]);
    } catch (error) {
      setLog(prev => [
        ...prev,
        { type: "input", content: command },
        { type: "error", content: error instanceof Error ? error.message : "Unknown error" },
      ]);
    } finally {
      setIsLoading(false);
      setHistoryIndex(-1);
      setCurrentInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (currentInput.trim()) {
        if (currentInput.trim() === "clear") {
          setLog([]);
          setHistory([]);
          setCurrentInput("");
        } else {
          executeCommand(currentInput.trim());
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput("");
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [log]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg p-4 font-mono text-sm">
      <div ref={terminalRef} className="h-[calc(100%-40px)] overflow-y-auto overflow-x-hidden mb-4">
        {log.map((entry, index) => (
          <div
            key={index}
            className={`mb-2 break-words ${
              entry.type === "input" ? "text-blue-400" : entry.type === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {entry.type === "input" ? `> ${entry.content}` : entry.content}
          </div>
        ))}
      </div>

      <div className="flex items-center bg-gray-800 rounded p-2">
        {isLoading ? (
          <span className="mr-2 rotating-cursor text-blue-400">⟳</span>
        ) : (
          <span className="text-blue-400 mr-2">{">"}</span>
        )}
        <textarea
          ref={inputRef}
          value={currentInput}
          onChange={e => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-blue-300 outline-none resize-none overflow-hidden"
          rows={1}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default Terminal;
