import { FreshContext } from "$fresh/server.ts";

import { Hono } from "$hono/mod.ts";
import { swaggerUI } from "@hono/swagger-ui";
import { CONSTS } from "../utils/consts.ts";

// OpenAPI Documentation swaggerUI for development
const app = new Hono();
app.get("/ui", swaggerUI({ url: "http://localhost:8000/api/doc" }));

export async function swaggerUiHandler(
  req: Request,
  ctx: FreshContext,
) {
  if (
    CONSTS.APP_ENV === undefined ||
    CONSTS.APP_ENV === "development"
  ) {
    if (new URLPattern(req.url).pathname === "/ui") {
      return app.fetch(req);
    }
  }

  return await ctx.next();
}
