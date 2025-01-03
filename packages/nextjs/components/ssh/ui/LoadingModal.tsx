import StepDisplay from "../ubuntu/StepDisplay";
import { Step } from "~~/types/ssh/step";

const LoadingModal = ({
  isOpen,
  onClose,
  title,
  steps,
  isCompleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: Step[];
  isCompleted: boolean;
}) => (
  <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
    <div className="modal-box max-w-2xl">
      <h3 className="font-bold text-lg mb-4">{title}</h3>
      <div className="mt-4">
        {steps.map((step, index) => (
          <StepDisplay key={index} step={step} />
        ))}
      </div>
      {isCompleted && (
        <div className="modal-action">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </div>
  </dialog>
);

export default LoadingModal;
