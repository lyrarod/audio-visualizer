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
let bw = null;
let bh = null;
let gap = null;

const btnFile = document.getElementById("btnFile");
const btnVisualizer = document.getElementById("btnVisualizer");
const labelFile = document.getElementById("labelFile");
const fileContainer = document.getElementById("fileContainer");
const line = document.getElementById("line");
const planet = document.getElementById("planet");

const mediaQueryList = window.matchMedia(`(width <= 700px)`);

const handleChange = ({ matches }) => {
  if (matches) {
    // console.log("Mobile");
    bw = 40;
    bh = 1.5;
    gap = 1;
  } else {
    // console.log("Desktop");
    bw = 10;
    bh = 2.5;
    gap = 2;
  }
};
handleChange(mediaQueryList);

mediaQueryList.addEventListener("change", handleChange);

btnFile.addEventListener("click", () => fileInput.click());

function addBadge(file) {
  const button = document.createElement("button");
  button.innerText = file.name;
  button.id = String(Date.now());
  button.classList.add("animation");
  document.getElementById("badges").appendChild(button);

  button.addEventListener("click", () => {
    audio.src = file.src;
    audio.play();
    audio.loop = true;
    btnFile.innerText = file.name;
    setupAudio(audio);
    draw();
  });
}

btnVisualizer.addEventListener("click", (e) => {
  e.target.style.display = "none";
  fileContainer.style.display = "flex";
  planet.style.animationPlayState = "running";
  audio.src = "/assets/audios/chrono-trigger.ogg";
  audio.play();
  audio.loop = true;
  setupAudio(audio);
  draw();
});

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const src = URL.createObjectURL(file);
  btnFile.innerText = file.name;
  labelFile.innerText = "Current Audio: ";
  line.style.display = "flex";

  audio.src = src;
  audio.play();
  audio.loop = true;
  addBadge({ name: file.name, src });
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
}

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * bw;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * bh;

    canvasCtx.fillStyle = `hsl(${barHeight}, 50%, 50%)`;
    canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + gap;
  }
}
