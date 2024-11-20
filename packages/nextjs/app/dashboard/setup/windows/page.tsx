"use client";

import { FaWindows } from "react-icons/fa";

export default function WindowsSetup() {
  return (
    <div className=" p-4">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6 items-center text-center">
            <FaWindows className="w-16 h-16 md:w-20 md:h-20 text-info mb-4" />
            <h2 className="card-title text-2xl md:text-3xl mb-3">Windows Support Coming Soon!</h2>
            <p className="text-sm md:text-base mb-4">
              We're working hard to bring you a seamless node setup experience for Windows.
            </p>
            <div className="space-y-3 text-left w-full max-w-md">
              <h3 className="text-lg font-semibold">What to expect:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Native Windows support</li>
                <li>PowerShell integration</li>
                <li>Automated dependency management</li>
                <li>Windows-specific optimizations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
