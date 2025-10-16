import * as fs from "fs";
import * as path from "path";

export class JobLogger {
  private logFilePath: string;
  private logs: string[] = [];

  constructor(jobName: string) {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const logsDir = path.join(process.cwd(), "logs");

    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    this.logFilePath = path.join(logsDir, `${jobName}-${timestamp}.log`);
  }

  log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;

    // Write to console
    console.log(message);

    // Store in memory
    this.logs.push(logMessage);
  }

  error(message: string, error?: unknown): void {
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    const logMessage = `[${timestamp}] ERROR: ${message}${error ? ` - ${errorMessage}` : ""}`;

    // Write to console
    console.error(message, error);

    // Store in memory
    this.logs.push(logMessage);
  }

  async flush(): Promise<void> {
    try {
      await fs.promises.appendFile(
        this.logFilePath,
        this.logs.join("\n") + "\n"
      );
      console.log(`\n📝 Logs written to: ${this.logFilePath}`);
    } catch (error) {
      console.error("Failed to write logs to file:", error);
    }
  }

  getLogFilePath(): string {
    return this.logFilePath;
  }
}
