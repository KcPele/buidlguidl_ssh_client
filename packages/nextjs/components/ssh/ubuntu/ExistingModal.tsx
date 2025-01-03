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
    command: "pm2 --version",
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
  const [isCompleted, setIsCompleted] = useState(false);
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

  const navigateToDashboard = () => {
    router.push("/dashboard/setup/ubuntu");
  };

  const processSteps = async () => {
    setIsProcessing(true);
    setIsCompleted(false);
    let currentStep = 0;

    try {
      // Check PM2 installation
      updateStepStatus(currentStep, { status: "running" });
      try {
        const pm2Check = await executeCommand(steps[currentStep].command);
        updateStepStatus(currentStep, { status: "completed", output: pm2Check.output });
        updateStepStatus(currentStep + 1, { status: "completed", skip: true });
        currentStep = 2; // Skip PM2 installation if already installed
      } catch (error) {
        // PM2 not found, proceed with installation
        updateStepStatus(currentStep, { status: "completed", output: "PM2 not found" });
        currentStep++;

        // Install PM2
        updateStepStatus(currentStep, { status: "running" });
        try {
          const pm2Install = await executeCommand(steps[currentStep].command);
          updateStepStatus(currentStep, { status: "completed", output: pm2Install.output });
        } catch (error) {
          updateStepStatus(currentStep, {
            status: "error",
            output: error instanceof Error ? error.message : "Unknown error",
          });
          throw error;
        }
        currentStep++;
      }

      // Start PM2 service
      updateStepStatus(currentStep, { status: "running" });
      try {
        const startService = await executeCommand(steps[currentStep].command);
        updateStepStatus(currentStep, { status: "completed", output: startService.output });

        // Set completion state after all steps are successful
        localStorage.setItem("buidlguidlSetupCompleted", "true");
        setIsCompleted(true);
      } catch (error) {
        updateStepStatus(currentStep, {
          status: "error",
          output: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      }
    } catch (error) {
      console.error("Error during setup:", error);
      setIsCompleted(false);
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
            {isCompleted && (
              <div className="mt-6 flex justify-center">
                <button className="btn btn-primary w-full md:w-auto" onClick={navigateToDashboard}>
                  View Dashboard
                </button>
              </div>
            )}
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
