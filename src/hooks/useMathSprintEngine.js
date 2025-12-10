import { useCallback, useEffect, useState } from 'react';
import { addScoreEntry, isHighScore, loadLeaderboard } from '../services/leaderboardService.js';

// ---------------- CHAPTER LIST ----------------
export const CHAPTERS = [
  { id: 'arithmetic', label: 'Arithmetic' },
  { id: 'squares', label: 'Squares & Square Roots' },
  { id: 'percentages', label: 'Percentages' },
  { id: 'ratios', label: 'Ratios & Proportions' },
  { id: 'exponents', label: 'Exponents & Powers' },
  { id: 'logs', label: 'Logarithms (Base 10 / 2)' },
  { id: 'algebra', label: 'Algebraic Expressions' },
  { id: 'linear', label: 'Linear Equations' },
  { id: 'trig', label: 'Basic Trigonometry' },
  { id: 'compound', label: 'Compound Interest' },
];

const DEFAULT_SETTINGS = {
  durationSeconds: 60,
  difficulty: 'easy', // "easy" | "medium" | "hard"
  chapterId: 'arithmetic',
};

// ---------------- HELPERS ----------------

function getDifficultyConfig(difficulty) {
  switch (difficulty) {
    case 'medium':
      return { min: 1, max: 50 };
    case 'hard':
      return { min: 1, max: 100 };
    case 'easy':
    default:
      return { min: 1, max: 20 };
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function round2(x) {
  return Math.round(x * 100) / 100;
}

// ---------------- QUESTION GENERATORS ----------------
// each returns: { title, expression, correctAnswer, meta? }

// 1. Arithmetic
function generateArithmeticQuestion(difficulty) {
  const ops = ['+', '-', '×', '÷'];
  const op = getChoice(ops);

  let a;
  let b;
  let answer;

  if (difficulty === 'easy') {
    const { min, max } = getDifficultyConfig('easy');
    a = getRandomInt(min, max);
    b = getRandomInt(min, max);

    if (op === '+') answer = a + b;
    else if (op === '-') answer = a - b;
    else if (op === '×') answer = a * b;
    else if (op === '÷') {
      // exact division
      b = getRandomInt(1, 12);
      answer = getRandomInt(1, 12);
      a = b * answer;
    }

    return {
      title: 'Compute the value of:',
      expression: `${a} ${op} ${b}`,
      correctAnswer: answer,
      meta: { chapterId: 'arithmetic' },
    };
  }

  if (difficulty === 'medium') {
    const { min, max } = getDifficultyConfig('medium');
    a = getRandomInt(min, max);
    b = getRandomInt(1, max);

    if (op === '+') answer = a + b;
    else if (op === '-') answer = a - b;
    else if (op === '×') answer = a * b;
    else if (op === '÷') {
      const forceDecimal = Math.random() < 0.5;
      if (forceDecimal) {
        a = getRandomInt(10, 200);
        const divisors = [4, 5, 8];
        b = getChoice(divisors);
        answer = round2(a / b);
      } else {
        b = getRandomInt(1, 20);
        answer = getRandomInt(1, 20);
        a = b * answer;
      }
    }

    return {
      title: 'Compute the value of:',
      expression: `${a} ${op} ${b}`,
      correctAnswer: answer,
      meta: { chapterId: 'arithmetic' },
    };
  }

  // hard → decimal operands
  const rawA = getRandomInt(10, 200);
  const rawB = getRandomInt(10, 200);
  a = round2(rawA / 10);
  b = round2(rawB / 10);

  if (op === '+') answer = round2(a + b);
  else if (op === '-') answer = round2(a - b);
  else if (op === '×') answer = round2(a * b);
  else if (op === '÷') answer = round2(a / b);

  return {
    title: 'Compute the value (round to 2 decimal places):',
    expression: `${a} ${op} ${b}`,
    correctAnswer: answer,
    meta: { chapterId: 'arithmetic' },
  };
}

// 2. Squares & Square roots
function generateSquaresQuestion(difficulty) {
  if (difficulty === 'easy') {
    const n = getRandomInt(1, 15);
    const squareMode = Math.random() < 0.5;
    if (squareMode) {
      return {
        title: 'Evaluate the square:',
        expression: `${n}²`,
        correctAnswer: n * n,
        meta: { chapterId: 'squares', type: 'square' },
      };
    }
    const sq = n * n;
    return {
      title: 'Evaluate the square root:',
      expression: `√${sq}`,
      correctAnswer: n,
      meta: { chapterId: 'squares', type: 'root' },
    };
  }

  if (difficulty === 'medium') {
    const n = getRandomInt(5, 20);
    const sq = n * n;
    const rootMode = Math.random() < 0.4;
    if (rootMode) {
      return {
        title: 'Evaluate the square root:',
        expression: `√${sq}`,
        correctAnswer: n,
        meta: { chapterId: 'squares', type: 'root' },
      };
    }
    return {
      title: 'Evaluate the square:',
      expression: `${n}²`,
      correctAnswer: sq,
      meta: { chapterId: 'squares', type: 'square' },
    };
  }

  // hard – approx root
  const value = getRandomInt(20, 200);
  const approx = round2(Math.sqrt(value));
  return {
    title: 'Evaluate the square root (round to 2 decimal places):',
    expression: `√${value}`,
    correctAnswer: approx,
    meta: { chapterId: 'squares', type: 'root-approx' },
  };
}

// 3. Percentages
function generatePercentagesQuestion(difficulty) {
  if (difficulty === 'easy') {
    const base = getRandomInt(50, 400);
    const perc = getChoice([10, 20, 25, 50]);
    const answer = (base * perc) / 100;
    return {
      title: 'Calculate the percentage:',
      expression: `${perc}% of ${base}`,
      correctAnswer: answer,
      meta: { chapterId: 'percentages' },
    };
  }

  if (difficulty === 'medium') {
    const base = getRandomInt(80, 600);
    const perc = getChoice([5, 12, 15, 30, 37]);
    const answer = round2((base * perc) / 100);
    return {
      title: 'Determine the value (round to 2 decimal places if required):',
      expression: `${perc}% of ${base}`,
      correctAnswer: answer,
      meta: { chapterId: 'percentages' },
    };
  }

  const base = getRandomInt(120, 1000);
  const perc = getChoice([7.5, 12.5, 17.5, 22.5, 33.3]);
  const answer = round2((base * perc) / 100);
  return {
    title: 'Compute the percentage (round to 2 decimal places):',
    expression: `${perc}% of ${base}`,
    correctAnswer: answer,
    meta: { chapterId: 'percentages' },
  };
}

// 4. Ratios & Proportions
function generateRatiosQuestion(difficulty) {
  if (difficulty === 'easy') {
    const a = getRandomInt(2, 15);
    const k = getRandomInt(2, 10);
    const x = a * k;
    return {
      title: 'Solve for x:',
      expression: `${a} : x = ${a} : ${x}`,
      correctAnswer: x,
      meta: { chapterId: 'ratios' },
    };
  }

  if (difficulty === 'medium') {
    const a = getRandomInt(2, 10);
    const b = getRandomInt(2, 15);
    const k = getRandomInt(2, 8);
    const c = a * k;
    const d = b * k;
    const form = Math.random() < 0.5;
    if (form) {
      return {
        title: 'Solve for x:',
        expression: `${a} : ${b} = ${c} : x`,
        correctAnswer: d,
        meta: { chapterId: 'ratios' },
      };
    }
    return {
      title: 'Solve for x:',
      expression: `${a} : x = ${c} : ${d}`,
      correctAnswer: b,
      meta: { chapterId: 'ratios' },
    };
  }

  // hard – decimals
  const p = getRandomInt(2, 20);
  const q = getRandomInt(2, 20);
  const r = getRandomInt(2, 20);
  const x = round2((q * r) / p);
  return {
    title: 'Solve for x (round to 2 decimal places):',
    expression: `${p} : ${q} = ${r} : x`,
    correctAnswer: x,
    meta: { chapterId: 'ratios' },
  };
}

// 5. Exponents & Powers
function generateExponentsQuestion(difficulty) {
  if (difficulty === 'easy') {
    const base = getRandomInt(2, 10);
    const exp = getChoice([2, 3, 4]);
    const answer = base ** exp;
    return {
      title: 'Evaluate the power:',
      expression: `${base}^${exp}`,
      correctAnswer: answer,
      meta: { chapterId: 'exponents' },
    };
  }

  if (difficulty === 'medium') {
    const base = getRandomInt(2, 12);
    const exp = getChoice([-2, -1, 2, 3]);
    const answer = round2(base ** exp);
    return {
      title: 'Evaluate the power (round to 2 decimal places where necessary):',
      expression: `${base}^${exp}`,
      correctAnswer: answer,
      meta: { chapterId: 'exponents' },
    };
  }

  const base = getChoice([2, 3, 5, 10]);
  const exp = getChoice([-3, -2, -1, 0.5, 1.5]);
  const answer = round2(base ** exp);
  return {
    title: 'Evaluate the power (round to 2 decimal places):',
    expression: `${base}^${exp}`,
    correctAnswer: answer,
    meta: { chapterId: 'exponents' },
  };
}

// 6. Logarithms
function generateLogsQuestion(difficulty) {
  if (difficulty === 'easy') {
    const base = getChoice([10, 2]);
    const exp = getRandomInt(1, 4);
    const value = base ** exp;
    const answer = exp;
    const expression = base === 10 ? `log₁₀(${value})` : `log₂(${value})`;
    return {
      title: 'Compute the logarithm:',
      expression,
      correctAnswer: answer,
      meta: { chapterId: 'logs' },
    };
  }

  if (difficulty === 'medium') {
    const base = getChoice([10, 2]);
    const exp = getChoice([-2, -1, 1, 2, 3]);
    const value = base ** exp;
    const expression = base === 10 ? `log₁₀(${value})` : `log₂(${value})`;
    return {
      title: 'Compute the logarithm:',
      expression,
      correctAnswer: exp,
      meta: { chapterId: 'logs' },
    };
  }

  const base = getChoice([10, 2]);
  const value = base === 10 ? getChoice([0.1, 0.01, 5, 50]) : getChoice([0.5, 4, 8, 16]);
  const answer = round2(Math.log(value) / Math.log(base));
  const expression = base === 10 ? `log₁₀(${value})` : `log₂(${value})`;
  return {
    title: 'Compute the logarithm (round to 2 decimal places):',
    expression,
    correctAnswer: answer,
    meta: { chapterId: 'logs' },
  };
}

// 7. Algebraic expressions
function generateAlgebraQuestion(difficulty) {
  const { min, max } = getDifficultyConfig(difficulty);
  const x = getRandomInt(min, max);

  if (difficulty === 'easy') {
    const a = getRandomInt(1, 10);
    const b = getRandomInt(0, 10);
    const answer = a * x + b;
    return {
      title: 'Evaluate the expression:',
      expression: `${a}x + ${b}\nfor x = ${x}`,
      correctAnswer: answer,
      meta: { chapterId: 'algebra' },
    };
  }

  if (difficulty === 'medium') {
    const a = getRandomInt(1, 5);
    const b = getRandomInt(-5, 5);
    const c = getRandomInt(-10, 10);
    const answer = a * x * x + b * x + c;
    return {
      title: 'Evaluate the expression:',
      expression: `${a}x² + ${b}x + ${c}\nfor x = ${x}`,
      correctAnswer: answer,
      meta: { chapterId: 'algebra' },
    };
  }

  const a = getRandomInt(1, 5);
  const b = getRandomInt(-5, 5);
  const c = getRandomInt(-10, 10);
  const d = getRandomInt(-5, 5);
  const answer = round2(a * x * x + b * x + c + d / x);
  return {
    title: 'Evaluate the expression (round to 2 decimal places):',
    expression: `${a}x² + ${b}x + ${c} + ${d}/x\nfor x = ${x}`,
    correctAnswer: answer,
    meta: { chapterId: 'algebra' },
  };
}

// 8. Linear equations
function generateLinearQuestion(difficulty) {
  const x = getRandomInt(1, 40);

  if (difficulty === 'easy') {
    const a = getRandomInt(1, 10);
    const b = getRandomInt(0, 20);
    const c = a * x + b;
    return {
      title: 'Solve for x:',
      expression: `${a}x + ${b} = ${c}`,
      correctAnswer: x,
      meta: { chapterId: 'linear' },
    };
  }

  if (difficulty === 'medium') {
    const a = getRandomInt(2, 10);
    const b = getRandomInt(-20, 20);
    const c = a * x + b;
    return {
      title: 'Solve for x:',
      expression: `${a}x + ${b} = ${c}`,
      correctAnswer: x,
      meta: { chapterId: 'linear' },
    };
  }

  // hard – ax + b = dx + e
  let a = getRandomInt(1, 10);
  let d = getRandomInt(1, 10);
  while (d === a) {
    d = getRandomInt(1, 10);
  }
  const b = getRandomInt(-20, 20);
  const e = getRandomInt(-20, 20);
  const solution = (e - b) / (a - d);
  const answer = round2(solution);

  return {
    title: 'Solve for x (round to 2 decimal places if required):',
    expression: `${a}x + ${b} = ${d}x + ${e}`,
    correctAnswer: answer,
    meta: { chapterId: 'linear' },
  };
}

// 9. Trigonometry
const TRIG_DEG = [
  { angle: 0, sin: 0, cos: 1, tan: 0 },
  { angle: 30, sin: 0.5, cos: Math.sqrt(3) / 2, tan: 1 / Math.sqrt(3) },
  { angle: 45, sin: Math.sqrt(2) / 2, cos: Math.sqrt(2) / 2, tan: 1 },
  { angle: 60, sin: Math.sqrt(3) / 2, cos: 0.5, tan: Math.sqrt(3) },
  { angle: 90, sin: 1, cos: 0, tan: Infinity },
];

function generateTrigQuestion(difficulty) {
  const entry = getChoice(TRIG_DEG);
  const func = getChoice(['sin', 'cos', 'tan']);

  let value;
  if (func === 'sin') value = entry.sin;
  else if (func === 'cos') value = entry.cos;
  else value = entry.tan;

  if (!Number.isFinite(value)) {
    // avoid tan 90
    return generateTrigQuestion(difficulty);
  }

  if (difficulty === 'easy') {
    return {
      title: 'Evaluate:',
      expression: `${func}(${entry.angle}°)`,
      correctAnswer: value,
      meta: { chapterId: 'trig' },
    };
  }

  const answer = round2(value);
  return {
    title: 'Evaluate (round to 2 decimal places):',
    expression: `${func}(${entry.angle}°)`,
    correctAnswer: answer,
    meta: { chapterId: 'trig' },
  };
}

// 10. Compound Interest
function generateCompoundQuestion(difficulty) {
  const principal = getRandomInt(1000, 10000);
  const years = getRandomInt(1, 5);

  if (difficulty === 'easy') {
    const rate = getChoice([5, 8, 10]);
    const amount = principal * (1 + rate / 100) ** years;
    const answer = Math.round(amount);
    return {
      title: 'Compute the final amount (rounded to nearest rupee):',
      expression: `P = ₹${principal},  r = ${rate}%,  t = ${years} year(s),  compounding annually`,
      correctAnswer: answer,
      meta: { chapterId: 'compound' },
    };
  }

  if (difficulty === 'medium') {
    const rate = getChoice([6.5, 7.5, 9.5, 10.5]);
    const amount = principal * (1 + rate / 100) ** years;
    const answer = round2(amount);
    return {
      title: 'Compute the final amount (round to 2 decimal places):',
      expression: `P = ₹${principal},  r = ${rate}%,  t = ${years} year(s),  compounding annually`,
      correctAnswer: answer,
      meta: { chapterId: 'compound' },
    };
  }

  const rate = getChoice([6.5, 7.25, 8.75, 9.9]);
  const compounding = getChoice(['semiannually', 'quarterly']);
  const n = compounding === 'semiannually' ? 2 : 4;
  const totalPeriods = years * n;
  const amount = principal * (1 + rate / (100 * n)) ** totalPeriods;
  const answer = round2(amount);

  return {
    title: 'Compute the final amount (round to 2 decimal places):',
    expression: `P = ₹${principal},  r = ${rate}%,  t = ${years} year(s),  compounding ${compounding}`,
    correctAnswer: answer,
    meta: { chapterId: 'compound' },
  };
}

// Dispatcher
function generateQuestion(settings) {
  const { chapterId, difficulty } = settings;

  switch (chapterId) {
    case 'arithmetic':
      return generateArithmeticQuestion(difficulty);
    case 'squares':
      return generateSquaresQuestion(difficulty);
    case 'percentages':
      return generatePercentagesQuestion(difficulty);
    case 'ratios':
      return generateRatiosQuestion(difficulty);
    case 'exponents':
      return generateExponentsQuestion(difficulty);
    case 'logs':
      return generateLogsQuestion(difficulty);
    case 'algebra':
      return generateAlgebraQuestion(difficulty);
    case 'linear':
      return generateLinearQuestion(difficulty);
    case 'trig':
      return generateTrigQuestion(difficulty);
    case 'compound':
      return generateCompoundQuestion(difficulty);
    default:
      return generateArithmeticQuestion(difficulty);
  }
}

// ---------------- ENGINE HOOK ----------------

export function useMathSprintEngine() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState('menu'); // "menu" | "playing" | "summary"

  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_SETTINGS.durationSeconds);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');

  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Pause system
  const [isPaused, setIsPaused] = useState(false);
  const [pauseUntil, setPauseUntil] = useState(0);
  const [correctSolution, setCorrectSolution] = useState(null);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState(() => loadLeaderboard());
  const [hasSavedScore, setHasSavedScore] = useState(false);

  const resetStats = useCallback(() => {
    setScore(0);
    setTotalQuestions(0);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setUserAnswer('');
    setHasSavedScore(false);
    setIsPaused(false);
    setCorrectSolution(null);
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestion(generateQuestion(settings));
    setUserAnswer('');
  }, [settings]);

  const startGame = useCallback(() => {
    resetStats();
    setTimeRemaining(settings.durationSeconds);
    setCurrentQuestion(generateQuestion(settings));
    setPhase('playing');
  }, [resetStats, settings]);

  const goToMenu = useCallback(() => {
    setPhase('menu');
    setCurrentQuestion(null);
    setUserAnswer('');
    setTimeRemaining(settings.durationSeconds);
  }, [settings.durationSeconds]);

  const forceEndToSummary = useCallback(() => {
    setPhase('summary');
    setIsPaused(false);
    setCorrectSolution(null);
  }, []);

  const pauseForWrongAnswer = useCallback((correctAns) => {
    setIsPaused(true);
    setCorrectSolution(correctAns);
    setPauseUntil(Date.now() + 1200); // 1.2 seconds
  }, []);

  const submitAnswer = useCallback(() => {
    if (!currentQuestion || isPaused) return;

    const raw = userAnswer.trim().replace(',', '.');
    if (raw === '') return;

    const given = Number(raw);
    if (Number.isNaN(given)) return;

    const correct = currentQuestion.correctAnswer;
    const diff = Math.abs(given - correct);
    const isCorrectAnswer = diff <= 0.01;

    setTotalQuestions((prev) => prev + 1);

    if (isCorrectAnswer) {
      setCorrectCount((prev) => prev + 1);
      setScore((prev) => prev + 10);
      setStreak((prev) => {
        const next = prev + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
      nextQuestion();
    } else {
      setStreak(0);
      pauseForWrongAnswer(correct);
    }
  }, [currentQuestion, isPaused, userAnswer, nextQuestion, pauseForWrongAnswer]);

  // Pause interval to resume and move to next question
  useEffect(() => {
    if (!isPaused) return;

    const id = setInterval(() => {
      if (Date.now() >= pauseUntil) {
        setIsPaused(false);
        setCorrectSolution(null);
        clearInterval(id);
        nextQuestion();
      }
    }, 50);

    return () => clearInterval(id);
  }, [isPaused, pauseUntil, nextQuestion]);

  // Countdown timer (respects pause)
  useEffect(() => {
    if (phase !== 'playing') return;

    const id = setInterval(() => {
      setTimeRemaining((prev) => {
        if (isPaused) return prev;
        if (prev <= 1) {
          clearInterval(id);
          setPhase('summary');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [phase, isPaused]);

  const updateDuration = useCallback(
    (durationSeconds) => {
      setSettings((prev) => ({ ...prev, durationSeconds }));
      if (phase === 'menu') {
        setTimeRemaining(durationSeconds);
      }
    },
    [phase]
  );

  const updateDifficulty = useCallback((difficulty) => {
    setSettings((prev) => ({ ...prev, difficulty }));
  }, []);

  const updateChapter = useCallback((chapterId) => {
    setSettings((prev) => ({ ...prev, chapterId }));
  }, []);

  const accuracy = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

  const eligibleForHighScore = isHighScore(score);

  const saveScoreWithUsername = useCallback(
    (username) => {
      if (!eligibleForHighScore || hasSavedScore) return;
      if (!username) return;

      const trimmed = username.trim();
      if (!trimmed) return;

      const entry = {
        id: Date.now(),
        username: trimmed,
        score,
        accuracy,
        chapterId: settings.chapterId,
        difficulty: settings.difficulty,
        createdAt: new Date().toISOString(),
      };

      const updated = addScoreEntry(entry);
      setLeaderboard(updated);
      setHasSavedScore(true);
    },
    [eligibleForHighScore, hasSavedScore, score, accuracy, settings.chapterId, settings.difficulty]
  );

  return {
    CHAPTERS,
    // state
    phase,
    settings,
    timeRemaining,
    currentQuestion,
    userAnswer,
    score,
    totalQuestions,
    correctCount,
    streak,
    bestStreak,
    accuracy,
    leaderboard,
    eligibleForHighScore,
    hasSavedScore,
    isPaused,
    correctSolution,

    // handlers
    setUserAnswer,
    startGame,
    submitAnswer,
    goToMenu,
    updateDuration,
    updateDifficulty,
    updateChapter,
    forceEndToSummary,
    saveScoreWithUsername,
  };
}
