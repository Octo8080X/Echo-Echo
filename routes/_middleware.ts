import { FreshContext } from "$fresh/server.ts";

import { Hono } from "$hono/mod.ts";
import { swaggerUI } from "@hono/swagger-ui";

// OpenAPI Documentation swaggerUI for development
const app = new Hono();
app.get("/ui", swaggerUI({ url: "http://localhost:8000/api/doc" }));

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  if (
    Deno.env.get("DENO_ENV") === undefined ||
    Deno.env.get("DENO_ENV") === "development"
  ) {
    if (new URLPattern(req.url).pathname === "/ui") {
      return app.fetch(req);
    }
  }

  return await ctx.next();
}
