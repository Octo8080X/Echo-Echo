//import Uppy from 'npm:/@uppy/core';
////import Dashboard from 'npm:/@uppy/dashboard';
//import Audio from 'npm:/@uppy/audio';
import { useEffect, useRef, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { PostRecordingAppType } from "../utils/api_definition.ts";
import { hc } from "$hono/mod.ts";
const client = hc<PostRecordingAppType>("/");

export default function Recoder(props: {}) {
  if (!IS_BROWSER) {
    return <div>recoder</div>;
  }

  const [recorder, setRecorder] = useState(null);
  const [link, setLink] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const call = async () => {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      let recorder = new RecordRTCPromisesHandler(stream, {
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
  }, []);

  const rec = async () => {
    if (!recorder) return;
    console.log("recording");
    recorder.startRecording();
  };
  const stop = async () => {
    if (!recorder) return;
    console.log("stopping");
    await recorder.stopRecording();
    let blob = await recorder.getBlob();
    //invokeSaveAsDialog(blob);
    dialogRef.current.showModal();
  };
  const save = async () => {
    if (!recorder) return;
    console.log("stopping");
    const blob = await recorder.getBlob();
    const body = new FormData();
    body.append("file", blob);
    body.append("title", "東京");
    const result = await client.api.recording.$post({
      form: { title: "recording 1", file: blob },
    });

    const json = await result.json();
    console.log(json);
    setLink(json.url);
  };

  return (
    <div class="flex gap-8 py-6">
      audio
      <div id="rbody"></div>
      <button onClick={rec}>REC</button>
      <button onClick={stop}>STOP</button>
      <a href="/play">PLAY LINK</a>

      {/*<button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button>*/}
      <dialog id="my_modal_1" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">

            <button class="btn" onClick={save}>SAVE</button>
            {link && <a href={link}>PLAY {link}</a>}
            <button class="btn" onClick={ () => dialogRef.current.close() }>Close</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
