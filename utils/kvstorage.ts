import { ulid } from "$std/ulid/mod.ts";
import { getFormatTime } from "./time.ts";

const RECODING_DATA_KEY = "recording_data" as const;
const RECODING_INFO_KEY = "recording_info" as const;

export async function saveRecording(
  title: string,
  file: Uint8Array,
): Promise<{ id: string }> {
  const date = new Date();
  const id = ulid(date.getTime());
  const createdAt = getFormatTime(date);

  let i = 0;
  const splitArray: Uint8Array[] = [];

  while (true) {
    if (i + 1024 * 64 < file.length) {
      splitArray.push(new Uint8Array(file.buffer, i, 1024 * 64));
    } else {
      splitArray.push(new Uint8Array(file.buffer, i));
      break;
    }
    i += 1024 * 64;
  }

  const kv = await Deno.openKv();

  for (let i = 0; i < splitArray.length; i++) {
    const result = await kv.set([RECODING_DATA_KEY, id, i], splitArray[i]);
    if (!result) {
      throw new Error("Failed to save recording data");
    }
  }
  const result = await kv.set([RECODING_INFO_KEY, id], {
    title,
    id,
    createdAt,
  });
  if (!result) {
    throw new Error("Failed to save recording data");
  }

  kv.close();

  return { id };
}

export  async function getRecording(id: string): Promise<Uint8Array> {
  const kv = await Deno.openKv();

  const splitArray: Uint8Array[] = [];

  let length = 0;
  const entries = kv.list({ prefix: [RECODING_DATA_KEY, id] });

  for await (const entry of entries) {
    splitArray.push(entry.value as Uint8Array);
    length += (entry.value as Uint8Array).byteLength;
  }

  const arr: Uint8Array = new Uint8Array(length);
  for (let i = 0; i < splitArray.length; i++) {
    arr.set(splitArray[i], i * 1024 * 64);
  }

  kv.close();

  return arr;
}

export  async function getRecordingList(): Promise<{id:string, title:string}[]> {
    const kv = await Deno.openKv();
  
    const entries = kv.list<{title:string, id:string, createdAt: string }>({ prefix: [RECODING_INFO_KEY]});
    const result = [];
    for await (const entry of entries) {
      const v = entry.value;
      result.push({id: v.id, title: v.title});
    }
    kv.close();
    return result;
  }
  
