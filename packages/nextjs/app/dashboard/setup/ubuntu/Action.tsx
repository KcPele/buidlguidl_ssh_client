"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Power } from "lucide-react";
import { FaPowerOff, FaRedo, FaSyncAlt } from "react-icons/fa";
import { useAccount, useEnsName } from "wagmi";
import LoadingModal from "~~/components/ssh/ubuntu/LoadingModal";
import { BUIDLGUIDL_DIRECTORY_KEY, SETUP_COMPLETED_KEY, SETUP_PROGRESS_KEY, executeCommand } from "~~/lib/helper";
import { Step } from "~~/types/ssh/step";

const UPDATE_STEPS: Step[] = [
  {
    command: " cd $DIRECTORY && git pull",
    description: "Updating the codebase",
    status: "pending",
  },
  {
    command: "cd $DIRECTORY && yarn install",
    description: "Installing dependencies",
    status: "pending",
  },
  {
    command: "cd $DIRECTORY && pm2 restart all --update-env",
    description: "Restarting the service",
    status: "pending",
  },
];

const RESTART_STEPS: Step[] = [
  {
    command: "cd $DIRECTORY && pm2 restart all --update-env",
    description: "Restarting the service",
    status: "pending",
  },
];

const SHUTDOWN_STEPS: Step[] = [
  {
    command: "pm2 kill",
    description: "Stopping the service",
    status: "pending",
  },
];

const START_STEPS: Step[] = [
  {
    command: "cd $DIRECTORY && pm2 start index.js -- --owner $ADDRESS",
    description: "Starting Node with PM2 service",
    status: "pending",
  },
];

const Action = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSteps, setCurrentSteps] = useState<Step[]>([]);
  const [modalTitle, setModalTitle] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const { address } = useAccount();
  const ens = useEnsName({ address });
  const router = useRouter();
  const updateStepStatus = (index: number, updates: Partial<Step>) => {
    setCurrentSteps(currentSteps => currentSteps.map((step, i) => (i === index ? { ...step, ...updates } : step)));
  };

  const processSteps = async (steps: Step[]) => {
    setIsCompleted(false);
    const directory = localStorage.getItem(BUIDLGUIDL_DIRECTORY_KEY) || "~/buidlguidl-client";
    let currentStep = 0;

    try {
      for (const step of steps) {
        updateStepStatus(currentStep, { status: "running" });
        try {
          const result = await executeCommand(step.command, directory, ens.data || address);
          if (result.error) {
            throw new Error(result.error);
          }
          updateStepStatus(currentStep, {
            status: "completed",
            output: result.output,
          });
        } catch (error) {
          updateStepStatus(currentStep, {
            status: "error",
            output: error instanceof Error ? error.message : "Unknown error",
          });
          throw error;
        }
        currentStep++;
      }
      setIsCompleted(true);
    } catch (error) {
      console.error("Error during execution:", error);
      setIsCompleted(true);
    }
  };

  const handleAction = (action: "update" | "restart" | "start" | "shutdown") => {
    let steps: Step[];
    let title: string;

    switch (action) {
      case "update":
        steps = [...UPDATE_STEPS];
        title = "Updating System";
        break;
      case "restart":
        steps = [...RESTART_STEPS];
        title = "Restarting Services";
        break;

      case "start":
        steps = [...START_STEPS];
        title = "Starting Node";
        break;
      case "shutdown":
        steps = [...SHUTDOWN_STEPS];
        title = "Shutting Down";
        localStorage.removeItem(SETUP_COMPLETED_KEY);
        localStorage.removeItem(SETUP_PROGRESS_KEY);
        //dont redirect immedately
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
        break;
    }

    setCurrentSteps(steps);
    setModalTitle(title);
    setIsModalOpen(true);
    processSteps(steps);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 hidden xl:block">Actions</h2>
      <nav className="flex flex-col space-y-2">
        <button
          onClick={() => handleAction("update")}
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
        >
          <FaSyncAlt className="text-lg" />
          <span className="hidden xl:block">Update</span>
        </button>
        <button
          onClick={() => handleAction("restart")}
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
        >
          <FaRedo className="text-lg" />
          <span className="hidden xl:block">Restart</span>
        </button>
        <button
          onClick={() => handleAction("start")}
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
        >
          <Power className="text-lg" />
          <span className="hidden xl:block">Start</span>
        </button>
        <button
          onClick={() => handleAction("shutdown")}
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors"
        >
          <FaPowerOff className="text-lg rotate-180" />
          <span className="hidden xl:block">Shutdown</span>
        </button>
      </nav>

      <LoadingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        steps={currentSteps}
        isCompleted={isCompleted}
      />
    </div>
  );
};

export default Action;
