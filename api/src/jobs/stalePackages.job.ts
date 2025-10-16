import { JobLogger } from "./jobLogger";
import { getStalePackagesSummary } from "./stalePackages.service";

/**
 * Job that checks for stale packages
 * This runs daily at 10 PM to identify packages that need attention
 */
export const checkStalePackagesJob = async () => {
  const startTime = Date.now();
  const logger = new JobLogger("stale-packages");

  logger.log(`[${new Date().toISOString()}] Starting stale packages check...`);

  try {
    const summary = await getStalePackagesSummary();

    logger.log(`[${new Date().toISOString()}] Stale packages summary:`);
    logger.log(`  - Threshold: ${summary.thresholdDays} days`);
    logger.log(
      `  - Not shipped or in transit > ${summary.thresholdDays} days: ${summary.notInTransit.count} packages`
    );
    logger.log(
      `  - Same-day returned (not delivered): ${summary.sameDayReturned.count} packages`
    );
    logger.log(`  - Total packages needing attention: ${summary.total}`);

    // Log details of packages not in transit or stuck in transit
    if (summary.notInTransit.count > 0) {
      logger.log(
        `\n📦 Packages not shipped or in transit for more than ${summary.thresholdDays} days:`
      );
      summary.notInTransit.packages.forEach((pkg) => {
        const detail =
          pkg.status === "in_transit"
            ? `shipped: ${pkg.shipped_at}`
            : `created: ${pkg.created_at}`;
        logger.log(
          `  - ${pkg.tracking_number} (status: ${pkg.status}, ${detail})`
        );
      });
    }

    // Log details of same-day returned packages
    if (summary.sameDayReturned.count > 0) {
      logger.log("\n📦 Packages returned same day and still not delivered:");
      summary.sameDayReturned.packages.forEach((pkg) => {
        logger.log(
          `  - ${pkg.tracking_number} (created: ${pkg.created_at}, shipped: ${pkg.shipped_at})`
        );
      });
    }

    const duration = Date.now() - startTime;
    logger.log(
      `[${new Date().toISOString()}] Stale packages check completed in ${duration}ms\n`
    );

    await logger.flush();

    return summary;
  } catch (error) {
    logger.error(
      `[${new Date().toISOString()}] Error checking stale packages:`,
      error
    );

    await logger.flush();

    throw error;
  }
};
