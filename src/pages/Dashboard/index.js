import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadData, loadTestStatus } from '../../utils/storage';
import { getFormattedDate } from '../../utils/dates';
import Analytics from '../../components/Analytics';
import styles from './style.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data] = useState(() => loadData());
  const testStatus = loadTestStatus();
  const today = getFormattedDate();
  const lastDay = data[data.length - 1];
  const todayCount = lastDay?.date === today ? lastDay.wordsDict.length : 0;

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Учим английский</h1>
        <p className={styles.subtitle}>Интервальное повторение</p>
      </header>

      <section className={styles.heroRow}>
        <div className={styles.heroCard}>
          <p className={styles.heroLabel}>Последний тест</p>
          <h2 className={styles.heroValue}>
            {testStatus.correct}
            <span className={styles.heroSlash}> / {testStatus.total}</span>
          </h2>
        </div>
        <div className={styles.heroCard}>
          <p className={styles.heroLabel}>Сегодня</p>
          <h2 className={styles.heroValue}>
            {todayCount}
            <span className={styles.heroSlash}> / 20</span>
          </h2>
        </div>
      </section>

      <section className={styles.actions}>
        <button
          className={`${styles.action} ${styles.primary}`}
          onClick={() => navigate('/add')}
        >
          <span className={styles.actionIcon}>＋</span>
          <span>Добавить слово</span>
        </button>
        <button
          className={`${styles.action} ${styles.secondary}`}
          onClick={() => navigate('/test')}
          disabled={data.length === 0}
        >
          <span className={styles.actionIcon}>▶</span>
          <span>Начать тест</span>
        </button>
      </section>

      <Analytics data={data} />
    </div>
  );
};

export default Dashboard;
