import React, { useEffect, useState, useRef } from "react";

export const AudioVisualizer = ({ analyser }) => {
  const canvasRef = useRef(null);
  const [dataArray, setDataArray] = useState(null);
  const isVisualizing = useRef(false);
  console.log("visualizing");
  useEffect(() => {
    if (analyser) {
      const bufferLength = analyser.frequencyBinCount;
      setDataArray(new Uint8Array(bufferLength));
      isVisualizing.current = true;
    }

    return () => {
      isVisualizing.current = false;
    };
  }, [analyser]);

  useEffect(() => {
    if (dataArray && isVisualizing.current) {
      const canvas = canvasRef.current;
      const canvasContext = canvas.getContext("2d");

      const draw = () => {
        if (!isVisualizing.current) return;

        analyser.getByteFrequencyData(dataArray);

        canvasContext.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / dataArray.length) * 2;
        let barHeight;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          barHeight = dataArray[i];

          canvasContext.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
          canvasContext.fillRect(
            x,
            canvas.height - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth + 1;
        }

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, [dataArray, analyser]);

  return <canvas ref={canvasRef} width="800" height="200"></canvas>;
};
