import { useState, useRef, useEffect } from "react";
// import { Web3StorageProvider, useWeb3Storage } from "./web3StorageContext";
import Button from "@mui/material/Button";
import { AudioVisualizer } from "./AudioVisualizer";

// import { AudioRecorder } from "react-audio-voice-recorder";
const mimeType = "audio/webm";

const MicrophoneAccess = () => {
  return navigator.mediaDevices.getUserMedia !== null;
};

export const AudioRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [stream, setStream] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const mediaRecorder = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const mimeType = "audio/webm"; // Adjust the MIME type based on your requirements.
  const [isRecording, setIsRecording] = useState(false);

  const getMicrophonePermission = async () => {
    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      setPermission(true);
      setStream(streamData);
    } catch (err) {
      alert(err.message);
    }
  };

  const startRecording = () => {
    const media = new MediaRecorder(stream, { type: mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
      }
    };
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudio(audioBlob);
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

      // Pass the analyser instance to the AudioVisualizer component
      setAnalyser(analyser);

      // Start the visualization
      setIsVisualizing(true);
    };
  };

  const stopRecording = () => {
    if (mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    setIsRecording(false);
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
      <h2>Audio Recorder</h2>
      <main>
        <div className="audio-controls">
          {!permission ? (
            <Button onClick={getMicrophonePermission} type="button">
              Get Microphone
            </Button>
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
      </main>
    </div>
  );
};

// const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;

// export const AudioRecorder = () => {
//   const [recordings, setRecordings] = useState([]);
//   const [audioName, setAudioName] = useState("");

//   const handleRecordingComplete = (audioData) => {
//     const newRecording = { audioData, name: audioName };
//     setRecordings([...recordings, newRecording]);
//     setAudioName(""); //reset input
//   };

//   return (
//     <Web3StorageProvider accessToken={ACCESS_TOKEN}>
//       <div>
//             <AudioRecorder
//               onRecordingComplete={handleRecordingComplete}
//               audioTrackConstraints={{
//                 noiseSuppression: true,
//                 echoCancellation: true,
//               }}
//               downloadOnSavePress={false}
//               showVisualizer={true}
//               downloadFileExtension="mp3"
//             />
//       </div>
//     </Web3StorageProvider>
//   );
// };
