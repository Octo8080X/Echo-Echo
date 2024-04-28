import { createOgp } from "./create_ogp.tsx";

interface OgpMessage {
  type: "createOgp";
  id: string;
}
function createOgpMessage(id: string) {
  return {
    type: "createOgp",
    id,
  };
}

export async function callCreateOgp(id: string) {
  const kv = await Deno.openKv();
  await kv.enqueue(createOgpMessage(id), { delay: 3000 });

  kv.listenQueue((msg: OgpMessage) => {
    if (msg.type === "createOgp") {
      createOgp(msg.id);
    }
  });
}
