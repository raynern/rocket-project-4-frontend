export const BACKEND_URL: string =
  process.env.NODE_ENV === "production"
    ? "https://mantraminder-backend.fly.dev"
    : "http://localhost:3000";
