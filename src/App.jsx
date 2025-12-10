import { GameConfig } from './components/GameConfig.jsx';
import { GamePlay } from './components/GamePlay.jsx';
import { GameSummary } from './components/GameSummary.jsx';
import { Leaderboard } from './components/Leaderboard.jsx';
import { useMathSprintEngine } from './hooks/useMathSprintEngine.js';

function App() {
  const {
    CHAPTERS,
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

    setUserAnswer,
    startGame,
    submitAnswer,
    goToMenu,
    updateDuration,
    updateDifficulty,
    updateChapter,
    forceEndToSummary,
    saveScoreWithUsername,
  } = useMathSprintEngine();

  const handleEndEarly = () => forceEndToSummary();
  const handleRestart = () => startGame();

  return (
    <div className='bg-light min-vh-100'>
      {/* Top Bar */}
      <header className='border-bottom bg-white'>
        <div className='container py-2'>
          <div className='fw-semibold'>Math Sprint Trainer</div>
          <small className='text-muted'>Timed practice for core math skills</small>
        </div>
      </header>

      <main className='container py-4'>
        {/* MAIN GAME AREA */}
        <div className='row justify-content-center mb-4'>
          <div className='col-12 col-lg-8'>
            {phase === 'menu' && (
              <GameConfig
                settings={settings}
                chapters={CHAPTERS}
                onUpdateDuration={updateDuration}
                onUpdateDifficulty={updateDifficulty}
                onUpdateChapter={updateChapter}
                onStart={startGame}
              />
            )}

            {phase === 'playing' && (
              <GamePlay
                timeRemaining={timeRemaining}
                score={score}
                streak={streak}
                bestStreak={bestStreak}
                totalQuestions={totalQuestions}
                currentQuestion={currentQuestion}
                userAnswer={userAnswer}
                onChangeAnswer={setUserAnswer}
                onSubmitAnswer={submitAnswer}
                onEndEarly={handleEndEarly}
                isPaused={isPaused}
                correctSolution={correctSolution}
              />
            )}

            {phase === 'summary' && (
              <GameSummary
                score={score}
                totalQuestions={totalQuestions}
                correctCount={correctCount}
                accuracy={accuracy}
                bestStreak={bestStreak}
                eligibleForHighScore={eligibleForHighScore}
                hasSavedScore={hasSavedScore}
                onSaveScore={saveScoreWithUsername}
                onRestart={handleRestart}
                onBackToMenu={goToMenu}
              />
            )}
          </div>
        </div>

        {/* LEADERBOARD FULL WIDTH BELOW */}
        <div className='row justify-content-center'>
          <div className='col-12 col-xl-10'>
            <Leaderboard entries={leaderboard} />
          </div>
        </div>
      </main>

      <footer className='border-top bg-white text-center py-2'>
        <small className='text-muted'>Math Sprint Trainer · React · Vite · Bootstrap</small>
      </footer>
    </div>
  );
}

export default App;
