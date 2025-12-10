export function GameConfig({ settings, chapters, onUpdateDuration, onUpdateDifficulty, onUpdateChapter, onStart }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onStart();
  };

  return (
    <div className='card shadow-sm border-0'>
      <div className='card-body'>
        <div className='mb-3'>
          <h5 className='card-title mb-1'>Setup</h5>
          <small className='text-muted'>Choose what you want to practice and how long the sprint should run.</small>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='form-label fw-semibold'>Chapter</label>
            <select
              className='form-select'
              value={settings.chapterId}
              onChange={(e) => onUpdateChapter(e.target.value)}>
              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.label}
                </option>
              ))}
            </select>
          </div>

          <div className='row g-3'>
            <div className='col-md-6'>
              <label className='form-label fw-semibold'>Duration</label>
              <select
                className='form-select'
                value={settings.durationSeconds}
                onChange={(e) => onUpdateDuration(Number(e.target.value))}>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
              </select>
              <small className='text-muted d-block mt-1'>Short sprints help you stay focused.</small>
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-semibold'>Difficulty</label>
              <select
                className='form-select'
                value={settings.difficulty}
                onChange={(e) => onUpdateDifficulty(e.target.value)}>
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Hard</option>
              </select>
              <small className='text-muted d-block mt-1'>For decimal results, answer to 2 decimal places.</small>
            </div>
          </div>

          <div className='d-flex justify-content-end mt-4'>
            <button type='submit' className='btn btn-primary px-4'>
              Start sprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
