import Player from "../../islands/Player.tsx";
import { Head } from "$fresh/runtime.ts";

export default function Play({ params }: { params: { id: string } }) {
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@okutann88" />
        <meta name="twitter:title" content="Echo-Echo" />
        <meta
          name="twitter:description"
          content="`Echo-Echo` is a short sound registration service!"
        />
        <meta
          name="twitter:image"
          content={`https://echo-echo.deno.dev/ogp/${params.id}`}
        />
      </Head>
      <div class="px-2 pt-4">
        <Player recodingId={params.id} />
      </div>
    </>
  );
}
