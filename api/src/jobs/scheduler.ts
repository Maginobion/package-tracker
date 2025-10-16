import type { ScheduledTask } from "node-cron";
import cron from "node-cron";
import { checkStalePackagesJob } from "./stalePackages.job";

export const initializeScheduledJobs = () => {
  console.log("🕐 Initializing scheduled jobs...");

  // Check for stale packages daily at 10 PM (22:00)
  // "0 22 * * *" means: At 22:00 (10 PM) every day
  const stalePackagesTask = cron.schedule(
    "0 22 * * *",
    async () => {
      await checkStalePackagesJob();
    },
    {
      timezone: "America/New_York",
    }
  );

  console.log("✅ Scheduled: Stale packages check - Daily at 10:00 PM");

  if (process.env.RUN_JOBS_ON_STARTUP === "true") {
    console.log("🔄 Running stale packages check on startup...");
    checkStalePackagesJob().catch((error: unknown) => {
      console.error("Error running stale packages check on startup:", error);
    });
  }

  return {
    stalePackagesTask,
  };
};

/**
 * Stop all scheduled jobs
 */
export const stopScheduledJobs = (tasks: {
  stalePackagesTask: ScheduledTask;
}) => {
  console.log("🛑 Stopping scheduled jobs...");
  void tasks.stalePackagesTask.stop();
  console.log("✅ All scheduled jobs stopped");
};
