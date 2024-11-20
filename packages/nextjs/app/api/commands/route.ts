import { NextResponse } from "next/server";
import { Client } from "ssh2";

interface CommandRequest {
  command: string;
  host: string;
  username: string;
  password: string;
  port: string;
}

export async function POST(req: Request) {
  try {
    const { command, host, username, password, port }: CommandRequest = await req.json();

    return new Promise(resolve => {
      const sshClient = new Client();
      let output = "";
      let error = "";

      sshClient
        .on("ready", () => {
          sshClient.exec(command, (err, stream) => {
            if (err) {
              sshClient.end();
              resolve(NextResponse.json({ error: err.message }, { status: 500 }));
              return;
            }

            stream
              .on("data", (data: Buffer) => {
                output += data.toString();
              })
              .stderr.on("data", (data: Buffer) => {
                error += data.toString();
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
                        success: true,
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
          host,
          port: parseInt(port),
          username,
          password,
          readyTimeout: 30000,
        });
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to execute command" }, { status: 500 });
  }
}
