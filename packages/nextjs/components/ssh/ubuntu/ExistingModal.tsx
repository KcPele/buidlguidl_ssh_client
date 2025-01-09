import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepDisplay from "./StepDisplay";
import { useAccount } from "wagmi";
import { BUIDLGUIDL_DIRECTORY_KEY, DEFAULT_DIRECTORY, SETUP_COMPLETED_KEY, executeCommand } from "~~/lib/helper";
import { Step } from "~~/types/ssh/step";

const INITIAL_STEPS = [
  {
    command: "pm2 --version",
    description: "Checking PM2 installation",
    status: "pending",
  },
  {
    command: "npm install --global pm2",
    description: "Installing PM2",
    status: "pending",
  },
  {
    command: "cd $DIRECTORY && pm2 start index.js -- --owner $ADDRESS",
    description: "Starting PM2 service",
    status: "pending",
  },
] as Step[];

interface ExistingModalProps {
  isDirectoryModalOpen: boolean;
  setIsDirectoryModalOpen: (isOpen: boolean) => void;
}

const ExistingModal: React.FC<ExistingModalProps> = ({ isDirectoryModalOpen, setIsDirectoryModalOpen }) => {
  const [state, setState] = useState({
    directory: "",
    steps: INITIAL_STEPS,
    isProcessing: false,
    isCompleted: false,
  });

  const router = useRouter();
  const { address } = useAccount();

  useEffect(() => {
    setState(prev => ({
      ...prev,
      directory: localStorage.getItem(BUIDLGUIDL_DIRECTORY_KEY) || DEFAULT_DIRECTORY,
    }));
  }, []);

  const updateStep = useCallback((index: number, updates: Partial<Step>) => {
    setState(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? { ...step, ...updates } : step)),
    }));
  }, []);

  const handlePM2Installation = async (currentStep: number): Promise<number> => {
    updateStep(currentStep, { status: "running" });
    try {
      const pm2Check = await executeCommand(state.steps[currentStep].command, state.directory);
      if (!pm2Check.error) {
        updateStep(currentStep, { status: "completed", output: pm2Check.output });
        updateStep(currentStep + 1, { status: "completed", skip: true });
        return 2; // Skip PM2 installation
      }
      updateStep(currentStep, { status: "completed", output: "PM2 not found" });
      return currentStep + 1;
    } catch (error) {
      updateStep(currentStep, { status: "error", output: error instanceof Error ? error.message : "Unknown error" });
      throw new Error(`PM2 check failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handlePM2Service = async (currentStep: number) => {
    updateStep(currentStep, { status: "running" });
    const startService = await executeCommand(state.steps[currentStep].command, state.directory, address);
    if (startService.error && !startService.error.includes("[PM2][ERROR] Script already launched")) {
      updateStep(currentStep, { status: "error", output: startService.error });
      throw new Error(startService.error);
    }

    updateStep(currentStep, { status: "completed", output: startService.output });
    localStorage.setItem(SETUP_COMPLETED_KEY, "true");
    setState(prev => ({ ...prev, isCompleted: true }));
  };

  const processSteps = async () => {
    setState(prev => ({ ...prev, isProcessing: true, isCompleted: false }));
    try {
      let currentStep = await handlePM2Installation(0);

      if (currentStep === 1) {
        updateStep(currentStep, { status: "running" });
        const pm2Install = await executeCommand(state.steps[currentStep].command, state.directory);
        if (pm2Install.error) {
          updateStep(currentStep, { status: "error", output: pm2Install.error });
          throw new Error(pm2Install.error);
        }
        updateStep(currentStep, { status: "completed", output: pm2Install.output });
        currentStep++;
      }

      await handlePM2Service(currentStep);
    } catch (error) {
      console.error("Setup error:", error);
      setState(prev => ({ ...prev, isCompleted: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalDirectory = state.directory.trim() || DEFAULT_DIRECTORY;
    localStorage.setItem(BUIDLGUIDL_DIRECTORY_KEY, finalDirectory);
    await processSteps();
  };

  return (
    <dialog id="directory_modal" className={`modal ${isDirectoryModalOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Existing Setup Configuration</h3>
        {!state.isProcessing ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">BuidlGuidl Directory</span>
              </label>
              <input
                type="text"
                placeholder="~/buidlguidl-client"
                className="input input-bordered w-full"
                value={state.directory}
                onChange={e => setState(prev => ({ ...prev, directory: e.target.value }))}
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
            {state.steps.map((step, index) => (
              <StepDisplay key={index} step={step} />
            ))}
            {state.isCompleted && (
              <div className="mt-6 flex justify-center">
                <button
                  className="btn btn-primary w-full md:w-auto"
                  onClick={() => router.push("/dashboard/setup/ubuntu")}
                >
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
