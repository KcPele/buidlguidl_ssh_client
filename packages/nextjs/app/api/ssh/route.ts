import { NextResponse } from "next/server";
import { Client } from "ssh2";

interface SSHConnectionDetails {
  host: string;
  username: string;
  password: string;
  port: string;
}

export async function POST(req: Request) {
  try {
    const connectionDetails: SSHConnectionDetails = await req.json();

    return new Promise(resolve => {
      const sshClient = new Client();
      let output = "";
      let error = "";

      sshClient
        .on("ready", () => {
          // Execute a test command to verify connection
          sshClient.exec("whoami", (err, stream) => {
            if (err) {
              sshClient.end();
              resolve(NextResponse.json({ error: err.message }, { status: 500 }));
              return;
            }

            stream
              .on("data", (data: Buffer) => {
                output += data.toString();
              })
              .on("error", (err: Error) => {
                error = err.message;
              })
              .on("close", () => {
                sshClient.end();
                if (error) {
                  resolve(NextResponse.json({ error }, { status: 500 }));
                } else {
                  resolve(
                    NextResponse.json(
                      {
                        output,
                        message: "SSH Connection successful",
                      },
                      { status: 200 },
                    ),
                  );
                }
              });
          });
        })
        .on("error", err => {
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        })
        .connect({
          host: connectionDetails.host,
          port: parseInt(connectionDetails.port),
          username: connectionDetails.username,
          password: connectionDetails.password,
          readyTimeout: 30000,
          debug: (debug: string) => console.log("SSH Debug:", debug),
        });
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to establish SSH connection" }, { status: 500 });
  }
}
