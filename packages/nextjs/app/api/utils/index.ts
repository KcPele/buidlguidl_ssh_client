export function parseLogLine(line: string) {
  const logPattern =
    /(?<timestamp>\w{3} \d{2} \d{2}:\d{2}:\d{2}\.\d{3})\s+(?<level>[A-Z]+)\s+(?<message>.*?)\s+service:\s*(?<service>\w+)/;

  const match = logPattern.exec(line);

  if (match?.groups) {
    const { timestamp, level, message, service } = match.groups;

    // Extract metadata (key-value pairs) from the message
    const metadata: Record<string, string> = {};
    const metadataMatches = message.matchAll(/(\w+):\s*([\w\.\-\/\[\]:]+)/g);

    for (const [, key, value] of metadataMatches) {
      metadata[key] = value;
    }

    return {
      timestamp,
      level,
      service,
      message: message
        .split(" ")
        .filter(word => !word.includes(":"))
        .join(" "), // Clean message text
      metadata,
    };
  }

  return { raw: line }; // If parsing fails, return the raw line
}
