/* Minimal Flappy Bird (HTML5 Canvas)
 * Uses your assets if you copy them into:
 *   client/public/game/flappyBird/assets/
 *
 * Optional expected files (if present):
 *   assets/sprites/bird.png
 *   assets/audio/flap.wav
 *   assets/audio/hit.wav
 *   assets/audio/point.wav
 *
 * If they don't exist, the game still runs with simple shapes.
 */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const msgEl = document.getElementById("msg");
const btnBack = document.getElementById("btnBack");
const btnAgain = document.getElementById("btnAgain");

const W = canvas.width;
const H = canvas.height;

const gravity = 0.45;
const flapVel = -7.8;
const pipeSpeed = 2.6;
const pipeGap = 170;
const pipeWidth = 78;

let running = false;
let dead = false;
let score = 0;
let best = 0;

const bird = {
  x: 120,
  y: H / 2,
  r: 18,
  vy: 0,
};

let pipes = [];
let lastPipeX = W;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function reset() {
  running = false;
  dead = false;
  score = 0;
  scoreEl.textContent = "0";
  msgEl.textContent = "Click to start";
  bird.x = 120;
  bird.y = H / 2;
  bird.vy = 0;
  pipes = [];
  lastPipeX = W;
  spawnPipe(W + 160);
  spawnPipe(W + 420);
}

function spawnPipe(x) {
  const topH = rand(120, H - 120 - pipeGap);
  pipes.push({
    x,
    topH,
    passed: false,
  });
  lastPipeX = x;
}

// Asset loading (optional)
const assets = {
  birdImg: null,
  sndFlap: null,
  sndHit: null,
  sndPoint: null,
};

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function loadAudio(src) {
  return new Promise((resolve) => {
    const a = new Audio();
    a.oncanplaythrough = () => resolve(a);
    a.onerror = () => resolve(null);
    a.src = src;
  });
}

async function loadAssets() {
  assets.birdImg = await loadImage("./assets/sprites/bird.png");
  assets.sndFlap = await loadAudio("./assets/audio/flap.wav");
  assets.sndHit = await loadAudio("./assets/audio/hit.wav");
  assets.sndPoint = await loadAudio("./assets/audio/point.wav");
}

function play(sound) {
  try {
    if (!sound) return;
    sound.currentTime = 0;
    sound.play();
  } catch (_) {}
}

function flap() {
  if (dead) {
    reset();
    return;
  }
  if (!running) {
    running = true;
    msgEl.textContent = "";
  }
  bird.vy = flapVel;
  play(assets.sndFlap);
}

// UI buttons
if (btnAgain) {
  btnAgain.addEventListener("click", () => {
    reset();
  });
}

if (btnBack) {
  btnBack.addEventListener("click", () => {
    // If embedded in an iframe, try to navigate the top-level page back.
    try {
      if (window.top && window.top !== window) {
        // Prefer history back if possible
        window.top.history.back();
      } else {
        window.history.back();
      }
    } catch (_) {
      // Fallback to home
      window.location.href = "/";
    }
  });
}

function circleRectCollision(cx, cy, r, rx, ry, rw, rh) {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= r * r;
}

function die() {
  dead = true;
  running = false;
  best = Math.max(best, score);
  msgEl.textContent = `Game Over — score ${score} (best ${best}) — click to restart`;
  play(assets.sndHit);
}

function update() {
  if (running && !dead) {
    bird.vy += gravity;
    bird.y += bird.vy;

    // Spawn pipes
    if (lastPipeX - pipes[pipes.length - 1].x > 260) {
      spawnPipe(lastPipeX + 260);
    }

    for (const p of pipes) {
      p.x -= pipeSpeed;

      const topRect = { x: p.x, y: 0, w: pipeWidth, h: p.topH };
      const botRect = { x: p.x, y: p.topH + pipeGap, w: pipeWidth, h: H - (p.topH + pipeGap) };

      // Score when passing center
      if (!p.passed && p.x + pipeWidth < bird.x - bird.r) {
        p.passed = true;
        score += 1;
        scoreEl.textContent = String(score);
        play(assets.sndPoint);
      }

      // Collisions
      if (
        circleRectCollision(bird.x, bird.y, bird.r, topRect.x, topRect.y, topRect.w, topRect.h) ||
        circleRectCollision(bird.x, bird.y, bird.r, botRect.x, botRect.y, botRect.w, botRect.h)
      ) {
        die();
      }
    }

    // Remove offscreen pipes
    pipes = pipes.filter((p) => p.x + pipeWidth > -50);

    // Floor/ceiling
    if (bird.y + bird.r > H - 10 || bird.y - bird.r < 0) {
      die();
    }
  }
}

function drawBackground() {
  // subtle animated-ish gradient stripes
  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, "rgba(56,189,248,0.10)");
  grd.addColorStop(0.5, "rgba(168,85,247,0.10)");
  grd.addColorStop(1, "rgba(2,6,23,0.85)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(56,189,248,0.07)";
  for (let y = 0; y < H; y += 22) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
}

function drawPipes() {
  for (const p of pipes) {
    // top
    ctx.fillStyle = "rgba(56,189,248,0.20)";
    ctx.fillRect(p.x, 0, pipeWidth, p.topH);
    // bottom
    ctx.fillRect(p.x, p.topH + pipeGap, pipeWidth, H - (p.topH + pipeGap));

    ctx.strokeStyle = "rgba(56,189,248,0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x, 0, pipeWidth, p.topH);
    ctx.strokeRect(p.x, p.topH + pipeGap, pipeWidth, H - (p.topH + pipeGap));
  }
}

function drawBird() {
  if (assets.birdImg) {
    const size = bird.r * 2.6;
    ctx.save();
    ctx.translate(bird.x, bird.y);
    const rot = Math.max(-0.7, Math.min(0.9, bird.vy / 9));
    ctx.rotate(rot);
    ctx.drawImage(assets.birdImg, -size / 2, -size / 2, size, size);
    ctx.restore();
    return;
  }

  // fallback: neon circle bird
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(168,85,247,0.35)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(56,189,248,0.75)";
  ctx.stroke();

  // eye
  ctx.beginPath();
  ctx.arc(bird.x + 6, bird.y - 4, 4, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(229,231,235,0.9)";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bird.x + 7, bird.y - 4, 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(2,6,23,0.9)";
  ctx.fill();
}

function drawFloor() {
  ctx.fillStyle = "rgba(56,189,248,0.18)";
  ctx.fillRect(0, H - 10, W, 10);
}

function drawOverlay() {
  if (!running && !dead) {
    ctx.fillStyle = "rgba(2,6,23,0.35)";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(229,231,235,0.95)";
    ctx.font = "700 28px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Click to Start", W / 2, H / 2 - 10);

    ctx.fillStyle = "rgba(148,163,184,0.95)";
    ctx.font = "500 14px system-ui";
    ctx.fillText("Tap / Click / Space to flap", W / 2, H / 2 + 18);
  }
}

function render() {
  drawBackground();
  drawPipes();
  drawBird();
  drawFloor();
  drawOverlay();
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

canvas.addEventListener("mousedown", flap);
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") flap();
});

(async function init() {
  await loadAssets();
  reset();
  loop();
})();


