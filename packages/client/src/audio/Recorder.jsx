import { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import { AudioVisualizer } from "./AudioVisualizer";
import { useMicrophone } from "../context/MicrophoneContext";
import { MicAccess } from "./MicAccess";

export const Recorder = () => {
  const [analyser, setAnalyser] = useState(null);
  const mediaRecorder = useRef(null);
  // const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const mimeType = "audio/webm"; // Adjust the MIME type based on your requirements.
  const [isRecording, setIsRecording] = useState(false);
  const [audioRecordings, setAudioRecordings] = useState([]); // Array to store recorded audio blobs

  const {
    requestMicrophoneAccess,
    permission,
    audioStream: stream,
  } = useMicrophone();

  const startRecording = () => {
    const media = new MediaRecorder(stream, { type: mimeType });
    mediaRecorder.current = media;
    const chunks = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(chunks, { type: mimeType });
      setAudio(audioBlob);
      setAudioRecordings((prevRecordings) => [...prevRecordings, audioBlob]);
    };
    mediaRecorder.current.start();
    setIsRecording(true);

    mediaRecorder.current.onstart = () => {
      // Create the analyser instance after starting the recording
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const microphoneSource = audioContext.createMediaStreamSource(stream);
      microphoneSource.connect(analyser);

      setAnalyser(analyser);
    };
  };
  const stopRecording = () => {
    if (mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    setIsRecording(false);
    setAudio(null);
  };

  const downloadRecording = () => {
    if (audio) {
      const url = URL.createObjectURL(audio);
      console.log(url, " url ");
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "recording.webm"; // Specify the file name.
      // a.click();
      // URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <main>
        <div className="audio-controls">
          {!permission ? (
            <>
              <Button onClick={requestMicrophoneAccess} type="button">
                Connect Microphone
              </Button>
              <MicAccess />
            </>
          ) : !isRecording ? (
            <Button
              fullWidth
              onClick={startRecording}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Start Recording
            </Button>
          ) : (
            <Button onClick={stopRecording} type="button">
              Stop Recording
            </Button>
          )}
          {audio && (
            <Button onClick={downloadRecording} type="button">
              Download Recording
            </Button>
          )}
          {permission && isRecording && analyser && (
            <AudioVisualizer analyser={analyser} />
          )}{" "}
        </div>
        <>
          {audioRecordings.length > 0 && (
            <div>
              <h3>Recordings: </h3>
              {audioRecordings.map((recording, index) => {
                console.log(recording, " recording");
                return (
                  <div key={index}>
                    <audio controls>
                      <source
                        src={URL.createObjectURL(recording)}
                        type={mimeType}
                      />
                    </audio>
                  </div>
                );
              })}
            </div>
          )}
          {/* {audioRecordings.length > 0 && (
            <div>
              <h3>Recordings:</h3>
              {audioRecordings.map((recording, index) => (
                <div key={index}>{recording}</div>
              )}
            </div>
          )} */}
        </>
      </main>
    </div>
  );
};
