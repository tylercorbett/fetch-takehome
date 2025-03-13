export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://frontend-take-home-service.fetch.com";

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn(
    "API_BASE_URL not found in environment variables, using default value"
  );
}
