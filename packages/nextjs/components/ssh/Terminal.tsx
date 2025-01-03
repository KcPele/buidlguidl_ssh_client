"use client";

import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  output?: string;
}

export function Terminal({ output }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [currentInput, setCurrentInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [log, setLog] = useState<string[]>([output || "> Waiting for commands..."]);

  async function runTerminalCommand(command: string) {
    const response = await fetch("/api/ssh/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        command,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Command execution failed");
    }

    const { output } = await response.json();
    setTerminalOutput(prev => `${prev}\n${output}`);
  }

  useEffect(() => {
    //if there is output, add it to the log
    if (output) {
      setLog(prev => [...prev, output]);
    }
    //if there is terminalOutput, add it to the log
    if (terminalOutput) {
      setLog(prev => [...prev, terminalOutput]);
    }
  }, [output, terminalOutput]);

  // Scroll to the bottom whenever log updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [log]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isLoading) return; // Prevent typing while loading

    if (e.key === "Enter") {
      e.preventDefault();
      if (currentInput.trim()) {
        setLog(prev => [...prev, `> ${currentInput}`]); // Add input to log
        setCurrentInput(""); // Clear input
        setIsLoading(true);
        try {
          await runTerminalCommand(currentInput);
        } catch (error) {
          console.log("terminal error", error);
        }
        setIsLoading(false);
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
      setCurrentInput(prev => prev.slice(0, -1)); // Handle backspace
    } else if (e.key === " ") {
      e.preventDefault();
      setCurrentInput(prev => prev + " "); // Handle space
    } else if (e.key.length === 1) {
      setCurrentInput(prev => prev + e.key); // Handle printable characters
    }
  };

  return (
    <div className="relative h-[600px] w-full">
      <div
        className="absolute inset-0 bg-gray-900 rounded-lg p-3 overflow-y-auto overflow-x-hidden text-blue-400 font-mono text-sm whitespace-pre-wrap cursor-text"
        ref={terminalRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {log.map((line, index) => (
          <div key={index} className="break-words">
            {line}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-blue-400">{"> "}</span>
          <span className="text-blue-300">{currentInput}</span>
          <span className={`${isLoading ? "ml-1 rotating-cursor" : "blinking-cursor"}`}>|</span>
        </div>
      </div>
    </div>
  );
}
