import { createOgp } from "./create_ogp.tsx";

const kv = await Deno.openKv();

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
  await kv.enqueue(createOgpMessage(id), { delay: 3000 });
}

export function listenQueue() {
  console.log("[START listenQueue]");
  kv.listenQueue((msg: OgpMessage) => {
    if (msg.type === "createOgp") {
      createOgp(msg.id);
    }
  });
}
