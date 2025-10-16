import dotenv from 'dotenv';

dotenv.config();

type AppConfig = {
  port: number;
  nodeEnv: string;
}

const config: AppConfig = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
};

export default config;