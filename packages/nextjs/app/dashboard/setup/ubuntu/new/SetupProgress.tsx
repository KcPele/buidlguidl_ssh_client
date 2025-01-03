import React from "react";
import { Step } from "~~/types/ssh/step";

const SetupProgress = ({ steps }: { steps: Step[] }) => {
  const totalSteps = steps.length;
  const completedSteps = steps.filter(step => step.status === "completed").length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 dark:bg-base-200 rounded-full h-2 mb-6">
      <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default SetupProgress;
