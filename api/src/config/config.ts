import dotenv from "dotenv";
import type { Options } from "postgres";

dotenv.config();

type AppConfig = {
  port: number;
  nodeEnv: string;
  database: Options<never>;
};

const appConfig: AppConfig = {
  port: Number(process.env.APP_PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  database: {
    host: process.env.DATABASE_HOST ?? "localhost",
    port: Number(process.env.DATABASE_PORT ?? 5432),
    database: process.env.DATABASE_NAME ?? "package_tracker",
    user: process.env.DATABASE_USER ?? "postgres",
    password: process.env.DATABASE_PASSWORD ?? "postgres",
  },
};

export default appConfig;
