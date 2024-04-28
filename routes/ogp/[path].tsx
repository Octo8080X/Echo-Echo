import { Handlers } from "$fresh/server.ts";
import { getRecordOgpImage } from "../../utils/kvstorage.ts";
export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const img = await getRecordOgpImage(ctx.params.path);
      return new Response(img);
    } catch (e) {
      return new Response("Not Found", { status: 404 });
    }
  },
};
