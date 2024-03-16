import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { useEffect } from "preact/hooks";
import type { GetPlayRecentRecordingsAppType } from "../utils/api_definition.ts";
import { hc } from "$hono/mod.ts";
const client = hc<GetPlayRecentRecordingsAppType>("/");
function getItem(
  title: string,
  url: string,
  key: string,
  colorCode: string,
): JSX.Element {
  return (
    <a href={url}>
      <div
        class="relative aspect-square items-center justify-center overflow-hidden bg-base-300 transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-105 duration-100"
        style={{ backgroundColor: colorCode }}
        key={key}
      >
        <div class="absolute mt-[40%] ml-4 z-10">
          <p class="text-base-content text-2xl truncate font-semibold">
            {title}
          </p>
        </div>
        <div class="aspect-square mt-[20%] mb-[-20%] ml-[20%] mr-[-20%] hover:animate-spin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            class="fill-neutral-content"
          >
            <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z" />
          </svg>
        </div>
      </div>
    </a>
  );
}
function getLoadingItems(key: string) {
  return (
    <div
      class="aspect-square w-100 bg-base-300 items-center justify-center"
      key={key}
    >
      <div>
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </div>
  );
}

const LOAD_ITEM_COUNT = 12 as const;

export default function RecentRecordings() {
  const [items, setItems] = useState<
    { title: string; url: string; colorCode: string }[]
  >([]);
  const [isLording, setIsLoading] = useState(true);

  useEffect(() => {
    const call = async () => {
      const result = await client.api.records.recent.$get();
      const json = await result.json();

      setItems(json.recordings);
      setIsLoading(false);
    };
    setTimeout(call, 500);
  }, []);

  if (!IS_BROWSER || isLording) {
    return (
      <>
        <div class="pb-2">
          <h2 class="text-3xl font-bold">Recent recordings</h2>
        </div>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: LOAD_ITEM_COUNT }, (_, i) =>
            getLoadingItems(`item-${i}`))}
        </div>
      </>
    );
  }

  return (
    <>
      <div class="pb-6">
        <h2 class="text-3xl font-bold">Recent records</h2>
      </div>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from(
          items,
          (item: { title: string; url: string; colorCode: string }, i) =>
            getItem(item.title, item.url, `item-${i}`, item.colorCode),
        )}
      </div>
    </>
  );
}
