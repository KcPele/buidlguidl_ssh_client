"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MainContent } from "./MainContent";
import { Sidebar } from "./Sidebar";
import { AlertTriangle, ArrowRight, CheckCircle, Settings } from "lucide-react";
import { SETUP_COMPLETED_KEY } from "~~/lib/helper";

const Ubuntu = () => {
  const [activeSection, setActiveSection] = useState("node-monitor");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const nodeSetupCompleted = localStorage.getItem(SETUP_COMPLETED_KEY);
    if (nodeSetupCompleted) {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="alert alert-warning mb-6">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <h3 className="font-bold text-lg">Setup Incomplete</h3>
              <div className="text-sm">
                Your node setup process needs to be completed before accessing this section.
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-base-200 p-3 rounded-full">
                  <Settings className="h-8 w-8" />
                </div>
                <h2 className="card-title text-2xl">Complete Your Node Setup</h2>
              </div>

              <div className="space-y-6">
                <div className="steps steps-vertical">
                  <div className="step step-primary">Review Requirements</div>
                  <div className="step">Configure Node Settings</div>
                  <div className="step">Verify Connection</div>
                  <div className="step">Complete Setup</div>
                </div>

                <div className="bg-base-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Why is this important?</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Ensures proper node configuration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Validates security settings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Optimizes performance</span>
                    </li>
                  </ul>
                </div>

                <div className="card-actions justify-end">
                  <Link href="/dashboard">
                    <button className="btn btn-primary gap-2">
                      Begin Setup
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-[calc(100vh-4rem)] bg-gray-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <MainContent activeSection={activeSection} />
    </main>
  );
};

export default Ubuntu;
