import postgres from "postgres";
import appConfig from "./config";

const pgsql = postgres(appConfig.database);

export default pgsql;
