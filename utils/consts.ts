export const CONSTS = {
  APP_ENV: Deno.env.get("APP_ENV") || "development",
  ALLOWED_ORIGIN: Deno.env.get("ALLOWED_ORIGIN")!,
  DELETE_DATE: Deno.env.get("DELETE_DATE")!,
};
