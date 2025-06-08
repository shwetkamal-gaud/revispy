import redisClient from "../config/redisConfig";

const OTP_EXPIRATION = 300; // 5 minutes

export const setOtp = async (email: string, otp: string) => {
    await redisClient.setEx(email, OTP_EXPIRATION, otp);
};

export const verifyOtp = async (email: string, otp: string) => {
    const storedOtp = await redisClient.get(email);
    return storedOtp === otp;
};

export const deleteOtp = async (email: string) => {
    await redisClient.del(email);
};
