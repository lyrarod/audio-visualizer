const audio = document.getElementById("audio");
const fileInput = document.getElementById("file");
const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext("2d");
const WIDTH = (canvas.width = window.innerWidth);
const HEIGHT = (canvas.height = window.innerHeight);

let audioCtx = null;
let source = null;
let analyser = null;
let bufferLength = null;
let dataArray = null;
let drawVisual = null;

fileInput.addEventListener("change", () => {
  audio.src = URL.createObjectURL(fileInput.files[0]);
  audio.play();
  audio.loop = true;
  setupAudio(audio);
  draw();
});

function setupAudio(audio) {
  if (audioCtx) return;
  audioCtx = new AudioContext();
  source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 2048;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  analyser.getByteTimeDomainData(dataArray);
}

function draw() {
  drawVisual = requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  // canvasCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
  // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 10;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 3;

    canvasCtx.fillStyle = `hsl(${barHeight}, 50%, 50%)`;
    canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + 5;
  }
}
