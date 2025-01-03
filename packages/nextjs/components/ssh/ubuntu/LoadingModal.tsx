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
    <div className="modal-box max-w-2xl bg-base-100 text-base-content">
      <h3 className="font-bold text-lg mb-4 text-base-content">{title}</h3>
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
    <form method="dialog" className="modal-backdrop">
      <button onClick={onClose}>Close</button>
    </form>
  </dialog>
);

export default LoadingModal;
