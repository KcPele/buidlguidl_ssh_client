"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Step {
  command: string;
  description: string;
  output?: string;
  status: "pending" | "running" | "completed" | "error";
}

const SETUP_STEPS: Step[] = [
  {
    command: "sudo apt install git -y",
    description: "Installing Git",
    status: "pending",
  },
  {
    command: "git --version",
    description: "Verifying Git Installation",
    status: "pending",
  },
  {
    command: "npm install --global yarn",
    description: "Installing Yarn Package Manager",
    status: "pending",
  },
  {
    command: "git clone https://github.com/BuidlGuidl/buidlguidl-client.git",
    description: "Cloning BuidlGuidl Repository",
    status: "pending",
  },
  {
    command: "cd buidlguidl-client && yarn install",
    description: "Installing Dependencies",
    status: "pending",
  },
];

export default function UbuntuSetup() {
  const router = useRouter();
  const [steps, setSteps] = useState<Step[]>(SETUP_STEPS);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);

  useEffect(() => {
    const activeConnection = localStorage.getItem("active_ssh_connection");
    if (!activeConnection) {
      router.push("/");
      return;
    }
    setConnectionDetails(JSON.parse(activeConnection));
  }, [router]);

  const executeCommand = async (command: string) => {
    const response = await fetch("/api/commands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command,
        ...connectionDetails,
      }),
    });

    return response.json();
  };

  const startSetup = async () => {
    setIsRunning(true);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);

      // Update current step to running
      setSteps(prev => prev.map((step, index) => (index === i ? { ...step, status: "running" } : step)));

      try {
        const result = await executeCommand(steps[i].command);

        if (result.error) {
          setSteps(prev =>
            prev.map((step, index) => (index === i ? { ...step, status: "error", output: result.error } : step)),
          );
          break;
        }

        // Update step with output and status
        setSteps(prev =>
          prev.map((step, index) => (index === i ? { ...step, status: "completed", output: result.output } : step)),
        );
      } catch (error) {
        setSteps(prev =>
          prev.map((step, index) => (index === i ? { ...step, status: "error", output: "Command failed" } : step)),
        );
        break;
      }
    }

    setIsRunning(false);
  };

  if (!connectionDetails) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Setup Node on Ubuntu</h2>

          {!isRunning && currentStep === -1 && (
            <div className="py-4">
              <button onClick={startSetup} className="btn btn-primary">
                Start Setup
              </button>
            </div>
          )}

          <div className="space-y-4 mt-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  step.status === "running"
                    ? "border-primary bg-base-200"
                    : step.status === "completed"
                      ? "border-success bg-success/10"
                      : step.status === "error"
                        ? "border-error bg-error/10"
                        : "border-base-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{step.description}</h3>
                  <span
                    className={`
                    badge
                    ${
                      step.status === "running"
                        ? "badge-primary"
                        : step.status === "completed"
                          ? "badge-success"
                          : step.status === "error"
                            ? "badge-error"
                            : "badge-ghost"
                    }
                  `}
                  >
                    {step.status}
                  </span>
                </div>

                <div className="mt-2 font-mono text-sm opacity-70">$ {step.command}</div>

                {step.output && (
                  <div className="mt-2 bg-base-300 p-2 rounded font-mono text-sm whitespace-pre-wrap">
                    {step.output}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
