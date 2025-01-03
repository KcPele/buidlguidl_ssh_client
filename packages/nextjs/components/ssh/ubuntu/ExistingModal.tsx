import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepDisplay from "./StepDisplay";

interface Step {
  command: string;
  description: string;
  output?: string;
  status: "pending" | "running" | "completed" | "error";
  skip?: boolean;
}
const INITIAL_STEPS: Step[] = [
  {
    command: "which pm2",
    description: "Checking PM2 installation",
    status: "pending",
  },
  {
    command: " npm install -g pm2",
    description: "Installing PM2",
    status: "pending",
  },

  {
    command: "cd $DIRECTORY && pm2 start index.js",
    description: "Starting PM2 service",
    status: "pending",
  },
];

const ExistingModal = ({
  isDirectoryModalOpen,
  setIsDirectoryModalOpen,
}: {
  isDirectoryModalOpen: boolean;
  setIsDirectoryModalOpen: (isOpen: boolean) => void;
}) => {
  const [directory, setDirectory] = useState("");
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedDirectory = localStorage.getItem("buildguildDirectory");
    if (savedDirectory) {
      setDirectory(savedDirectory);
    }
  }, []);

  const executeCommand = async (command: string) => {
    const actualCommand = command.replace("$DIRECTORY", directory || "~/buidlguidl-client");
    try {
      const response = await fetch("/api/ssh/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: actualCommand,
        }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || "Command execution failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateStepStatus = (index: number, updates: Partial<Step>) => {
    setSteps(currentSteps => currentSteps.map((step, i) => (i === index ? { ...step, ...updates } : step)));
  };

  const processSteps = async () => {
    setIsProcessing(true);
    let currentStep = 0;

    try {
      // Check Node.js installation
      updateStepStatus(currentStep, { status: "running" });
      try {
        const nodeCheck = await executeCommand(steps[currentStep].command);
        updateStepStatus(currentStep, { status: "completed", output: nodeCheck.output });
        updateStepStatus(currentStep + 1, { status: "completed", skip: true });
        currentStep = 2; // Skip Node.js installation
      } catch (error) {
        // Node.js not found, proceed with installation
        updateStepStatus(currentStep, { status: "completed", output: "Node.js not found" });
        currentStep++;

        // Install Node.js
        updateStepStatus(currentStep, { status: "running" });
        try {
          const nodeInstall = await executeCommand(steps[currentStep].command);
          updateStepStatus(currentStep, { status: "completed", output: nodeInstall.output });
        } catch (error) {
          updateStepStatus(currentStep, {
            status: "error",
            output: error instanceof Error ? error.message : "Unknown error",
          });
          throw error;
        }
        currentStep++;
      }

      // Install PM2
      updateStepStatus(currentStep, { status: "running" });
      try {
        const pm2Install = await executeCommand(steps[currentStep].command);
        updateStepStatus(currentStep, { status: "completed", output: pm2Install.output });
        currentStep++;
      } catch (error) {
        updateStepStatus(currentStep, {
          status: "error",
          output: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }

      // Install PM2 logrotate
      updateStepStatus(currentStep, { status: "running" });
      try {
        const logrotateInstall = await executeCommand(steps[currentStep].command);
        updateStepStatus(currentStep, { status: "completed", output: logrotateInstall.output });
      } catch (error) {
        updateStepStatus(currentStep, {
          status: "error",
          output: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }

      // All steps completed successfully
      setTimeout(() => {
        router.push("/dashboard/setup/ubuntu");
      }, 2000);
    } catch (error) {
      console.error("Error during setup:", error);
    }
  };

  const handleDirectorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalDirectory = directory.trim() || "~/buidlguidl-client";
    localStorage.setItem("buildguildDirectory", finalDirectory);
    await processSteps();
  };

  return (
    <dialog id="directory_modal" className={`modal ${isDirectoryModalOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Existing Setup Configuration</h3>
        {!isProcessing ? (
          <form onSubmit={handleDirectorySubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">BuidlGuidl Directory</span>
              </label>
              <input
                type="text"
                placeholder="~/buidlguidl-client/"
                className="input input-bordered w-full"
                value={directory}
                onChange={e => setDirectory(e.target.value)}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/70">
                  Leave blank if buidlguidl folder is in home directory
                </span>
              </label>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Continue
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setIsDirectoryModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4">
            {steps.map((step, index) => (
              <StepDisplay key={index} step={step} />
            ))}
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setIsDirectoryModalOpen(false)}>Close</button>
      </form>
    </dialog>
  );
};

export default ExistingModal;
