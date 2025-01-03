export const executeCommand = async (
  command: string,
  directory: string | "~/buidlguidl-client",
  address?: string,
  password?: string,
) => {
  const actualCommand = command
    .replace("$DIRECTORY", directory)
    .replace("$ADDRESS", address || "")
    .replace("$PASSWORD", password || "");

  try {
    const response = await fetch("/api/ssh/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command: actualCommand,
      }),
    });
    const data = await response.json();

    if (data.error) {
      throw new Error(data.message || "Command execution failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
