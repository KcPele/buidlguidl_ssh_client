import { FiCheck, FiLoader, FiTerminal, FiX } from "react-icons/fi";

const StepIndicator = ({ status }: { status: string }) => {
  switch (status) {
    case "running":
      return <FiLoader className="animate-spin text-primary" />;
    case "completed":
      return <FiCheck className="text-success" />;
    case "error":
      return <FiX className="text-error" />;
    default:
      return <FiTerminal className="text-base-content/50" />;
  }
};

export default StepIndicator;
