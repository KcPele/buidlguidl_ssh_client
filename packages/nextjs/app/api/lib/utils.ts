interface ParsedLog {
  timestamp: string;
  level: string;
  service: string;
  message: string;
  metadata: Record<string, string>;
  raw?: string;
}

export function parseLogLine(line: string): ParsedLog {
  const patterns = [
    // Standard format with service at end
    /^(?<timestamp>\w{3} \d{2} \d{2}:\d{2}:\d{2}\.\d{3})\s+(?<level>[A-Z]+)\s+(?<message>.*?)(?:,\s+)?service:\s*(?<service>[\w-]+)(?:,\s+service:\s*[\w-]+)*\r?$/,
    // Format with bracketed service
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

  // Extract metadata with support for more value formats
  const metadata: Record<string, string> = {};
  const metadataPattern = /(?<key>\w+):\s*(?<value>(?:"[^"]*")|(?:\[[^\]]*\])|[^\s,]+)(?=[,\s]|$)/g;
  let metadataMatch;

  while ((metadataMatch = metadataPattern.exec(message)) !== null) {
    const { key, value } = metadataMatch.groups!;
    if (key && value && key !== "service") {
      // Clean up quoted values and arrays
      metadata[key] = value.replace(/^["[]|[\]"]$/g, "");
    }
  }

  // Clean message by removing metadata and extra whitespace
  const cleanMessage = message
    .replace(/\s*\w+:\s*(?:"[^"]*"|[^\s,]+)(?=[,\s]|$)/g, "")
    .replace(/\s+/g, " ")
    .replace(/,\s*$/, "")
    .trim();

  return {
    timestamp,
    level,
    service,
    message: cleanMessage,
    metadata,
  };
}
