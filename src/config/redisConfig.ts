import { createClient } from "redis";

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis Cloud!");
    } catch (err) {
        console.error("Redis connection failed:", err);
    }
};

connectRedis();

export default redisClient;
