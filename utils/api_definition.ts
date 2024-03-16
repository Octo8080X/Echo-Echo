import { createRoute, z } from "@hono/zod-openapi";
export const postRecordingRoute = createRoute({
  method: "post",
  path: "/api/recording",
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
export type PostRecordingAppType = typeof postRecordingRoute;


export const getPlayRoute = createRoute({
    method: "get",
    path: "/api/play/:id",
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
          // バイナリを返す
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
  export type GetPlayAppType = typeof getPlayRoute;
  