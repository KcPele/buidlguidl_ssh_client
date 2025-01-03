import { FiLock } from "react-icons/fi";

const PasswordModal = ({
  isOpen,
  onSubmit,
  onClose,
}: {
  isOpen: boolean;
  onSubmit: (password: string) => void;
  onClose: () => void;
}) => (
  <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
    <div className="modal-box bg-base-100 text-base-content">
      <h3 className="font-bold text-lg mb-4">Enter Sudo Password</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSubmit(formData.get("password") as string);
        }}
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              type="password"
              name="password"
              className="input input-bordered pl-10 w-full"
              placeholder="Enter your sudo password"
              required
            />
          </div>
          <label className="label">
            <span className="label-text-alt text-base-content/70">
              Your password is required for system-level operations
            </span>
          </label>
        </div>
        <div className="modal-action">
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" className="modal-backdrop">
      <button onClick={onClose}>Close</button>
    </form>
  </dialog>
);

export default PasswordModal;
