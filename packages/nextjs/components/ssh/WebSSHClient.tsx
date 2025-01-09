"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal } from "lucide-react";
import {
  BUIDLGUIDL_DIRECTORY_KEY,
  SERVER_DETAILS_KEY,
  SETUP_COMPLETED_KEY,
  SETUP_PROGRESS_KEY,
  SSH_REMEMBER_ME_KEY,
} from "~~/lib/helper";

interface ServerDetails {
  host: string;
  username: string;
  password: string;
  port: string;
}

const WebSSHClient = () => {
  const router = useRouter();
  const [serverDetails, setServerDetails] = useState<ServerDetails>({
    host: "",
    username: "",
    password: "",
    port: "22",
  });
  const [error, setError] = useState("");
  const [output, setOutput] = useState<{
    success: boolean;
    error?: string;
    message: string;
  }>({
    success: false,
    error: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved details and remember me preference on mount
  useEffect(() => {
    const savedDetails = localStorage.getItem(SERVER_DETAILS_KEY);
    const savedRememberMe = localStorage.getItem(SSH_REMEMBER_ME_KEY);
    if (savedDetails) {
      try {
        const parsed = JSON.parse(savedDetails);
        setServerDetails(prev => ({
          ...prev,
          host: parsed.host || "",
          username: parsed.username || "",
          port: parsed.port,
          // Don't load password
        }));
      } catch (e) {
        console.error("Failed to parse saved server details");
      }
    }
    if (savedRememberMe) {
      setRememberMe(savedRememberMe === "true");
    }
  }, [router]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOutput({
      success: false,
      error: "",
      message: "",
    });

    if (!serverDetails.host || !serverDetails.username || !serverDetails.password) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ssh/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serverDetails),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to connect");
      }

      setOutput(data);

      localStorage.setItem(SERVER_DETAILS_KEY, JSON.stringify(serverDetails));
      if (rememberMe) {
        localStorage.setItem(SSH_REMEMBER_ME_KEY, "true");
      }
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServerDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearSavedData = () => {
    setError("");
    localStorage.removeItem(SERVER_DETAILS_KEY);
    localStorage.removeItem(SSH_REMEMBER_ME_KEY);
    setRememberMe(false);
    localStorage.removeItem(SETUP_COMPLETED_KEY);
    localStorage.removeItem(BUIDLGUIDL_DIRECTORY_KEY);
    localStorage.removeItem(SETUP_PROGRESS_KEY);
    setServerDetails({
      host: "",
      username: "",
      password: "",
      port: "22",
    });
  };

  return (
    <div className=" bg-base-200 p-4">
      <div className="max-w-md mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-6 h-6" />
                <h2 className="card-title">SSH Client</h2>
              </div>
              <button onClick={handleClearSavedData} className="btn btn-ghost btn-sm">
                Clear Saved Data
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Server IP/Hostname</span>
                </label>
                <input
                  type="text"
                  name="host"
                  value={serverDetails.host}
                  onChange={handleInputChange}
                  placeholder="example.com or 192.168.1.1"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={serverDetails.username}
                  onChange={handleInputChange}
                  placeholder="username"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={serverDetails.password}
                  onChange={handleInputChange}
                  placeholder="password"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Port</span>
                </label>
                <input
                  type="text"
                  name="port"
                  value={serverDetails.port}
                  onChange={handleInputChange}
                  placeholder="22"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Remember server details</span>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="checkbox checkbox-primary"
                  />
                </label>
                <span className="text-xs text-gray-500 mt-1">Note: Password will not be saved</span>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? "Connecting..." : "Connect"}
              </button>
            </form>

            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            {output.error && (
              <div className="mt-4 p-4 bg-black text-green-400 rounded-lg font-mono min-h-[100px] overflow-y-auto">
                <pre>{output.error}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSSHClient;
