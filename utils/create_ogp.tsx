import satori from "npm:satori";
import * as svg2png from "npm:svg2png-wasm";

await svg2png.initialize(
  await fetch("https://unpkg.com/svg2png-wasm/svg2png_wasm_bg.wasm"),
);
import { getRecordInfos, setRecordOgpImage } from "./kvstorage.ts";

const fontBufferArray = new Uint8Array(
  await (
    await fetch(
      new URL(
        "https://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Thin.otf",
        import.meta.url,
      ).toString(),
    )
  ).arrayBuffer(),
);

export async function createOgp(id: string) {
  console.log(`[START createOgp] id: ${id}`);

  const info = await getRecordInfos(id);

  const title = info.title.length > 10
    ? info.title.slice(0, 10) + "..."
    : info.title;

  const svg = await satori(
    <div
      style={{
        backgroundColor: info.colorCode,
        width: 1200,
        height: 630,
        display: "flex",
      }}
    >
      <div
        style={{
          color: "gray",
          width: 1000,
          height: 200,
          display: "flex",
          position: "absolute",
          marginLeft: "50px",
          marginTop: "10px",
        }}
      >
        <p
          style={{
            fontSize: "40px",
            fontFamily: "Bold Noto Sans JP",
            fontWeight: 100,
            fontStyle: "bold",
            color: "gray",
          }}
        >
          Echo-Echo
        </p>
      </div>

      <div
        style={{
          color: "gray",
          width: 1000,
          height: 200,
          display: "flex",
          position: "absolute",
          marginLeft: "200px",
          marginTop: "200px",
        }}
      >
        <p
          style={{
            fontSize: "140px",
            fontFamily: "Bold Noto Sans JP",
            fontWeight: 100,
            fontStyle: "bold",
            color: "oklch(41.8869% 0.053885 255.824911 / 1)",
          }}
        >
          {title}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-800 -230 1200 630"
        >
          <path
            style={{
              fill: "gray",
            }}
            d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z"
          />
        </svg>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto",
          data: fontBufferArray,
          weight: 100,
          style: "normal",
        },
      ],
    },
  );

  const convert_options: svg2png.ConverterOptions = {
    fonts: [fontBufferArray],
    defaultFontFamily: {
      sansSerifFamily: "Noto Sans JP",
    },
  };

  const png = await svg2png.svg2png(svg, convert_options);

  setRecordOgpImage(id, png);
}
