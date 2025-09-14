import dotenv from "dotenv";

dotenv.config();

/**
 * Centralized configuration loader.
 * Reads environment variables and normalizes them into a typed config object.
 */
export const config = {
  port: process.env.PORT,
  mongoDb: {
    uri: process.env.MONGO_DB_URI,
  },
  jwt:{
    secret:process.env.JWT_SECRET,
    expiry:process.env.JWT_EXPIRES_IN
  }
};
