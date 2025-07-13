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
let bw = 0;
let bh = 0;
let gap = 0;

const btnFile = document.getElementById("btnFile");
const btnVisualizer = document.getElementById("btnVisualizer");
const labelFile = document.getElementById("labelFile");
const line = document.getElementById("line");
const planet = document.getElementById("planet");
const currentAudioContainer = document.getElementById("currentAudioContainer");
const currentAudio = document.getElementById("currentAudio");

const mediaQueryList = window.matchMedia(`(width <= 700px)`);

const handleChange = ({ matches }) => {
  if (matches) {
    bw = 20;
    bh = 2;
    gap = 1;
  } else {
    bw = 10;
    bh = 2.5;
    gap = 2;
  }
};
handleChange(mediaQueryList);

mediaQueryList.addEventListener("change", handleChange);

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
    displayCurrentAudioContainer(file.name);
    setupAudio(audio);
    draw();
  });
}

function displayCurrentAudioContainer(name = "No audio") {
  if (fileInput.files.length > 0) {
    currentAudio.innerText = name;
    currentAudioContainer.style.display = "flex";
  }
}

btnVisualizer.addEventListener("click", (e) => {
  e.target.style.display = "none";
  planet.style.animationPlayState = "running";
  audio.src = "/assets/audio/chrono-trigger.ogg";
  audio.play();
  audio.loop = true;
  setupAudio(audio);
  draw();
});

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const src = URL.createObjectURL(file);
  line.style.display = "flex";
  btnVisualizer.style.display = "none";
  planet.style.animationPlayState = "running";
  displayCurrentAudioContainer(file.name);

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
