"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SetupProgress from "./SetupProgress";
import StepIndicator from "./StepIndicator";
import { Activity, Code, Database, Package, Settings, Terminal } from "lucide-react";
import { FiAlertTriangle, FiCheck, FiX } from "react-icons/fi";
import { useAccount } from "wagmi";
import PasswordModal from "~~/components/ssh/ubuntu/PasswordModal";
import {
  BUIDLGUIDL_DIRECTORY_KEY,
  DEFAULT_DIRECTORY,
  SETUP_COMPLETED_KEY,
  SETUP_PROGRESS_KEY,
  executeCommand,
} from "~~/lib/helper";
import { Step } from "~~/types/ssh/step";

const SETUP_STEPS: Step[] = [
  // System Update
  {
    command: "echo $PASSWORD | sudo -S apt update",
    description: "Updating package lists",
    category: "System Updates",
    status: "pending",
  },
  {
    command: "echo $PASSWORD | sudo -S apt upgrade -y",
    description: "Upgrading installed packages",
    category: "System Updates",
    status: "pending",
  },
  {
    command: "echo $PASSWORD | sudo -S apt install curl -y",
    description: "Installing curl",
    category: "System Updates",
    status: "pending",
  },

  // Node.js Installation
  {
    command: "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash",
    description: "Installing NVM",
    category: "Node.js Setup",
    status: "pending",
  },
  // {
  //   command: "source ~/.bashrc",
  //   description: "Loading NVM configuration",
  //   category: "Node.js Setup",
  //   status: "pending",

  // },
  {
    command: " nvm install --lts",
    description: "Installing Node.js LTS",
    category: "Node.js Setup",
    status: "pending",
  },

  // Development Tools
  {
    command: "echo $PASSWORD | sudo -S apt install git -y",
    description: "Installing Git",
    category: "Development Tools",
    status: "pending",
  },
  {
    command: "npm install --global yarn",
    description: "Installing Yarn",
    category: "Development Tools",
    status: "pending",
  },
  {
    command: "npm install --global pm2",
    description: "Installing PM2",
    category: "Development Tools",
    status: "pending",
  },

  // Project Setup
  {
    command: "git clone https://github.com/BuidlGuidl/buidlguidl-client.git",
    description: "Cloning Repository",
    category: "Project Setup",
    status: "pending",
  },
  {
    command: "cd $DIRECTORY && yarn install",
    description: "Installing Dependencies",
    category: "Project Setup",
    status: "pending",
  },
  {
    command: "cd $DIRECTORY && pm2 start index.js -- --owner $ADDRESS",
    description: "Starting PM2 Service",
    category: "Project Setup",
    status: "pending",
  },
];
// Helper function to get card icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "System Updates":
      return <Package className="h-5 w-5" />;
    case "Node.js Setup":
      return <Code className="h-5 w-5" />;
    default:
      return <Database className="h-5 w-5" />;
  }
};
export default function UbuntuSetup() {
  const router = useRouter();
  const { address } = useAccount();
  const [steps, setSteps] = useState<Step[]>(SETUP_STEPS);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const groupedSteps = steps.reduce(
    (acc, step) => {
      const category = step.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(step);
      return acc;
    },
    {} as Record<string, Step[]>,
  );

  const loadSavedProgress = (): { steps: Step[]; currentStep: number } | null => {
    try {
      const savedProgress = localStorage.getItem(SETUP_PROGRESS_KEY);
      return savedProgress ? JSON.parse(savedProgress) : null;
    } catch (error) {
      console.error("Error loading saved progress:", error);
      return null;
    }
  };

  const saveProgress = (updatedSteps: Step[], stepIndex: number) => {
    try {
      localStorage.setItem(
        SETUP_PROGRESS_KEY,
        JSON.stringify({
          steps: updatedSteps,
          currentStep: stepIndex,
        }),
      );
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  useEffect(() => {
    const savedProgress = loadSavedProgress();
    if (savedProgress) {
      const { steps: savedSteps, currentStep: savedCurrentStep } = savedProgress;

      // Merge saved steps with initial steps
      const restoredSteps = SETUP_STEPS.map((initialStep, index) => {
        const savedStep = savedSteps[index];
        if (savedStep) {
          return {
            ...initialStep,
            status: savedStep.status,
            output: savedStep.output,
          };
        }
        return initialStep;
      });

      setSteps(restoredSteps);
      setCurrentStep(savedCurrentStep);

      if (restoredSteps[savedCurrentStep]?.status === "error") {
        setHasError(true);
      }

      if (restoredSteps[savedCurrentStep]?.status === "running") {
        setIsRunning(true);
      }
    }
  }, []);

  const handlePasswordSubmit = async (password: string) => {
    setIsPasswordModalOpen(false);
    await startSetup(password);
  };

  const startSetup = async (sudoPassword: string) => {
    setIsRunning(true);
    setHasError(false);

    // Start from the last successful step or the beginning
    const startIndex = Math.max(currentStep, 0);
    let innerCurrentStep = currentStep;
    for (let i = startIndex; i < steps.length; i++) {
      innerCurrentStep = i;
      setCurrentStep(i);

      // Update current step to running while keeping previous steps' states
      setSteps(prevSteps =>
        prevSteps.map((step, index) => {
          if (index === i) {
            return { ...step, status: "running" };
          }
          // Keep completed steps as completed
          if (index < i) {
            return { ...step, status: "completed" };
          }
          return step;
        }),
      );

      try {
        if (steps[i].skip) {
          continue;
        }
        const result = await executeCommand(steps[i].command, "~/buidlguidl-client", address, sudoPassword);
        if (result.error) {
          setSteps(prevSteps => {
            const innerStep: Step[] = prevSteps.map((step, index) =>
              index === i ? { ...step, status: "error", output: result.error } : step,
            );
            saveProgress(innerStep, i);
            return innerStep;
          });
          setHasError(true);
          break;
        }

        // Update the current step as completed with its output
        setSteps(prevSteps => {
          const innerStep: Step[] = prevSteps.map((step, index) =>
            index === i ? { ...step, status: "completed", output: result.output } : step,
          );
          saveProgress(innerStep, i);
          return innerStep;
        });
      } catch (error: any) {
        setSteps(prevSteps => {
          const innerStep: Step[] = prevSteps.map((step, index) =>
            index === i ? { ...step, status: "error", output: error.message || "Command failed" } : step,
          );
          saveProgress(innerStep, i);
          return innerStep;
        });
        setHasError(true);
        break;
      }
    }

    setIsRunning(false);

    if (!hasError && innerCurrentStep === steps.length - 1) {
      localStorage.removeItem(SETUP_PROGRESS_KEY); // Clear progress on successful completion
      console.log("Setting setup completed to true");
      localStorage.setItem(SETUP_COMPLETED_KEY, "true");
      localStorage.setItem(BUIDLGUIDL_DIRECTORY_KEY, DEFAULT_DIRECTORY);
    }
  };

  const initiateSetup = () => {
    setIsPasswordModalOpen(true);
  };
  return (
    <div className="min-h-screen bg-base-200">
      {/* Top Navigation Bar */}
      <div className="navbar bg-base-100 shadow-lg px-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Node Setup Dashboard</h1>
          </div>
        </div>
        <div className="flex-none">
          <Activity className="h-5 w-5 text-success animate-pulse" />
          <span className="ml-2 text-sm">Status: {isRunning ? "Running" : "Ready"}</span>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Top Section - Progress and Controls */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Setup Progress Card */}
          <div className="xl:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-lg mb-4">Overall Progress</h2>
                <SetupProgress steps={steps} />
              </div>
            </div>
          </div>

          {/* Control Panel Card */}
          <div className="xl:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-lg mb-4">Controls</h2>
                {!isRunning && currentStep === -1 && (
                  <div className="space-y-4">
                    <div className="alert alert-info bg-info/10 border border-info">
                      <FiAlertTriangle className="h-5 w-5" />
                      <div>
                        <h3 className="font-bold">Prerequisites</h3>
                        <p className="text-sm">Sudo access and stable internet required</p>
                      </div>
                    </div>
                    <button onClick={initiateSetup} className="btn btn-primary w-full gap-2">
                      <Terminal className="h-4 w-4" />
                      Start Setup Process
                    </button>
                  </div>
                )}

                {!isRunning && hasError && (
                  <div className="space-y-4">
                    <div className="alert alert-error bg-error/10 border border-error">
                      <FiX className="h-5 w-5" />
                      <div>
                        <h3 className="font-bold">Setup Failed</h3>
                        <p className="text-sm">Please check errors and retry</p>
                      </div>
                    </div>
                    <button onClick={initiateSetup} className="btn btn-error w-full">
                      Retry Setup
                    </button>
                  </div>
                )}

                {!isRunning && !hasError && currentStep >= 0 && currentStep === steps.length - 1 && (
                  <div className="space-y-4">
                    <div className="alert alert-success bg-success/10 border border-success">
                      <FiCheck className="h-5 w-5" />
                      <div>
                        <h3 className="font-bold">Setup Complete</h3>
                        <p className="text-sm">Node configured successfully</p>
                      </div>
                    </div>
                    <button onClick={() => router.push("/dashboard/setup/ubuntu")} className="btn btn-success w-full">
                      Go to Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Setup Process Categories */}
        <div className="space-y-6">
          {Object.entries(groupedSteps).map(([category, categorySteps]) => (
            <div key={category} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  {getCategoryIcon(category)}
                  <h2 className="card-title text-lg">{category}</h2>
                  <div className="flex-1"></div>
                  {/* Category Progress Badge */}
                  <div className="badge badge-lg">
                    {categorySteps.filter(step => step.status === "completed").length}
                    <span className="mx-1">/</span>
                    {categorySteps.length}
                  </div>
                </div>

                <div className="space-y-4">
                  {categorySteps.map((step, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border-2 transition-all duration-300 ${
                        step.status === "running"
                          ? "border-primary bg-primary/5"
                          : step.status === "completed"
                            ? "border-success bg-success/5"
                            : step.status === "error"
                              ? "border-error bg-error/5"
                              : "border-base-300"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <StepIndicator status={step.status} />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{step.description}</h4>
                            <code className="text-xs opacity-70 block truncate">{step.command}</code>
                          </div>
                          <span
                            className={`badge ${
                              step.status === "running"
                                ? "badge-primary"
                                : step.status === "completed"
                                  ? "badge-success"
                                  : step.status === "error"
                                    ? "badge-error"
                                    : "badge-ghost"
                            }`}
                          >
                            {step.status}
                          </span>
                        </div>

                        {step.output && (
                          <div className="mt-3">
                            <div className="bg-base-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                              <pre className="text-xs whitespace-pre-wrap">{step.output}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onSubmit={handlePasswordSubmit}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
