//local storage keys

export const SERVER_DETAILS_KEY = "ssh_server_details";
export const BUIDLGUIDL_DIRECTORY_KEY = "buidlguidlDirectory";
export const SETUP_COMPLETED_KEY = "buidlguidlSetupCompleted";
export const SETUP_PROGRESS_KEY = "setupProgress";
export const SSH_REMEMBER_ME_KEY = "ssh_remember_me";
export const DEFAULT_DIRECTORY = "~/buidlguidl-client";
export const CHART_MARGIN = { top: 15, right: 10, left: -18, bottom: 0 };

export const executeCommand = async (
  command: string,
  directory: string,
  address?: string,
  password?: string,
): Promise<{ output?: any; error?: string }> => {
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
    if (response.status !== 200) {
      throw new Error(data.message || "Command execution failed");
    }

    return data;
  } catch (error) {
    return { error: (error as Error).message };
  }
};
