import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ExistingModal = ({
  isDirectoryModalOpen,
  setIsDirectoryModalOpen,
}: {
  isDirectoryModalOpen: boolean;
  setIsDirectoryModalOpen: (isOpen: boolean) => void;
}) => {
  const [directory, setDirectory] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedDirectory = localStorage.getItem("buildguildDirectory");
    if (savedDirectory) {
      setDirectory(savedDirectory);
    }
  }, []);

  const handleDirectorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalDirectory = directory.trim() || "~/buidlguidl-client";
    localStorage.setItem("buildguildDirectory", finalDirectory);
    setIsDirectoryModalOpen(false);
    router.push("/dashboard/setup/ubuntu/existing");
  };

  return (
    <dialog id="directory_modal" className={`modal ${isDirectoryModalOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Existing Setup Configuration</h3>
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
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setIsDirectoryModalOpen(false)}>Close</button>
      </form>
    </dialog>
  );
};

export default ExistingModal;
