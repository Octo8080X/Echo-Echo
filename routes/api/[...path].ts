import { Handler } from "$fresh/server.ts";
import { OpenAPIHono } from "@hono/zod-openapi";
import { getRecording, saveRecording } from "../../utils/kvstorage.ts";
import { getPlayRoute, postRecordingRoute } from "../../utils/api_definition.ts";

const app = new OpenAPIHono();

// POST /api/recording
app.openapi(postRecordingRoute, async (c) => {
  const formData = await c.req.formData();
  const blob = formData.get("file") as Blob;
  const title = formData.get("title") as string;
  const file = new Uint8Array(await blob.arrayBuffer());
  const result = await saveRecording(title, file);
  return c.json({ message: "OK", url: `/play/${result.id}` });
});

app.openapi(getPlayRoute, async (c) => {
  console.log(c);
  const id = c.req.param('id') ;
  const arr = await getRecording(id);

  return c.body(arr);
});

// OpenAPI Documentation for development
if (
  Deno.env.get("DENO_ENV") === undefined ||
  Deno.env.get("DENO_ENV") === "development"
) {
  app.doc("/api/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Echo Echo API",
    },
  });
}

export const handler: Handler = app.fetch;
