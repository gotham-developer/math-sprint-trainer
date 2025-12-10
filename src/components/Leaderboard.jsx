import { CHAPTERS } from '../hooks/useMathSprintEngine.js';

const chapterMap = Object.fromEntries(CHAPTERS.map((c) => [c.id, c.label]));

function formatDifficulty(level) {
  if (!level) return '';
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function Leaderboard({ entries }) {
  return (
    <div className='card shadow-sm border-0 mb-4'>
      <div className='card-body'>
        <h5 className='card-title mb-1'>Leaderboard</h5>
        <small className='text-muted'>Top scores stored locally</small>

        <div className='mt-3 table-responsive-md'>
          <table className='table table-striped align-middle'>
            <thead className='table-light'>
              <tr>
                <th style={{ minWidth: '50px' }}>#</th>
                <th style={{ minWidth: '180px' }}>Player</th>
                <th style={{ minWidth: '100px' }}>Score</th>
                <th style={{ minWidth: '120px' }}>Accuracy (%)</th>
                <th style={{ minWidth: '220px' }}>Chapter</th>
                <th style={{ minWidth: '130px' }}>Difficulty</th>
              </tr>
            </thead>

            <tbody>
              {(!entries || entries.length === 0) && (
                <tr>
                  <td colSpan='6' className='text-center text-muted py-3'>
                    No scores yet.
                  </td>
                </tr>
              )}

              {entries?.map((e, i) => {
                const date = e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '-';

                return (
                  <tr key={e.id ?? i} style={{ height: '55px' }}>
                    <td className='fw-semibold'>{i + 1}</td>

                    <td>
                      <div className='d-flex flex-column'>
                        <span className='fw-semibold'>{e.username}</span>
                        <small className='text-muted'>{date}</small>
                      </div>
                    </td>

                    <td className='fw-semibold'>{e.score}</td>

                    <td>{e.accuracy}%</td>

                    <td>{chapterMap[e.chapterId] ?? e.chapterId}</td>

                    <td>{formatDifficulty(e.difficulty)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
