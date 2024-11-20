"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ActiveConnection {
  host: string;
  username: string;
  port: string;
  connectedAt: string;
}

export default function ConnectionDetails() {
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
    <div className="max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Connection Details</h2>
          <div className="mt-4">
            <div className="bg-base-200 p-4 rounded-lg">
              <p>
                <span className="font-semibold">Host:</span> {connection.host}
              </p>
              <p>
                <span className="font-semibold">User:</span> {connection.username}
              </p>
              <p>
                <span className="font-semibold">Port:</span> {connection.port}
              </p>
              <p>
                <span className="font-semibold">Connected at:</span> {new Date(connection.connectedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
