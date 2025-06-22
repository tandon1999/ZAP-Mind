const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");
const scoreBoard = document.getElementById("score-board");
const timerFill = document.getElementById("timer-fill");
const finalScoreBox = document.getElementById("final-score");
const scoreResult = document.getElementById("score-result");
const ding = document.getElementById("ding");
const statsContainer = document.getElementById("stats-container");
const statsChartCanvas = document.getElementById("stats-chart");

let hDot, vDot, targetCircle;
let speed = 2;
let score = 0;
let phase = 0;
let hInterval, vInterval;
let startTime, countdownInterval;
let chart;
let gameInProgress = false;

// ⛳ Setup initial state
window.onload = () => {
  startBtn.textContent = "Start Game";
  finalScoreBox.style.display = "none";
  statsContainer.style.display = "none";
};

function createDot(type) {
  const dot = document.createElement("div");
  dot.classList.add("dot", type);
  return dot;
}

function positionDots() {
  const centerX = gameContainer.clientWidth / 2;
  const centerY = gameContainer.clientHeight / 2;
  hDot.style.left = "0px";
  hDot.style.top = `${centerY - 25}px`;
  vDot.style.left = `${centerX - 25}px`;
  vDot.style.top = "0px";
}

function moveVertical() {
  let pos = 0, dir = 1;
  vInterval = setInterval(() => {
    pos += speed * dir;
    if (pos <= 0 || pos >= gameContainer.clientHeight - 50) dir *= -1;
    vDot.style.top = `${pos}px`;
  }, 16);
}

function moveHorizontal() {
  let pos = 0, dir = 1;
  hInterval = setInterval(() => {
    pos += speed * dir;
    if (pos <= 0 || pos >= gameContainer.clientWidth - 50) dir *= -1;
    hDot.style.left = `${pos}px`;
  }, 16);
}

function evaluateScore() {
  const dotRadius = 25;
  const circleRect = targetCircle.getBoundingClientRect();
  const circleX = circleRect.left + circleRect.width / 2;
  const circleY = circleRect.top + circleRect.height / 2;
  const circleRadius = circleRect.width / 2;

  const hCenter = hDot.getBoundingClientRect();
  const vCenter = vDot.getBoundingClientRect();

  const hDist = Math.hypot(hCenter.left + dotRadius - circleX, hCenter.top + dotRadius - circleY);
  const vDist = Math.hypot(vCenter.left + dotRadius - circleX, vCenter.top + dotRadius - circleY);

  const hInside = hDist <= circleRadius;
  const vInside = vDist <= circleRadius;

  if (hInside && vInside) score += 10;
  else if (hInside || vInside) score += 5;

  scoreBoard.textContent = `Score: ${score}`;
}

function updateDifficulty() {
  const elapsed = (Date.now() - startTime) / 1000;
  if (elapsed > 30) return;
  const newRadius = 50 - (elapsed / 30) * 30;
  targetCircle.style.width = `${newRadius * 2}px`;
  targetCircle.style.height = `${newRadius * 2}px`;
  speed = 2 + elapsed;
  requestAnimationFrame(updateDifficulty);
}

function updateTimer() {
  const elapsed = (Date.now() - startTime) / 1000;
  let remaining = Math.max(0, 30 - elapsed);
  timerFill.style.width = `${(remaining / 30) * 100}%`;
}

function handleClick() {
  if (phase === 0) {
    moveVertical();
    phase = 1;
  } else if (phase === 1) {
    clearInterval(vInterval);
    moveHorizontal();
    phase = 2;
  } else if (phase === 2) {
    clearInterval(hInterval);
    evaluateScore();
    ding.play();
    phase = 0;
    positionDots();
  }
}

function resetToInitialState() {
  finalScoreBox.style.display = "none";
  scoreBoard.textContent = "Score: 0";
  timerFill.style.width = "100%";
  statsContainer.style.display = "none";
  gameContainer.innerHTML = '<div id="target-circle"></div><div id="cross-lines"></div>';
  startBtn.textContent = "Start Game";
  startBtn.style.display = "inline-block";
  gameInProgress = false;
}

function startGame() {
  if (gameInProgress) return;
  gameInProgress = true;
  startBtn.style.display = "none";
  score = 0;
  phase = 0;
  speed = 2;

  finalScoreBox.style.display = "none";
  statsContainer.style.display = "none";

  gameContainer.innerHTML = '<div id="target-circle"></div><div id="cross-lines"></div>';
  targetCircle = document.getElementById("target-circle");
  hDot = createDot("horizontal");
  vDot = createDot("vertical");
  gameContainer.appendChild(hDot);
  gameContainer.appendChild(vDot);
  positionDots();
  startTime = Date.now();

  gameContainer.onclick = handleClick;
  requestAnimationFrame(updateDifficulty);

  countdownInterval = setInterval(updateTimer, 100);
  setTimeout(endGame, 30000);
}

function endGame() {
  clearInterval(hInterval);
  clearInterval(vInterval);
  clearInterval(countdownInterval);
  gameContainer.onclick = null;
  scoreResult.textContent = score;
  finalScoreBox.style.display = "block";

  // 🔁 Instead of starting game again, go back to initial state
  startBtn.textContent = "Try Again";
  startBtn.style.display = "inline-block";
  gameInProgress = false;

  saveScoreToCookies(score);
  renderStatsChart();
}

function saveScoreToCookies(score) {
  const scores = JSON.parse(localStorage.getItem("scores") || "[]");
  const now = new Date();
  scores.push({ date: now.toISOString(), score: score, playCount: 1 });
  const last30Days = scores.filter(item => {
    const date = new Date(item.date);
    return (now - date) / (1000 * 60 * 60 * 24) <= 30;
  });
  localStorage.setItem("scores", JSON.stringify(last30Days));
}

function renderStatsChart() {
  const data = JSON.parse(localStorage.getItem("scores") || "[]");

  // label हरु: Play #1, Play #2, Play #3 ...
  const labels = data.map((_, idx) => `Play #${idx + 1}`);

  // values: प्रत्येक खेलको score
  const values = data.map(entry => entry.score);

  statsContainer.style.display = "block";

  if (chart) chart.destroy();

  chart = new Chart(statsChartCanvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Score per Play",
        data: values,
        backgroundColor: "#00ff99"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}



// ✅ Button click behavior
startBtn.onclick = () => {
  if (startBtn.textContent === "Try Again") {
    resetToInitialState();
  } else if (startBtn.textContent === "Start Game") {
    startGame();
  }
};
