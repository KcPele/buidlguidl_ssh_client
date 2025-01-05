interface ParsedLog {
  timestamp: string;
  level: string;
  service: string;
  message: string;
  metadata: Record<string, string>;
  raw?: string;
}

export function parseLogLine(line: string): ParsedLog {
  // Handle different log patterns
  const patterns = [
    // Pattern 1: Standard lighthouse log format
    /^(?<timestamp>\w{3} \d{2} \d{2}:\d{2}:\d{2}\.\d{3})\s+(?<level>[A-Z]+)\s+(?<message>.*?)\s+service:\s*(?<service>[\w-]+)/,
    // Pattern 2: Alternative format with bracketed service
    /^(?<timestamp>\w{3} \d{2} \d{2}:\d{2}:\d{2}\.\d{3})\s+(?<level>[A-Z]+)\s+\[(?<service>[\w-]+)\]\s+(?<message>.*)/,
  ];

  let match = null;
  for (const pattern of patterns) {
    match = pattern.exec(line);
    if (match?.groups) break;
  }

  if (!match?.groups) {
    return { raw: line } as ParsedLog;
  }

  const { timestamp, level, message, service } = match.groups;

  // Extract metadata with improved pattern matching
  const metadata: Record<string, string> = {};
  const metadataPattern = /(?<key>\w+):\s*(?<value>[^\s,]+)(?=[,\s]|$)/g;
  let metadataMatch;

  while ((metadataMatch = metadataPattern.exec(message)) !== null) {
    const { key, value } = metadataMatch.groups!;
    if (key && value && key !== "service") {
      metadata[key] = value;
    }
  }

  // Clean message by removing metadata key-value pairs
  const cleanMessage = message
    .replace(/\s*\w+:\s*[^\s,]+(?=[,\s]|$)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    timestamp,
    level,
    service,
    message: cleanMessage,
    metadata,
  };
}
