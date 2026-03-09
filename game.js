const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const missDisplay = document.getElementById('misses');

const PLAYER_X = 50;
const PLAYER_RADIUS = 20;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 60;
const PADDLE_X = canvas.width - PADDLE_WIDTH - 20;
let paddleY = canvas.height / 2 - PADDLE_HEIGHT / 2;

let playerY = canvas.height / 2;
let aimY = canvas.height / 2;

let bullet = {
  x: PLAYER_X + PLAYER_RADIUS + 10,
  y: playerY,
  dx: 4,
  dy: 2,
  radius: 5,
  active: false
};

let score = 0;
let misses = 0;
let pressedKeys = {};

document.addEventListener('keydown', e => {
  pressedKeys[e.key] = true;
});

document.addEventListener('keyup', e => {
  pressedKeys[e.key] = false;
});

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  aimY = mouseY;
});

canvas.addEventListener('click', () => {
  if (!bullet.active) {
    bullet.x = PLAYER_X + PLAYER_RADIUS + 10;
    bullet.y = playerY;
    // Calculate angle between stickman and aim position
    const angle = Math.atan2(aimY - playerY, (canvas.width / 2) - PLAYER_X);
    bullet.dx = Math.cos(angle) * 6;
    bullet.dy = Math.sin(angle) * 6;
    bullet.active = true;
  }
});

function drawStickman(x, y) {
  // Body
  ctx.beginPath();
  ctx.arc(x, y, PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.stroke();

  // Torso
  ctx.beginPath();
  ctx.moveTo(x, y + PLAYER_RADIUS);
  ctx.lineTo(x, y + PLAYER_RADIUS + 26);
  ctx.stroke();

  // Arms
  ctx.beginPath();
  ctx.moveTo(x, y + PLAYER_RADIUS + 10);
  ctx.lineTo(x - 20, y + PLAYER_RADIUS + 30);
  ctx.moveTo(x, y + PLAYER_RADIUS + 10);
  ctx.lineTo(x + 20, y + PLAYER_RADIUS + 30);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(x, y + PLAYER_RADIUS + 26);
  ctx.lineTo(x - 15, y + PLAYER_RADIUS + 54);
  ctx.moveTo(x, y + PLAYER_RADIUS + 26);
  ctx.lineTo(x + 15, y + PLAYER_RADIUS + 54);
  ctx.stroke();

  // Gun
  ctx.save();
  ctx.translate(x + PLAYER_RADIUS + 3, y);
  const gunAngle = Math.atan2(aimY - y, canvas.width / 2 - x);
  ctx.rotate(gunAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(30, 0);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.restore();
}

function drawPaddle(x, y) {
  ctx.fillStyle = '#444';
  ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function drawBullet(b) {
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
}

function updatePlayer() {
  if (pressedKeys['ArrowUp']) playerY -= 5;
  if (pressedKeys['ArrowDown']) playerY += 5;
  // Clamp player position
  playerY = Math.max(PLAYER_RADIUS, Math.min(canvas.height - PLAYER_RADIUS, playerY));
}

function updatePaddle() {
  // Simple AI to follow bullet
  let targetY = bullet.active ? bullet.y - PADDLE_HEIGHT / 2 : canvas.height / 2 - PADDLE_HEIGHT / 2;
  if (paddleY < targetY) paddleY += 3;
  else if (paddleY > targetY) paddleY -= 3;
  // Clamp paddle
  paddleY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, paddleY));
}

function updateBullet() {
  if (!bullet.active) return;
  bullet.x += bullet.dx;
  bullet.y += bullet.dy;

  // Bounce off walls
  if (bullet.y < bullet.radius || bullet.y > canvas.height - bullet.radius) {
    bullet.dy = -bullet.dy;
    bullet.y += bullet.dy;
  }
  // Left wall: deactivate if missed
  if (bullet.x < 0) {
    bullet.active = false;
    misses++;
    missDisplay.textContent = misses;
  }
  // Paddle collision
  if (
    bullet.x + bullet.radius > PADDLE_X &&
    bullet.x - bullet.radius < PADDLE_X + PADDLE_WIDTH &&
    bullet.y > paddleY &&
    bullet.y < paddleY + PADDLE_HEIGHT
  ) {
    bullet.dx = -bullet.dx;
    bullet.x = PADDLE_X - bullet.radius;
    score++;
    scoreDisplay.textContent = score;
  }
  // Right wall
  if (bullet.x > canvas.width) {
    bullet.dx = -bullet.dx;
    bullet.x = canvas.width - bullet.radius;
  }
}

function drawAimLine() {
  ctx.save();
  ctx.setLineDash([5, 3]);
  ctx.strokeStyle = '#888';
  ctx.beginPath();
  ctx.moveTo(PLAYER_X + PLAYER_RADIUS + 10, playerY);
  ctx.lineTo(canvas.width / 2, aimY);
  ctx.stroke();
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStickman(PLAYER_X, playerY);
  drawAimLine();
  drawPaddle(PADDLE_X, paddleY);
  if (bullet.active) drawBullet(bullet);
}

function gameLoop() {
  updatePlayer();
  updatePaddle();
  updateBullet();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();