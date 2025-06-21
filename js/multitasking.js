let score = 0;
let fallingBlockInterval;
let typingWords = ["focus", "alert", "speed", "logic", "quick"];
let currentWord = "";
let mathInterval;
let correctAnswer = 0;

function updateScore() {
  document.getElementById("score").innerText = "Score: " + score;
}

// Falling block logic
function startFallingBlock() {
  const blockGame = document.getElementById("falling-block-game");
  blockGame.innerHTML = ""; // clear previous

  const block = document.createElement("div");
  block.id = "falling-block";
  blockGame.appendChild(block);

  let pos = 0;
  fallingBlockInterval = setInterval(() => {
    if (pos >= blockGame.offsetHeight - 30) {
      alert("❌ Block missed! Game Over.");
      stopGame();
    } else {
      pos += 5;
      block.style.top = pos + "px";
    }
  }, 50);

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" && pos >= blockGame.offsetHeight - 100) {
      score++;
      updateScore();
      pos = 0;
    }
  });
}

// Typing game logic
function startTypingGame() {
  generateWord();
  const input = document.getElementById("typing-input");
  input.value = "";
  input.addEventListener("input", e => {
    if (e.target.value === currentWord) {
      score++;
      updateScore();
      e.target.value = "";
      generateWord();
    }
  });
}

function generateWord() {
  currentWord = typingWords[Math.floor(Math.random() * typingWords.length)];
  document.getElementById("typing-word").innerText = currentWord;
}

// Math game logic
function startMathGame() {
  generateMath();
  const input = document.getElementById("math-answer");
  input.value = "";
  input.addEventListener("input", e => {
    if (parseInt(e.target.value) === correctAnswer) {
      score++;
      updateScore();
      e.target.value = "";
      generateMath();
    }
  });
}

function generateMath() {
  let a = Math.floor(Math.random() * 10);
  let b = Math.floor(Math.random() * 10);
  correctAnswer = a + b;
  document.getElementById("math-question").innerText = `${a} + ${b} = ?`;
}

// Start all
function startGame() {
  score = 0;
  updateScore();
  startFallingBlock();
  startTypingGame();
  startMathGame();
}

// Stop all
function stopGame() {
  clearInterval(fallingBlockInterval);
  alert("🎮 Game Over! Your Score: " + score);
  window.location.reload();
}
