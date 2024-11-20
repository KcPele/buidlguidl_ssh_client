"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ActiveConnection {
  username: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [connection, setConnection] = useState<ActiveConnection | null>(null);

  useEffect(() => {
    const activeConnection = localStorage.getItem("active_ssh_connection");
    if (!activeConnection) {
      router.push("/");
      return;
    }
    setConnection(JSON.parse(activeConnection));
  }, [router]);

  if (!connection) return null;

  return (
    <div className="bg-base-200">
      <div className="p-4 overflow-y-auto">{children}</div>
    </div>
  );
}
