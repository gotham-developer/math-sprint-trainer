import { useEffect, useRef, useState } from 'react';

export function GameSummary({
  score,
  totalQuestions,
  correctCount,
  accuracy,
  bestStreak,
  eligibleForHighScore,
  hasSavedScore,
  onSaveScore,
  onRestart,
  onBackToMenu,
}) {
  const [username, setUsername] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (eligibleForHighScore && !hasSavedScore && inputRef.current) {
      inputRef.current.focus();
    }
  }, [eligibleForHighScore, hasSavedScore]);

  const handleSave = (event) => {
    event.preventDefault();
    onSaveScore(username);
  };

  return (
    <div className='card shadow-sm border-0'>
      <div className='card-body'>
        <div className='mb-3'>
          <h5 className='card-title mb-1'>Results</h5>
          <small className='text-muted'>Review this sprint and save the result if you want to track it.</small>
        </div>

        <div className='row g-3 mb-3'>
          <div className='col-6 col-md-3'>
            <div className='border rounded-3 p-2 text-center bg-white'>
              <div className='small text-muted'>Score</div>
              <div className='fs-4 fw-semibold'>{score}</div>
            </div>
          </div>

          <div className='col-6 col-md-3'>
            <div className='border rounded-3 p-2 text-center bg-white'>
              <div className='small text-muted'>Questions</div>
              <div className='fs-4 fw-semibold'>{totalQuestions}</div>
            </div>
          </div>

          <div className='col-6 col-md-3'>
            <div className='border rounded-3 p-2 text-center bg-white'>
              <div className='small text-muted'>Correct</div>
              <div className='fs-4 fw-semibold'>{correctCount}</div>
            </div>
          </div>

          <div className='col-6 col-md-3'>
            <div className='border rounded-3 p-2 text-center bg-white'>
              <div className='small text-muted'>Accuracy</div>
              <div className='fs-4 fw-semibold'>{accuracy}%</div>
            </div>
          </div>
        </div>

        <div className='mb-3'>
          <div className='border rounded-3 p-2 text-center bg-white'>
            <div className='small text-muted'>Best streak</div>
            <div className='fs-5 fw-semibold'>{bestStreak}</div>
          </div>
        </div>

        {eligibleForHighScore && !hasSavedScore && (
          <form onSubmit={handleSave} className='border rounded-3 p-3 bg-light mb-3'>
            <div className='mb-2 fw-semibold'>Save this score</div>
            <div className='row g-2 align-items-center'>
              <div className='col-sm-8'>
                <input
                  ref={inputRef}
                  type='text'
                  className='form-control'
                  placeholder='Name (for leaderboard)'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='col-sm-4 d-grid'>
                <button type='submit' className='btn btn-primary' disabled={!username.trim()}>
                  Save
                </button>
              </div>
            </div>
          </form>
        )}

        {hasSavedScore && (
          <div className='alert alert-success py-2 mb-3'>Score saved to this browser’s leaderboard.</div>
        )}

        <div className='d-flex flex-wrap gap-2'>
          <button type='button' className='btn btn-primary' onClick={onRestart}>
            New sprint
          </button>
          <button type='button' className='btn btn-outline-secondary' onClick={onBackToMenu}>
            Back to setup
          </button>
        </div>
      </div>
    </div>
  );
}
