let selectedGrade = null;
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let playerName = "Explorer";
let scoreboard = null;
let correctStreak = 0;

/* 🌌 SPACE MISSION DATABASE */
const questionsByGrade = {
  8: [
    { q: "5² = ?", options: [10, 25, 15], correctIndex: 1 },
    { q: "√144 = ?", options: [10, 12, 14], correctIndex: 1 },
    { q: "Solve: 3x = 18", options: [6, 5, 9], correctIndex: 0 },
    { q: "Solve: 2x + 4 = 10", options: [2, 3, 4], correctIndex: 1 },
    { q: "(-5) + 8 = ?", options: [3, -3, 13], correctIndex: 0 },
    { q: "7³ = ?", options: [343, 49, 21], correctIndex: 0 },
    { q: "Convert 3/4 to percentage", options: ["75%", "50%", "25%"], correctIndex: 0 },
    { q: "0.6 as fraction?", options: ["3/5", "6/10", "2/3"], correctIndex: 0 },
    { q: "Solve: 5x = 45", options: [9, 8, 10], correctIndex: 0 },
    { q: "Value of 10²?", options: [100, 20, 200], correctIndex: 0 },
  ],
  9: [
    { q: "Expand: 3(x+2)", options: ["3x+6", "3x+2", "6x+2"], correctIndex: 0 },
    { q: "x² × x³ = ?", options: ["x^5", "x^6", "x^9"], correctIndex: 0 },
    { q: "Solve: 4x = 20", options: [5, 4, 6], correctIndex: 0 },
    { q: "Factorise: 5x+10", options: ["5(x+2)", "5x(2)", "10(x+1)"], correctIndex: 0 },
    { q: "Solve: 2x-4=6", options: [5, 4, 3], correctIndex: 0 },
    { q: "(x²)³ = ?", options: ["x^6", "x^5", "x^9"], correctIndex: 0 },
    { q: "10³ = ?", options: [1000, 100, 30], correctIndex: 0 },
    { q: "Solve: x/5=3", options: [15, 10, 8], correctIndex: 0 },
    { q: "5² + 3² = ?", options: [34, 25, 9], correctIndex: 0 },
    { q: "(-3)² = ?", options: [9, -9, 6], correctIndex: 0 },
  ]
};

/* 🌠 SHUFFLE FUNCTION (UNCHANGED BUT USED AS RANDOM SPACE DISTORTION) */
function shuffle(array) {
  return array
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(x => x.v);
}

/* 🚀 INIT SPACE USER */
function startApp() {
  const input = document.getElementById("playerNameInput").value;
  if (input.trim()) playerName = input.trim();

  document.getElementById("nameInputContainer").style.display = "none";
  document.getElementById("enter-vr-btn").style.display = "block";

  speak(`Welcome Commander ${playerName}. Your space math mission awaits.`);

  document.querySelector('#welcomeText')
    .setAttribute('value', `🌌 Welcome Commander ${playerName}`);
}

/* 🔊 SPACE VOICE */
function speak(text) {
  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 0.95;
  msg.pitch = 1.1;
  window.speechSynthesis.speak(msg);
}

/* 🚀 START MISSION SEQUENCE */
function startGame() {
  if (selectedGrade !== null) return;

  speak(`Select your mission level, Commander ${playerName}`);

  document.querySelector('#startButton').setAttribute('visible', 'false');
  document.querySelector('#welcomeText').setAttribute('visible', 'false');

  document.querySelector('#grade8Btn').setAttribute('visible', 'true');
  document.querySelector('#grade9Btn').setAttribute('visible', 'true');
}

/* 🪐 SELECT GALAXY (GRADE) */
function selectGrade(grade) {
  if (selectedGrade !== null) return;

  selectedGrade = grade;
  currentQuestionIndex = 0;
  score = 0;
  correctStreak = 0;

  questions = shuffle(questionsByGrade[grade]).map(q => {
    const correctAnswer = q.options[q.correctIndex];
    const shuffled = shuffle([...q.options]);

    return {
      q: `🪐 ${q.q}`,
      options: shuffled,
      correctAnswer,
      correctIndex: shuffled.indexOf(correctAnswer)
    };
  });

  speak(`Entering Galaxy ${grade}. Mission begins now.`);

  document.querySelector('#grade8Btn').setAttribute('visible', 'false');
  document.querySelector('#grade9Btn').setAttribute('visible', 'false');

  initScoreboard();
  showQuestion();
}

