"use client";

import { useEffect, useState } from "react";

interface SSHDetails {
  hostname: string;
  username: string;
  password: string;
  port: string;
}
type localStorageKey = "ssh_details" | "ssh_remember_me";
export function useStorage(key: localStorageKey) {
  const [sshDetails, setSSHDetails] = useState<SSHDetails | null>({
    hostname: "",
    password: "",
    port: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setSSHDetails(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const storeSSHDetails = (details: SSHDetails) => {
    try {
      localStorage.setItem(key, JSON.stringify(details));
      setSSHDetails(details);
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  const clearSSHDetails = () => {
    try {
      localStorage.removeItem(key);
      setSSHDetails(null);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  return {
    sshDetails,
    storeSSHDetails,
    clearSSHDetails,
    isLoading,
  };
}
