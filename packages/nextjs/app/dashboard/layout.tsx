"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SERVER_DETAILS_KEY } from "~~/lib/helper";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedDetails = localStorage.getItem(SERVER_DETAILS_KEY);
    if (savedDetails) {
      setIsLoading(false);
    } else {
      router.push("/connection");
    }
  }, []);
  return (
    <div className="bg-base-200">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="p-4 overflow-y-auto">{children}</div>
      )}
    </div>
  );
}
