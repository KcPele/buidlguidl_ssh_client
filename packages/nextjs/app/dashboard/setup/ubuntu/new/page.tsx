"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SetupProgress from "./SetupProgress";
import StepIndicator from "./StepIndicator";
import { FiAlertTriangle, FiCheck, FiX } from "react-icons/fi";
import { useAccount } from "wagmi";
import PasswordModal from "~~/components/ssh/ubuntu/PasswordModal";
import { BUIDLGUIDL_DIRECTORY_KEY, executeCommand, SETUP_COMPLETED_KEY, SETUP_PROGRESS_KEY } from "~~/lib/helper";
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

    for (let i = startIndex; i < steps.length; i++) {
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
            let innerStep: Step[] = prevSteps.map((step, index) =>
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
          let innerStep: Step[] = prevSteps.map((step, index) =>
            index === i ? { ...step, status: "completed", output: result.output } : step,
          );
          saveProgress(innerStep, i);
          return innerStep;
        });
      } catch (error: any) {
        setSteps(prevSteps => {
          let innerStep: Step[] = prevSteps.map((step, index) =>
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
    if (!hasError && currentStep === steps.length - 1) {
      localStorage.removeItem(SETUP_PROGRESS_KEY); // Clear progress on successful completion
      localStorage.setItem(SETUP_COMPLETED_KEY, "true");
      localStorage.setItem(BUIDLGUIDL_DIRECTORY_KEY, "~/buidlguidl-client");
    }
  };

  const initiateSetup = () => {
    setIsPasswordModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Ubuntu Node Setup</h2>

          <SetupProgress steps={steps} />

          {!isRunning && currentStep === -1 && (
            <div className="py-4 space-y-4">
              <div className="alert alert-info shadow-lg">
                <FiAlertTriangle className="text-lg" />
                <div>
                  <h3 className="font-bold">Before you begin</h3>
                  <p className="text-sm">
                    Ensure you have sudo access and a stable internet connection. This process will take several minutes
                    to complete.
                  </p>
                </div>
              </div>
              <button onClick={initiateSetup} className="btn btn-primary w-full md:w-auto">
                Start Setup Process
              </button>
            </div>
          )}

          <div className="space-y-8">
            {Object.entries(groupedSteps).map(([category, categorySteps]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4">{category}</h3>
                <div className="space-y-4">
                  {categorySteps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-colors duration-300 ${
                        step.status === "running"
                          ? "border-primary bg-primary/5"
                          : step.status === "completed"
                            ? "border-success bg-success/5"
                            : step.status === "error"
                              ? "border-error bg-error/5"
                              : "border-base-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <StepIndicator status={step.status} />
                        <div className="flex-1">
                          <h4 className="font-medium">{step.description}</h4>
                          <code className="text-xs opacity-70">{step.command}</code>
                        </div>
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

                      {step.output && (
                        <div className="mt-3 bg-base-300 p-3 rounded-lg">
                          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{step.output}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!isRunning && hasError && (
            <div className="mt-6">
              <div className="alert alert-error shadow-lg">
                <FiX className="text-lg" />
                <div>
                  <h3 className="font-bold">Setup Failed</h3>
                  <p className="text-sm">
                    An error occurred during setup. Please check the error messages above and try again.
                  </p>
                </div>
              </div>
              <button onClick={initiateSetup} className="btn btn-error mt-4">
                Retry Setup
              </button>
            </div>
          )}

          {!isRunning && !hasError && currentStep >= 0 && currentStep === steps.length - 1 && (
            <div className="mt-6">
              <div className="alert alert-success shadow-lg">
                <FiCheck className="text-lg" />
                <div>
                  <h3 className="font-bold">Setup Complete</h3>
                  <p className="text-sm">Your node has been successfully configured and started.</p>
                </div>
              </div>
              <button onClick={() => router.push("/dashboard/setup/ubuntu")} className="btn btn-primary mt-4">
                Go to Dashboard
              </button>
            </div>
          )}
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
