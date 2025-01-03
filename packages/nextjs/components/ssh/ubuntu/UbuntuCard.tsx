"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExistingModal from "./ExistingModal";
import { FaUbuntu } from "react-icons/fa";
import { SETUP_COMPLETED_KEY } from "~~/lib/helper";

const UbuntuCard = () => {
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const setupStatus = localStorage.getItem(SETUP_COMPLETED_KEY);
    setIsSetupCompleted(setupStatus === "true");
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isSetupCompleted) {
      router.push("/dashboard/setup/ubuntu");
    } else {
      setIsSetupModalOpen(true);
    }
  };

  const handleSetupChoice = (type: string) => {
    setIsSetupModalOpen(false);
    if (type === "existing") {
      setIsDirectoryModalOpen(true);
    } else {
      router.push("/dashboard/setup/ubuntu/new");
    }
  };

  return (
    <>
      <div onClick={handleCardClick} className="transition-transform hover:scale-105">
        <div className="card bg-base-200 hover:bg-primary hover:bg-opacity-10 cursor-pointer">
          <div className="card-body p-4 items-center text-center">
            <FaUbuntu className="w-12 h-12 md:w-14 md:h-14 mb-3 text-primary" />
            <h3 className="card-title text-lg mb-2">Ubuntu Setup</h3>
            <p className="text-xs md:text-sm mb-3">Complete node setup for Ubuntu with automated installation.</p>
            <div className="badge badge-success">Available Now</div>
          </div>
        </div>
      </div>

      {/* Setup Choice Modal - Only render if setup is not completed */}
      {!isSetupCompleted && (
        <dialog id="setup_modal" className={`modal ${isSetupModalOpen ? "modal-open" : ""}`}>
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Choose Setup Type</h3>
            <div className="flex flex-col gap-4">
              <button className="btn btn-primary" onClick={() => handleSetupChoice("new")}>
                New Setup
              </button>
              <button className="btn btn-secondary" onClick={() => handleSetupChoice("existing")}>
                Existing Setup
              </button>
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setIsSetupModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsSetupModalOpen(false)}>Close</button>
          </form>
        </dialog>
      )}

      <ExistingModal isDirectoryModalOpen={isDirectoryModalOpen} setIsDirectoryModalOpen={setIsDirectoryModalOpen} />
    </>
  );
};

export default UbuntuCard;