/* 📡 SPACE HUD */
function initScoreboard() {
  if (scoreboard) scoreboard.remove();

  scoreboard = document.createElement('a-entity');
  scoreboard.setAttribute('id', 'scoreboard');
  scoreboard.setAttribute('position', '0 3 -5');

  scoreboard.setAttribute('geometry', {
    primitive: 'plane',
    width: 2.5,
    height: 1.2
  });

  scoreboard.setAttribute('material', {
    color: '#0B3D91',
    opacity: 0.85,
    transparent: true
  });

  const text = document.createElement('a-entity');
  text.setAttribute('text', {
    value: `MISSION STATUS\n0/0\n⭐`,
    color: 'white',
    align: 'center',
    width: 3
  });

  text.setAttribute('position', '0 0 0.1');
  scoreboard.appendChild(text);

  document.querySelector('a-scene').appendChild(scoreboard);
}

/* 📊 UPDATE HUD */
function updateScoreboard() {
  if (!scoreboard) return;

  const stars =
    '⭐'.repeat(Math.min(5, Math.floor(score / 2))) +
    '☆'.repeat(Math.max(0, 5 - Math.floor(score / 2)));

  const text = scoreboard.querySelector('[text]');

  text.setAttribute(
    'text',
    'value',
    `Commander: ${playerName}
Mission Progress: ${score}/${currentQuestionIndex}
${stars}`
  );
}

/* ❓ SHOW SPACE QUESTION */
function showQuestion() {
  const q = questions[currentQuestionIndex];

  const qt = document.querySelector('#questionText');
  qt.setAttribute('visible', 'true');
  qt.setAttribute('value', `🌠 ${q.q}`);

  for (let i = 0; i < 3; i++) {
    document.querySelector(`#option${i + 1}`).setAttribute('visible', 'true');
    document.querySelector(`#text${i + 1}`).setAttribute('value', q.options[i]);
  }

  updateScoreboard();
}

/* 🎯 ANSWER SYSTEM */
function selectAnswer(index) {
  const q = questions[currentQuestionIndex];
  const correct = index === q.correctIndex;

  for (let i = 1; i <= 3; i++) {
    document.querySelector(`#option${i}`).setAttribute('visible', 'false');
  }

  if (correct) {
    score++;
    correctStreak++;

    if (correctStreak >= 5) {
      speak(`Stellar streak, Commander ${playerName}!`);
      correctStreak = 0;
    } else {
      speak(`Correct trajectory.`);
    }
  } else {
    correctStreak = 0;
    speak(`Incorrect orbit detected.`);
  }

  currentQuestionIndex++;
  updateScoreboard();

  if (currentQuestionIndex < questions.length) {
    setTimeout(showQuestion, 1800);
  } else {
    setTimeout(showFinalScore, 1800);
  }
}

/* 🪐 FINAL GALAXY REPORT */
function showFinalScore() {
  document.querySelector('#questionText').setAttribute('visible', 'false');

  const percent = Math.round((score / questions.length) * 100);

  let message = "";
  let stars = "";

  if (percent >= 90) {
    message = "GALAXY MASTER ACHIEVED";
    stars = "⭐⭐⭐⭐⭐";
  } else if (percent >= 70) {
    message = "STRONG SPACE NAVIGATOR";
    stars = "⭐⭐⭐";
  } else {
    message = "MISSION IN PROGRESS";
    stars = "⭐";
  }

  if (scoreboard) scoreboard.remove();

  const final = document.createElement('a-entity');
  final.setAttribute('position', '0 1 -2');

  final.setAttribute('geometry', {
    primitive: 'plane',
    width: 3,
    height: 1.6
  });

  final.setAttribute('material', {
    color: '#1B263B',
    opacity: 0.95,
    transparent: true
  });

  const text = document.createElement('a-entity');
  text.setAttribute('text', {
    value:
`🌌 MISSION COMPLETE
Score: ${score}/${questions.length}
${stars}
${message}`,
    color: 'white',
    align: 'center',
    width: 4
  });

  text.setAttribute('position', '0 0 0.1');
  final.appendChild(text);

  document.querySelector('a-scene').appendChild(final);

  speak(`Mission complete. You scored ${score} out of ${questions.length}. ${message}`);
}

/* 🚀 VR MODE BUTTON */
document.getElementById('enter-vr-btn').addEventListener('click', () => {
  const scene = document.querySelector('a-scene');

  if (scene.hasLoaded) {
    scene.enterVR();
  } else {
    scene.addEventListener('loaded', () => scene.enterVR());
  }
});
