import { useEffect, useRef, useState } from "preact/hooks";
import type { PostRecordsType } from "../utils/api_definition.ts";
import { hc } from "$hono/mod.ts";

const client = hc<PostRecordsType>("/");
declare const RecordRTCPromisesHandler: any;

export default function Recoder() {
  const [recorder, setRecorder] = useState<
    typeof RecordRTCPromisesHandler | null
  >(
    null,
  );
  const [link, setLink] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const isRecording = useRef(false);
  const [count, setCount] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [isRecorded, setIsRecorded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const call = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      const recorder = new RecordRTCPromisesHandler(stream, {
        type: "audio",
        mimeType: "audio/webm",
        bitsPerSecond: 50,
        frameInterval: 50,
        sampleRate: 8000,
        bitrate: 32,
      });
      setRecorder(recorder);
    };
    call();

    return () => {
      if (recorder) {
        recorder.reset();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const startRecording = () => {
    if (!recorder) return;
    if (isRecording.current) return;
    resetOnRecording();

    isRecording.current = true;
    recorder.startRecording();
    setCount(() => 20);
    const rawIntervalId = setInterval(() => {
      setCount((c) => {
        if (c <= 0) {
          clearInterval(rawIntervalId);
          setIntervalId(null);

          stop();
          return 0;
        }
        return c - 1;
      });
      setIntervalId(rawIntervalId);
    }, 1000);
  };

  const stop = async () => {
    if (!recorder) return;
    if (!isRecording.current) return;
    isRecording.current = false;
    setCount(() => 0);
    await recorder.stopRecording();
    openDaialog();
    setIsRecorded(true);
  };

  const openDaialog = () => {
    setIsDialogOpen(true);
    dialogRef.current?.showModal();
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
    dialogRef.current?.close();
  };

  const save = async () => {
    if (!recorder) return;

    let titleError = false;

    if (title == "") {
      titleError = true;
    }
    if (title.length < 3 || title.length > 20) {
      titleError = true;
    }
    if (titleError) {
      setIsError(true);
      return;
    } else {
      setIsError(false);
    }

    const blob = await recorder.getBlob();
    const body = new FormData();
    body.append("file", blob);
    body.append("title", title);
    const result = await client.api.records.$post({
      form: { title: title, file: blob },
    });

    const json = await result.json();
    setLink(json.url);
    resetOnSaved();
  };

  const resetOnRecording = () => {
    setIsRecorded(() => false);
    recorder.reset();
    setTitle(() => "");
    setLink(() => "");
  };

  const resetOnSaved = () => {
    setIsRecorded(() => false);
    recorder.reset();
    setTitle(() => "");
  };

  return (
    <div>
      <div class="grid grid-cols-1 gap-1 md:grid-cols-2">
        <div class="grid grid-flow-row auto-rows-max">
          <button
            onClick={startRecording}
            class={`btn bg-[#FF4444] hover:bg-[#EE4444] text-base-100 mb-4 mx-4 ${
              isRecording.current && "btn-disabled"
            }`}
          >
            {count == 0 ? "REC" : `${count}s`}
          </button>

          <button
            onClick={stop}
            class={`btn bg-[#FF4444] hover:bg-[#EE4444] text-base-100 mb-4 mx-4 ${
              !isRecording.current && "btn-disabled"
            }`}
          >
            STOP
          </button>

          <button
            onClick={openDaialog}
            class={`btn btn-primary text-base-100 mb-4 mx-4 ${
              !isRecorded && "btn-disabled"
            }`}
          >
            SAVE
          </button>

          <div className="card bg-base-200 shadow-xl mx-4 hidden md:inline-block">
            <div className="card-body">
              <h2 className="card-title">Explanation</h2>
              <p class="text-sm text-base-content">
                <ul class="list-inside list-disc">
                  <li>Press the REC button to start recording.</li>
                  <li>It will be up to 20 seconds.</li>
                  <li>You can save it by giving it a name.</li>
                  <li>It will be saved for 1 week.</li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        <div class="relative aspect-square items-center justify-center overflow-hidden bg-base-300 hidden md:inline-block">
          <div
            class={`aspect-square mt-[20%] mb-[-20%] ml-[20%] mr-[-20%] ${
              isRecording.current ? "animate-spin" : ""
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
        <div class="relative aspect-square items-center justify-center overflow-hidden bg-base-300">
          <div
            class={`aspect-square mt-[20%] mb-[-20%] ml-[20%] mr-[-20%] ${
              isRecording.current ? "animate-spin" : ""
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

      <div className="card bg-base-200 shadow-xl inline-block md:hidden mx-4">
        <div className="card-body">
          <h2 className="card-title">Explanation</h2>
          <p class="text-sm text-base-content">
            <ul class="list-inside list-disc">
              <li>Press the REC button to start recording.</li>
              <li>It will be up to 20 seconds.</li>
              <li>You can save it by giving it a name.</li>
              <li>It will be saved for 1 week.</li>
            </ul>
          </p>
        </div>
      </div>

      <dialog className="modal" ref={dialogRef}>
        {isDialogOpen && (
          <div className="modal-box">
            <h3 className="font-bold text-lg mx-auto">
              Please decide on a title.
            </h3>
            <div className="modal-action">
              <div class="grid grid-flow-row auto-rows-max mx-auto">
                <div>
                  <input
                    type="text"
                    id="title"
                    class={`input input-bordered w-full max-w-xs ${
                      isError && "input-error"
                    }`}
                    placeholder="Please decide on a title. "
                    onChange={(e: any) => setTitle(e?.target?.value)}
                  />
                  <div class="label">
                    <span class={`label-text-alt ${isError && "text-error"}`}>
                      min 3 characters max 20 characters
                    </span>
                  </div>
                </div>
                <div class="grid grid-flow-col auto-col-max  grid-cols-1 gap-3 mx-auto">
                  <button class="btn btn-primary" onClick={save}>SAVE</button>
                  <button class="btn" onClick={closeDialog}>
                    CLOSE
                  </button>
                </div>
                <div>
                  {link && (
                    <a href={link} class="text-primary">
                      <p>Success, Go Play!</p>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
