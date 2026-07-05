import "dotenv/config";

export const dbConfig = {
    url: process.env.MONGODB_URI,
};
export const PORT = process.env.PORT || "4050";