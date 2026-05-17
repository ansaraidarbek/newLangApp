import styles from './style.module.css';
import {
  dailyAnalytics,
  mostMistakenWords,
  overallAcceptance,
  totalWords,
} from '../../utils/words';

const Analytics = ({ data }) => {
  const days = dailyAnalytics(data, 7);
  const mistaken = mostMistakenWords(data, 5);
  const acceptance = overallAcceptance(data);
  const total = totalWords(data);
  const maxAdded = Math.max(1, ...days.map((d) => d.added));

  return (
    <section className={styles.wrap}>
      <div className={styles.statRow}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Всего слов</p>
          <h3 className={styles.statValue}>{total}</h3>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Усвоение</p>
          <h3 className={styles.statValue}>{acceptance.toFixed(0)}%</h3>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Дней с практикой</p>
          <h3 className={styles.statValue}>
            {days.filter((d) => d.added > 0).length}
          </h3>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Слова за 7 дней</h3>
      <div className={styles.bars}>
        {days.map((d) => (
          <div key={d.date} className={styles.barCol}>
            <span className={styles.barCount}>{d.added}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.bar}
                style={{ height: `${(d.added / maxAdded) * 100}%` }}
                title={`${d.added} добавлено · ${d.mistakes} ошибок`}
              />
              {d.mistakes > 0 && (
                <div
                  className={styles.barMistakes}
                  style={{
                    height: `${
                      (d.mistakes / Math.max(d.attempts, 1)) *
                      (d.added / maxAdded) *
                      100
                    }%`,
                  }}
                />
              )}
            </div>
            <span className={styles.barLabel}>{d.date.slice(0, 5)}</span>
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>Сложные слова</h3>
      {mistaken.length === 0 ? (
        <p className={styles.empty}>
          Пока нет данных — пройдите тест, чтобы узнать слабые места.
        </p>
      ) : (
        <ul className={styles.list}>
          {mistaken.map((w, i) => (
            <li key={`${w.engWord}-${i}`} className={styles.listItem}>
              <span className={styles.word}>
                <b>{w.engWord}</b> — {w.rusWord}
              </span>
              <span className={styles.meta}>
                <span className={styles.mistakes}>{w.errors} ош.</span>
                <span className={styles.acceptance}>
                  {w.acceptance.toFixed(0)}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Analytics;
