/**
 * Manual script to run the stale packages check
 * Usage: pnpm run job:stale-packages
 */
import { checkStalePackagesJob } from "./stalePackages.job";

const runManually = async () => {
  console.log("🚀 Running stale packages check manually...\n");

  try {
    await checkStalePackagesJob();
    console.log("✅ Check completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Check failed:", error);
    process.exit(1);
  }
};

void runManually();
