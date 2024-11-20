"use client";

import { FaApple } from "react-icons/fa";

export default function MacSetup() {
  return (
    <div className=" p-4 ">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6 items-center text-center">
            <FaApple className="w-16 h-16 md:w-20 md:h-20 text-secondary mb-4" />
            <h2 className="card-title text-2xl md:text-3xl mb-3">MacOS Support Coming Soon!</h2>
            <p className="text-sm md:text-base mb-4">
              We're currently developing a native MacOS experience for node setup.
            </p>
            <div className="space-y-3 text-left w-full max-w-md">
              <h3 className="text-lg font-semibold">Planned features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Native M1/M2 chip support</li>
                <li>Homebrew integration</li>
                <li>MacOS-optimized performance</li>
                <li>Seamless terminal integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
