import { convertAudioToBase64 } from "./utils.js";

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

const btnVisualizer = document.getElementById("btnVisualizer");

let badges = [];

function addBadge(file) {
  const button = document.createElement("button");
  button.innerText = file.name;
  button.id = String(Date.now());
  document.getElementById("badges").appendChild(button);
  button.classList.add("animation");

  button.addEventListener("click", (e) => {
    e.preventDefault();
    audio.src = file.src;
    audio.play();
    audio.loop = true;
    setupAudio(audio);
    draw();

    btnVisualizer.disabled = false;
  });

  badges.unshift(button);

  // loadBadges();
  return button;
}

function loadBadges() {
  badges?.map((badge) => {
    document.getElementById("badges").appendChild(badge);
  });
}

btnVisualizer.addEventListener("click", (e) => {
  e.preventDefault();
  audio.src = "/assets/audios/never-back-down.ogg";
  audio.play();
  audio.loop = true;
  e.target.disabled = true;
  setupAudio(audio);
  draw();
});

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  // console.log(file);
  const base64 = await convertAudioToBase64(file);
  const badge = addBadge({ name: file.name, src: base64 });
  btnVisualizer.disabled = false;

  audio.src = URL.createObjectURL(file);
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
  requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  // canvasCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
  // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 10;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 2;

    canvasCtx.fillStyle = `hsl(${barHeight}, 50%, 50%)`;
    canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + 5;
  }
}
