const gameArea = document.getElementById('gameArea');
const target = document.getElementById('target');
const scoreBoard = document.getElementById('scoreBoard');
const timerDisplay = document.getElementById('timer');
const message = document.getElementById('message');
const startBtn = document.getElementById('startBtn');
const avgTimeDisplay = document.getElementById('avgTime');

let score = 0;
let timeLeft = 30; // seconds
let gameInterval;
let timerInterval;
let gameRunning = false;
let lastClickTime = 0;
let totalClickTime = 0;

// click sound setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClickSound() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

const emojis = ['🐰', '⭐', '🔥', '⚡', '😊', '🐱', '🍀', '🌟', '🎯'];

target.style.display = 'none';

function randomPosition() {
    // avoid scoreBoard area width 180px
    const maxX = gameArea.clientWidth - target.offsetWidth - 180;
    const maxY = gameArea.clientHeight - target.offsetHeight;
    return {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
    };
}

function randomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function moveTarget() {
    const pos = randomPosition();
    target.style.left = pos.x + 'px';
    target.style.top = pos.y + 'px';
    target.textContent = randomEmoji();
}

function updateTimer() {
    timeLeft -= 0.1;
    if (timeLeft <= 0) {
        timeLeft = 0;
        endGame();
    }
    timerDisplay.textContent = `Time Left: ${timeLeft.toFixed(1)}s`;
}

function startGame() {
    if (gameRunning) return;
    score = 0;
    timeLeft = 30;
    totalClickTime = 0;
    lastClickTime = performance.now();
    scoreBoard.textContent = score;
    timerDisplay.textContent = `Time Left: ${timeLeft.toFixed(1)}s`;
    avgTimeDisplay.textContent = `Average Time per Target: 0 ms`;
    message.textContent = 'Go! Click the targets!';
      message.classList.remove('finished');
    message.style.color = '#333';
    target.style.display = 'flex';
    gameRunning = true;
    startBtn.disabled = true;
    moveTarget();
    gameInterval = setInterval(moveTarget, 1200);
    timerInterval = setInterval(updateTimer, 100);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  gameRunning = false;
  target.style.display = 'none';

  const avgMs = score > 0 ? (totalClickTime/score).toFixed(0) : 0;
  message.textContent = ` You scored ${score} points!`;
  avgTimeDisplay.textContent = `Average Time per Target: ${avgMs} ms`;
  message.classList.add('finished');

  startBtn.disabled = false;
  startBtn.textContent = 'Try Again';
}


target.addEventListener('click', () => {
    if (!gameRunning) return;
    playClickSound();
    const now = performance.now();
    totalClickTime += (now - lastClickTime);
    lastClickTime = now;
    score++;
    scoreBoard.textContent = score;
    avgTimeDisplay.textContent = `Average Time per Target: ${Math.round(totalClickTime / score)} ms`;
    moveTarget();
});

startBtn.addEventListener('click', startGame);