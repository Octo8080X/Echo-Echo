/// <reference lib="deno.unstable" />
import { FreshContext } from "$fresh/server.ts";

export const handler = {
  POST: async (req: Request, _ctx: FreshContext): Promise<Response> => {
    // req から、blobをお取り出す
    const formData = await req.formData();
    const blob = formData.get("file") as Blob;
    const title = formData.get("title") as string;
    console.log(title);

    const file = new Uint8Array(await blob.arrayBuffer());

    let i = 0;
    const splitArray: Uint8Array[] = [];

    while (true) {
      console.log(i);

      if (i + 1024 * 64 < file.length) {
        splitArray.push(new Uint8Array(file.buffer, i, 1024 * 64));
      } else {
        splitArray.push(new Uint8Array(file.buffer, i));
        break;
      }
      i += 1024 * 64;
    }

    console.log(splitArray);

    const kv = await Deno.openKv();

    for (let i = 0; i < splitArray.length; i++) {
      await kv.set(["key1", i], splitArray[i]);
    }

    kv.close();

    console.log("done");

    return new Response("OK", { status: 200 });
  },
  GET: async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    const kv = await Deno.openKv();

    const splitArray: Uint8Array[] = [];

    let length = 0;
    const entries = kv.list({ prefix: ["key1"] });

    for await (const entry of entries) {
      splitArray.push(entry.value as Uint8Array);
      length += (entry.value as Uint8Array).byteLength;
    }

    const arr: Uint8Array = new Uint8Array(length);
    for (let i = 0; i < splitArray.length; i++) {
      arr.set(splitArray[i], i * 1024 * 64);
    }
    console.log(arr);

    return new Response(arr, { status: 200 });
  },
};
