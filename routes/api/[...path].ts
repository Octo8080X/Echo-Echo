import { Handler } from "$fresh/server.ts";
import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getRecentRecords,
  getRecord,
  getRecordInfos,
  saveRecord,
  searchRecords,
} from "../../utils/kvstorage.ts";
import {
  getRecordsDataRoute,
  getRecordsInfoRoute,
  getRecordsRecentRoute,
  getRecordsSearchRoute,
  postRecordsRoute,
} from "../../utils/api_definition.ts";
import { CONSTS } from "../../utils/consts.ts";
import { callCreateOgp } from "../../utils/queues.ts";

const MAX_RECENT_RECORDINGS = 12 as const;

const app = new OpenAPIHono();

const appRoutes = app
  // POST /api/recording
  .openapi(postRecordsRoute, async (c) => {
    const formData = await c.req.formData();
    const blob = formData.get("file") as Blob;
    const title = formData.get("title") as string;
    const file = new Uint8Array(await blob.arrayBuffer());
    const result = await saveRecord(title, file);

    await callCreateOgp(result.id);

    return c.json({ message: "OK", url: `/play/${result.id}` });
  })
  // GET /api/records/:id/data
  .openapi(getRecordsDataRoute, async (c) => {
    const id = c.req.param("id");
    const arr = await getRecord(id);

    return c.body(arr);
  })
  // GET /api/records/:id/info
  .openapi(getRecordsInfoRoute, async (c) => {
    const id = c.req.param("id");
    const result = await getRecordInfos(id);

    return c.json(result);
  })
  // GET /api/records/recent
  .openapi(getRecordsRecentRoute, async (c) => {
    const recordings = await getRecentRecords(MAX_RECENT_RECORDINGS);

    return c.json({ recordings });
  })
  // GET //api/records/search
  .openapi(getRecordsSearchRoute, async (c) => {
    const recordings = await searchRecords(c.req.query("q") || "");

    return c.json({ recordings });
  });

// OpenAPI Documentation for development
if (
  CONSTS.APP_ENV === undefined ||
  CONSTS.APP_ENV === "development"
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

export type AppRoutesType = typeof appRoutes;
