
export const isDevelopment = process.env.NODE_ENV === "development";

export const ORIGIN_URL = isDevelopment
  ? "http://localhost:3000"
  : "https://sommaire-five.vercel.app/";

