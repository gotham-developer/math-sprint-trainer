import { useEffect, useRef } from 'react';

export function GamePlay({
  timeRemaining,
  score,
  streak,
  bestStreak,
  totalQuestions,
  currentQuestion,
  userAnswer,
  onChangeAnswer,
  onSubmitAnswer,
  onEndEarly,
  isPaused,
  correctSolution,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestion, isPaused]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !isPaused) {
      onSubmitAnswer();
    }
    if (event.key === 'Escape') {
      onEndEarly();
    }
  };

  return (
    <div className='card shadow-sm border-0'>
      <div className='card-body'>
        {/* Header row */}
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <div>
            <h5 className='card-title mb-1'>Sprint</h5>
            <small className='text-muted'>Type your answer and press Enter. Escape ends the sprint.</small>
          </div>
          <button type='button' className='btn btn-outline-secondary btn-sm' onClick={onEndEarly}>
            End sprint
          </button>
        </div>

        {/* HUD */}
        <div className='row g-2 mb-4'>
          <div className='col-6 col-md-3'>
            <div className='border rounded-3 p-2 text-center bg-white'>
              <div className='small text-muted'>Time</div>
              <div className='fs-5 fw-semibold'>{timeRemaining}s</div>
            </div>
          </div>
          <div className='col-6 col-md-3'>
            <div className='border rounded-3 p-2 text-center bg-white'>
              <div className='small text-muted'>Score</div>
              <div className='fs-5 fw-semibold'>{score}</div>
            </div>
          </div>
          <div className='col-6 col-md-3'>
            <div className='border rounded-3 p-2 text-center bg-white'>
              <div className='small text-muted'>Streak</div>
              <div className='fw-semibold'>{streak}</div>
              <div className='small text-muted'>Best {bestStreak}</div>
            </div>
          </div>
          <div className='col-6 col-md-3'>
            <div className='border rounded-3 p-2 text-center bg-white'>
              <div className='small text-muted'>Questions</div>
              <div className='fs-5 fw-semibold'>{totalQuestions}</div>
            </div>
          </div>
        </div>

        {/* Feedback on wrong answer */}
        {isPaused && (
          <div className='alert alert-danger text-center mb-3 py-2'>
            <span className='fw-semibold'>Correct answer:</span> <span>{correctSolution}</span>
          </div>
        )}

        {/* Question and input */}
        {currentQuestion && (
          <div className='text-center'>
            <div className='mb-1 text-muted'>{currentQuestion.title}</div>
            <div className='fs-3 fw-semibold mb-3' style={{ whiteSpace: 'pre-line' }}>
              {currentQuestion.expression}
            </div>

            <div className='d-flex justify-content-center gap-2'>
              <input
                ref={inputRef}
                type='text'
                className='form-control form-control-lg'
                style={{ maxWidth: '260px' }}
                value={userAnswer}
                onChange={(e) => onChangeAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isPaused}
                placeholder='Answer'
                inputMode='decimal'
              />
              <button type='button' className='btn btn-lg btn-primary' onClick={onSubmitAnswer} disabled={isPaused}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
