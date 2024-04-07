import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html data-theme="winter">
      <head>
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
          content="https://echo-echo.deno.dev/images/og_image.png"
        />
        <title>EchoEcho</title>
        <link rel="stylesheet" href="/styles.css" />
        <script src="https://www.WebRTC-Experiment.com/RecordRTC.js"></script>
      </head>
      <body>
        <div class="px-4 mx-auto min-h-screen bg-base-300">
          <div class="container min-h-screen mx-auto bg-base-100 flex flex-col justify-between">
            <Component />
          </div>
        </div>
      </body>
    </html>
  );
}
