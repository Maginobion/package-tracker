import cors from "cors";
import express from "express";
import config from "./config/config";
import healthRoutes from "./health/health.routes";
import { errorHandler } from "./middlewares/errorHandler";
import packagesRoutes from "./packages/packages.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/packages", packagesRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
