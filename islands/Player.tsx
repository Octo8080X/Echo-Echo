import { useEffect, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { GetPlayAppType } from "../utils/api_definition.ts";
import { hc } from "$hono/mod.ts";
const client = hc<GetPlayAppType>("http://localhost:8000/");
export default function Player(props: { recodingId: string }) {
  if (!IS_BROWSER) {
    return <div>Player</div>;
  }

  const [blob, setBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const call = async () => {
      console.log(
        client.api.play[':id'].$url({
          param: { id: props.recodingId },
        }).pathname
      );
      const result = await fetch(client.api.play[':id'].$url({
        param: { id: props.recodingId },
      }).pathname);
      const blob = await result.blob();
      console.log("LOAD");
      setBlob(blob);
    };
    call();
  }, []);

  const play = async () => {
    if (!blob) return;
    console.log("playing");
    let url = URL.createObjectURL(blob);
    let audioElement = document.createElement("audio");
    audioElement.id = "audioelement";
    audioElement.src = url;
    audioElement.controls = true;
    audioElement.muted = false;
    audioElement.autoplay = true;
    audioElement.volume = 1;
    audioElement.play();
  };

  return (
    <div class="flex gap-8 py-6">
      audio[{props.recodingId}]
      <div id="rbody"></div>
      <button onClick={play}>PLAY</button>
      <a href="/">REC LINK</a>
    </div>
  );
}
