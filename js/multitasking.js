let score = 0;
let fallingBlockInterval;
let typingWords = [
    "focus", "alert", "speed", "logic", "quick", "smart", "react", "code", "brain", "sharp",
    "game", "input", "type", "solve", "learn", "grow", "fast", "skill", "train", "clear",
    "active", "mind", "think", "flash", "solve", "level", "beat", "try", "tap", "hit",
    "rush", "alert", "press", "check", "view", "type", "input", "click", "data", "win",
    "fire", "ice", "task", "aim", "move", "grab", "test", "task", "time", "clock",
    "zone", "edge", "dash", "run", "roll", "map", "path", "load", "draw", "done",
    "bold", "calm", "risk", "fast", "lift", "jump", "math", "plus", "add", "sub",
    "wave", "grow", "flow", "goal", "mark", "plan", "play", "push", "call", "deep",
    "real", "high", "low", "core", "open", "lock", "ping", "zoom", "buzz", "snap",
    "track", "zone", "back", "snap", "line", "edit", "next", "loop", "quiz", "spin",
    "save", "drop", "kick", "tool", "list", "hard", "easy", "text", "idea", "hack",
    "hunt", "join", "lead", "move", "task", "calm", "pace", "mode", "cool", "chill",
    "wire", "step", "tap", "turn", "view", "zone", "walk", "warn", "note", "ride",
    "mind", "rush", "race", "blur", "test", "hit", "beat", "flow", "hop", "link"
];

let currentWord = "";
let correctAnswer = 0;

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}

function startFallingBlock() {
    const blockGame = document.getElementById("falling-block-game");
    blockGame.innerHTML = "";
    const block = document.createElement("div");
    block.id = "falling-block";
    blockGame.appendChild(block);

    let pos = 0;
    fallingBlockInterval = setInterval(() => {
        if (pos >= blockGame.offsetHeight - 30) {
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

function startGame() {
    score = 0;
    updateScore();
    startFallingBlock();
    startTypingGame();
    startMathGame();
}

function stopGame() {
    clearInterval(fallingBlockInterval);
    showResultScreen(score);
}

function showResultScreen(finalScore) {
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    const now = new Date();
    scores.push({ time: now.toISOString(), score: finalScore });
    scores = scores.filter(s => new Date(s.time) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    localStorage.setItem("scores", JSON.stringify(scores));

    document.getElementById("game-container").style.display = "none";
    document.querySelector(".footer").style.display = "none";

    document.getElementById("result-screen").style.display = "block";
    document.getElementById("final-score").innerText = finalScore;

    renderChart(scores);
}

function renderChart(scores) {
    const ctx = document.getElementById("score-chart").getContext("2d");
    const labels = scores.map(s => new Date(s.time).toLocaleDateString("en-GB"));
    const data = scores.map(s => s.score);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score',
                data: data,
                backgroundColor: '#4CAF50'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function restartGame() {
    window.location.reload();
}