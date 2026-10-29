import { config } from "dotenv"

config()

interface Config {
    PORT: number;
    NODE_ENV: string;
}

export const ENV_CONFIG: Config = {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV || "development"
}