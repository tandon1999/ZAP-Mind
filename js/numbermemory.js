let currentNumber = '';
let level = 1;
let score = 0;

const numberDisplay = document.getElementById("numberDisplay");
const userInput = document.getElementById("userInput");
const inputArea = document.getElementById("inputArea");
const result = document.getElementById("result");
const scoreBoard = document.getElementById("score");
const beepSound = document.getElementById("beepSound");
const clapSound = document.getElementById("clapSound");
const failSound = document.getElementById("failSound");

function generateNumber(level) {
  let digits = '';
  for (let i = 0; i < level + 2; i++) {
    digits += Math.floor(Math.random() * 10);
  }
  return digits;
}

function startGame() {
  userInput.value = '';
  inputArea.style.display = 'none';
  document.getElementById("startBtn").style.display = 'none';
  result.textContent = '';
  currentNumber = generateNumber(level);
  numberDisplay.textContent = currentNumber;

  beepSound.play();

  const progressWrapper = document.getElementById('progressWrapper');
  const progressBar = document.getElementById('progressBar');
  progressWrapper.style.display = 'block';
  progressBar.style.width = '0%';

  setTimeout(() => {
    progressBar.style.width = '100%';
  }, 10);

  setTimeout(() => {
    numberDisplay.textContent = '';
    progressWrapper.style.display = 'none';
    inputArea.style.display = 'block';
    userInput.focus();
  }, 1000);
}

function checkAnswer() {
  const userAnswer = userInput.value.trim();
  if (userAnswer === currentNumber) {
    result.textContent = "✅ Correct!";
    clapSound.play(); // 🎉 correct sound
    level++;
    score++;
    updateScore();
    setTimeout(startGame, 1000);
  } else {
    result.textContent = `❌ Wrong! The number was ${currentNumber}`;
    failSound.currentTime = 0;
    failSound.play();
    document.getElementById("startBtn").style.display = 'block';
    level = 1;
    score = 0;
    updateScore();
    inputArea.style.display = 'none';
  }
}

function updateScore() {
  scoreBoard.textContent = `Level: ${level} | Score: ${score}`;
}
