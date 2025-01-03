import { Step } from "~~/types/ssh/step";

const StepDisplay = ({ step }: { step: Step }) => {
  const getStatusIcon = () => {
    switch (step.status) {
      case "pending":
        return "⏳";
      case "running":
        return <span className="loading loading-spinner loading-sm"></span>;
      case "completed":
        return "✅";
      case "error":
        return "❌";
      default:
        return "⏳";
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span>{getStatusIcon()}</span>
        <span className={`font-medium ${step.skip ? "text-base-content/50" : ""}`}>{step.description}</span>
      </div>
      {step.output && <pre className="mt-2 p-2 bg-base-300 rounded-lg text-sm overflow-x-auto">{step.output}</pre>}
    </div>
  );
};

export default StepDisplay;
