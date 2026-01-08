import dotenv from "dotenv"

dotenv.config()

export default {

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET

};
