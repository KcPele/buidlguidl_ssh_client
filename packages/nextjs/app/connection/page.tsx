"use client";

import { AlertCircle, Shield, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import WebSSHClient from "~~/components/ssh/WebSSHClient";

export default function ConnectionDetails() {
  const { address } = useAccount();

  if (!address) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="alert alert-error">
            <AlertCircle className="h-5 w-5" />
            <div>
              <h3 className="font-bold">Authentication Required</h3>
              <div className="text-sm">Please connect your wallet to access node setup functionality.</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="bg-base-200 p-3 rounded-full">
                <Wallet className="h-8 w-8" />
              </div>

              <h2 className="card-title">Wallet Connection Required</h2>

              <p className="text-base-content/80">
                To ensure secure access and management of your nodes, we require wallet authentication. This helps
                protect your node infrastructure and ensures only authorized users can make changes.
              </p>

              <div className="flex items-center gap-2 text-sm text-base-content/70 mt-4">
                <Shield className="h-4 w-4" />
                <span>Secure Authentication</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <WebSSHClient />;
}
