import { createRoute, z } from "@hono/zod-openapi";

export const postRecordsRoute = createRoute({
  method: "post",
  path: "/api/records",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z
            .object({
              title: z.string().openapi({
                example: "recording 1",
              }),
              file: z.instanceof(File).or(z.string()).openapi({
                type: "string",
                format: "binary",
              }),
            })
            .openapi({
              required: ["title", "file"],
            }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string().openapi({
              example: "OK",
            }),
            url: z.string().openapi({
              example: "/play/hogehoge",
            }),
          }),
        },
      },
    },
    400: {
      description: "Bad request",
    },
  },
});
export type PostRecordsType = typeof postRecordsRoute;

export const getRecordsDataRoute = createRoute({
  method: "get",
  path: "/api/records/:id/data",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        type: "string",
        example: "hogehogehogehoge",
      }),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/octet-stream": {
          schema: z.instanceof(File).or(z.string()).openapi({
            type: "string",
            format: "binary",
          }),
        },
      },
    },
    400: {
      description: "Bad request",
    },
  },
});
export type GetRecordsDataType = typeof getRecordsDataRoute;

export const getRecordsInfoRoute = createRoute({
  method: "get",
  path: "/api/records/:id/info",
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: "id",
          in: "path",
        },
        type: "string",
        example: "hogehogehogehoge",
      }),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            url: z.string().openapi({
              example: "/play/hogehoge",
            }),
            title: z.string().openapi({
              example: "hogehoge",
            }),
            colorCode: z.string().openapi({
              example: "#FF0000",
            }),
          }).openapi({
            example: {
              url: "/play/hogehoge",
              title: "hogehoge",
              colorCode: "#FF0000",
            },
          }),
        },
      },
    },
    400: {
      description: "Bad request",
    },
  },
});
export type GetRecordsInfoRoute = typeof getRecordsInfoRoute;

export const getRecordsRecentRoute = createRoute({
  method: "get",
  path: "/api/records/recent",
  request: {},
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            recordings: z.array(
              z.object({
                url: z.string().openapi({
                  example: "/play/hogehoge",
                }),
                title: z.string().openapi({
                  example: "hogehoge",
                }),
                colorCode: z.string().openapi({
                  example: "#FF0000",
                }),
              }),
            ).openapi({
              example: [{
                url: "/play/hogehoge",
                title: "hogehoge",
                colorCode: "#FF0000",
              }],
            }),
          }),
        },
      },
    },
    400: {
      description: "Bad request",
    },
  },
});
export type GetRecordsRecentType = typeof getRecordsRecentRoute;

export const getRecordsSearchRoute = createRoute({
  method: "get",
  path: "/api/records/search",
  request: {
    query: z.object({
      q: z.string().openapi({
        param: {
          name: "q",
          in: "query",
        },
        type: "string",
        example: "hogehoge",
      }),
    }),
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: z.object({
            recordings: z.array(
              z.object({
                url: z.string().openapi({
                  example: "/play/hogehoge",
                }),
                title: z.string().openapi({
                  example: "hogehoge",
                }),
                colorCode: z.string().openapi({
                  example: "#FF0000",
                }),
              }),
            ).openapi({
              example: [{
                url: "/play/hogehoge",
                title: "hogehoge",
                colorCode: "#FF0000",
              }],
            }),
          }),
        },
      },
    },
    400: {
      description: "Bad request",
    },
  },
});
export type GetRecordsSearchType = typeof getRecordsSearchRoute;
