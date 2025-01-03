export type Step = {
  command: string;
  description: string;
  output?: string;
  status: "pending" | "running" | "completed" | "error";
  skip?: boolean;
};
