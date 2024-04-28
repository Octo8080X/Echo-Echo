/// <reference lib="deno.unstable" />
import { ulid } from "$std/ulid/mod.ts";
import { getFormatTime } from "./time.ts";
import randomcolor from "randomcolor";

const RECODING_DATA_KEY = "recording_data" as const;
const RECODING_INFO_KEY = "recording_info" as const;
const RECODING_OGP_IMAGE_KEY = "recording_ogp_image" as const;
const RECODING_CREATED_AT_KEY = "recording_created_at" as const;

function splitUint8Array(src: Uint8Array): Uint8Array[] {
  const result: Uint8Array[] = [];
  let i = 0;
  // データ本体は8分割まで許容する
  let count = 0;
  while (count < 10) {
    if (count > 9) {
      throw new Error("The saved data is too long");
    }

    if (i + 1024 * 64 < src.length) {
      result.push(new Uint8Array(src.buffer, i, 1024 * 64));
    } else {
      result.push(new Uint8Array(src.buffer, i));
      break;
    }
    i += 1024 * 64;
    count++;
  }
  return result;
}

export async function saveRecord(
  title: string,
  file: Uint8Array,
): Promise<{ id: string }> {
  const splitArray = splitUint8Array(file);
  const date = new Date();
  console.log("date: ", date);
  const id = ulid(date.getTime());
  const createdAt = getFormatTime(date);

  const kv = await Deno.openKv();

  const infoData = await kv.get([RECODING_INFO_KEY, id]);
  if (infoData.value) {
    throw new Error("Recording already exists");
  }

  const atomic = kv.atomic()
    .check(infoData);

  for (let i = 0; i < splitArray.length; i++) {
    atomic.set([RECODING_DATA_KEY, id, i], splitArray[i]);
  }
  atomic.set([RECODING_INFO_KEY, id], {
    title,
    id,
    createdAt,
    colorCode: randomcolor({ luminosity: "light" }),
  });

  atomic.set([
    RECODING_CREATED_AT_KEY,
    createdAt.slice(0, 10),
    id,
  ], 0);

  const result = await atomic.commit();

  if (!result.ok) {
    throw new Error("Failed to save recording data");
  }

  kv.close();

  return { id };
}

export async function getRecord(id: string): Promise<Uint8Array> {
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

export async function searchRecords(q: string): Promise<
  { url: string; title: string; colorCode: string }[]
> {
  const kv = await Deno.openKv();

  const entries = kv.list<
    { title: string; id: string; createdAt: string; colorCode: string }
  >({
    prefix: [RECODING_INFO_KEY],
  }, {
    reverse: true,
  });
  const result = [];
  for await (const entry of entries) {
    const v = entry.value;
    if (v.title.includes(q)) {
      result.push({
        url: `/play/${v.id}`,
        title: v.title,
        colorCode: v?.colorCode,
      });
    }
  }
  kv.close();
  return result;
}

export async function getRecentRecords(
  max: number,
): Promise<{ url: string; title: string; colorCode: string }[]> {
  const kv = await Deno.openKv();
  const entries = kv.list<
    { title: string; id: string; createdAt: string; colorCode: string }
  >({
    prefix: [RECODING_INFO_KEY],
  }, {
    reverse: true,
  });
  const result = [];
  for await (const entry of entries) {
    const v = entry.value;
    result.push({
      url: `/play/${v.id}`,
      title: v.title,
      colorCode: v?.colorCode,
    });
    if (result.length >= max) {
      break;
    }
  }
  kv.close();
  return result;
}

export async function getRecordInfos(id: string): Promise<{
  title: string;
  createdAt: string;
  colorCode: string;
}> {
  const kv = await Deno.openKv();
  const result = await kv.get<{
    title: string;
    createdAt: string;
    colorCode: string;
  }>([RECODING_INFO_KEY, id]);
  kv.close();

  if (!result || !result.value) {
    throw new Error("Recording not found");
  }

  return {
    title: result.value.title,
    createdAt: result.value.createdAt,
    colorCode: result.value.colorCode,
  };
}

export async function getRecordOgpImage(id: string): Promise<ArrayBuffer> {
  const kv = await Deno.openKv();
  const result = await kv.get<ArrayBuffer>([RECODING_OGP_IMAGE_KEY, id]);
  kv.close();

  if (!result || !result.value) {
    throw new Error("Recording not found");
  }

  return result.value;
}

export async function setRecordOgpImage(
  id: string,
  img: Uint8Array,
): Promise<boolean> {
  const kv = await Deno.openKv();
  const result = await kv.set([RECODING_OGP_IMAGE_KEY, id], img);
  kv.close();

  return result.ok;
}

export async function deleteByDate(date: string): Promise<void> {
  const kv = await Deno.openKv();

  const results = await kv.list<string>({
    start: [RECODING_CREATED_AT_KEY, "0000-00-00"],
    end: [RECODING_CREATED_AT_KEY, date],
  });

  const deleteKeys: Deno.KvKey[] = [];
  for await (const entry of results) {
    deleteKeys.push(entry.key);
  }

  for (const key of deleteKeys) {
    console.info("delete key: ", key);
    const atomic = kv.atomic();
    const entries = await kv.list({ prefix: [RECODING_DATA_KEY, key[2]] });
    for await (const entry of entries) {
      atomic.delete(entry.key);
    }
    atomic.delete([RECODING_INFO_KEY, key[2]]);
    atomic.delete([RECODING_OGP_IMAGE_KEY, key[2]]);
    atomic.delete(key);
    await atomic.commit();
  }

  kv.close();
}
