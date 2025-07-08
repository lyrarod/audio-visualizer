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

const spaceflight = document.getElementById("spaceflight");
const neverbackdown = document.getElementById("neverbackdown");
const krakenofthesea = document.getElementById("krakenofthesea");
const overworld = document.getElementById("overworld");
const topgear = document.getElementById("topgear");

topgear.addEventListener("click", (e) => {
  e.preventDefault();
  topgear.disabled = true;
  topgear.style.opacity = 0.5;
  topgear.style.scale = "0.98";
  topgear.style.pointerEvents = "none";
  audio.src = "/assets/audios/top-gear-las-vegas.ogg";
  audio.play();
  audio.loop = true;
  setupAudio(audio);
  draw();

  overworld.disabled = false;
  overworld.style.opacity = 1;
  overworld.style.scale = "1";
  overworld.style.pointerEvents = "all";

  krakenofthesea.disabled = false;
  krakenofthesea.style.opacity = 1;
  krakenofthesea.style.scale = "1";
  krakenofthesea.style.pointerEvents = "all";

  spaceflight.disabled = false;
  spaceflight.style.opacity = 1;
  spaceflight.style.scale = "1";
  spaceflight.style.pointerEvents = "all";

  neverbackdown.disabled = false;
  neverbackdown.style.opacity = 1;
  neverbackdown.style.scale = "1";
  neverbackdown.style.pointerEvents = "all";
});

overworld.addEventListener("click", (e) => {
  e.preventDefault();
  overworld.disabled = true;
  overworld.style.opacity = 0.5;
  overworld.style.scale = "0.98";
  overworld.style.pointerEvents = "none";
  audio.src = "/assets/audios/overworld.ogg";
  audio.play();
  audio.loop = true;
  setupAudio(audio);
  draw();

  topgear.disabled = false;
  topgear.style.opacity = 1;
  topgear.style.scale = "1";
  topgear.style.pointerEvents = "all";

  krakenofthesea.disabled = false;
  krakenofthesea.style.opacity = 1;
  krakenofthesea.style.scale = "1";
  krakenofthesea.style.pointerEvents = "all";

  spaceflight.disabled = false;
  spaceflight.style.opacity = 1;
  spaceflight.style.scale = "1";
  spaceflight.style.pointerEvents = "all";

  neverbackdown.disabled = false;
  neverbackdown.style.opacity = 1;
  neverbackdown.style.scale = "1";
  neverbackdown.style.pointerEvents = "all";
});

krakenofthesea.addEventListener("click", (e) => {
  e.preventDefault();
  krakenofthesea.disabled = true;
  krakenofthesea.style.opacity = 0.5;
  krakenofthesea.style.scale = "0.98";
  krakenofthesea.style.pointerEvents = "none";
  audio.src = "/assets/audios/kraken-of-the-sea.ogg";
  audio.play();
  audio.loop = true;
  setupAudio(audio);
  draw();

  topgear.disabled = false;
  topgear.style.opacity = 1;
  topgear.style.scale = "1";
  topgear.style.pointerEvents = "all";

  overworld.disabled = false;
  overworld.style.opacity = 1;
  overworld.style.scale = "1";
  overworld.style.pointerEvents = "all";

  spaceflight.disabled = false;
  spaceflight.style.opacity = 1;
  spaceflight.style.scale = "1";
  spaceflight.style.pointerEvents = "all";

  neverbackdown.disabled = false;
  neverbackdown.style.opacity = 1;
  neverbackdown.style.scale = "1";
  neverbackdown.style.pointerEvents = "all";
});

neverbackdown.addEventListener("click", (e) => {
  e.preventDefault();
  neverbackdown.disabled = true;
  neverbackdown.style.opacity = 0.5;
  neverbackdown.style.scale = "0.98";
  neverbackdown.style.pointerEvents = "none";
  audio.src = "/assets/audios/never-back-down.ogg";
  audio.play();
  audio.loop = true;
  setupAudio(audio);
  draw();

  topgear.disabled = false;
  topgear.style.opacity = 1;
  topgear.style.scale = "1";
  topgear.style.pointerEvents = "all";

  overworld.disabled = false;
  overworld.style.opacity = 1;
  overworld.style.scale = "1";
  overworld.style.pointerEvents = "all";

  krakenofthesea.disabled = false;
  krakenofthesea.style.opacity = 1;
  krakenofthesea.style.scale = "1";
  krakenofthesea.style.pointerEvents = "all";

  spaceflight.disabled = false;
  spaceflight.style.opacity = 1;
  spaceflight.style.scale = "1";
  spaceflight.style.pointerEvents = "all";
});

spaceflight.addEventListener("click", (e) => {
  e.preventDefault();
  spaceflight.disabled = true;
  spaceflight.style.opacity = 0.5;
  spaceflight.style.scale = "0.98";
  spaceflight.style.pointerEvents = "none";
  audio.src = "/assets/audios/space-flight.ogg";
  audio.play();
  audio.loop = true;
  setupAudio(audio);
  draw();

  topgear.disabled = false;
  topgear.style.opacity = 1;
  topgear.style.scale = "1";
  topgear.style.pointerEvents = "all";

  overworld.disabled = false;
  overworld.style.opacity = 1;
  overworld.style.scale = "1";
  overworld.style.pointerEvents = "all";

  neverbackdown.disabled = false;
  neverbackdown.style.opacity = 1;
  neverbackdown.style.scale = "1";
  neverbackdown.style.pointerEvents = "all";

  krakenofthesea.disabled = false;
  krakenofthesea.style.opacity = 1;
  krakenofthesea.style.scale = "1";
  krakenofthesea.style.pointerEvents = "all";
});

fileInput.addEventListener("change", () => {
  if (!fileInput.files[0]) return;
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
