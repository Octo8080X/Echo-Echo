import { useEffect, useState } from "preact/hooks";
import { hc } from "hono/client";
import { AppRoutesType } from "../routes/api/[...path].ts";

const client = hc<AppRoutesType>("/");

export default function Player(props: { recodingId: string }) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [dataInfo, setDataInfo] = useState<{
    title?: string;
    createdAt?: string;
    colorCode?: string;
  }>({
    title: undefined,
    createdAt: undefined,
    colorCode: undefined,
  });
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const call = async () => {
      const result = await client.api.records[":id"].data.$get({
        param: {
          id: props.recodingId,
        },
      });
      const blob = await result.blob();
      setBlob(blob);

      const infoResult = await client.api.records[":id"].info
        .$get(
          {
            param: {
              id: props.recodingId,
            },
          },
        );

      if (!infoResult.ok) {
        return;
      }
      setDataInfo(await infoResult.json());
    };
    call();
  }, []);

  const play = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const audioElement = document.createElement("audio");
    audioElement.id = "audioelement";
    audioElement.src = url;
    audioElement.controls = true;
    audioElement.muted = false;
    audioElement.autoplay = true;
    audioElement.volume = 1;
    audioElement.play();
    setAudio(audioElement);
    setIsPlaying(true);
    audioElement.onended = () => {
      setIsPlaying(false);
    };
  };

  const stop = () => {
    audio?.pause?.();
    setIsPlaying(false);
  };

  return (
    <div>
      <div class="grid grid-cols-1 gap-1 md:grid-cols-2 mb-2">
        <div class="grid grid-flow-row auto-rows-max">
          <button
            onClick={play}
            class={`btn btn-primary hover:opacity-50 text-base-100 mb-4 mx-4 ${
              isPlaying && "btn-disabled"
            }`}
          >
            PLAY
          </button>
          <button onClick={stop}>STOP</button>
        </div>

        <div
          class="relative aspect-square items-center justify-center overflow-hidden bg-base-300 hidden md:inline-block"
          style={{ backgroundColor: dataInfo?.colorCode }}
        >
          <div class="absolute mt-[40%] ml-4 z-10">
            <p class="text-base-content text-2xl truncate font-semibold">
              {dataInfo?.title}
            </p>
          </div>
          <div
            class={`aspect-square mt-[20%] mb-[-20%] ml-[20%] mr-[-20%] ${
              isPlaying ? "animate-spin" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="fill-neutral-content"
            >
              <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="block md:hidden mx-4 mb-4">
        <div
          class="relative aspect-square items-center justify-center overflow-hidden bg-base-300"
          style={{ backgroundColor: dataInfo?.colorCode }}
        >
          <div class="absolute mt-[40%] ml-4 z-10">
            <p class="text-base-content text-2xl truncate font-semibold">
              {dataInfo?.title}
            </p>
          </div>

          <div
            class={`aspect-square mt-[20%] mb-[-20%] ml-[20%] mr-[-20%] ${
              isPlaying ? "animate-spin" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              class="fill-neutral-content"
            >
              <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
