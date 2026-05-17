import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadData, saveData, saveTestStatus } from '../../utils/storage';
import { buildTestPool, wordAcceptance } from '../../utils/words';
import FlipCard from '../../components/FlipCard';
import styles from './style.module.css';

const COUNTDOWN_START = 3;

const Test = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(() => loadData());
  const [pool] = useState(() =>
    buildTestPool(data).map((item) => ({
      ...item,
      direction: Math.random() < 0.5 ? 'eng2rus' : 'rus2eng',
    }))
  );

  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [feedback, setFeedback] = useState('idle');
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef(null);

  const empty = pool.length === 0;

  useEffect(() => {
    if (started || empty) return;
    const id = setTimeout(() => {
      if (countdown <= 1) setStarted(true);
      else setCountdown((t) => t - 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [countdown, started, empty]);

  useEffect(() => {
    if (started && inputRef.current) inputRef.current.focus();
  }, [started, index]);

  if (empty) {
    return (
      <div className={styles.wrap}>
        <header className={styles.header}>
          <button className={styles.back} onClick={() => navigate('/')}>
            ← Назад
          </button>
          <h1 className={styles.title}>Тест</h1>
          <span className={styles.spacer} />
        </header>
        <div className={styles.emptyState}>
          <h2>Нет слов для теста</h2>
          <p>Сначала добавьте хотя бы одно слово.</p>
          <button className={styles.primary} onClick={() => navigate('/add')}>
            Добавить слово
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className={styles.wrap}>
        <div className={styles.countdown}>
          <p className={styles.countdownLabel}>Тест начнётся через</p>
          <h1 className={styles.bigNumber}>{countdown}</h1>
          <p className={styles.countdownHint}>
            {pool.length} {pool.length === 1 ? 'слово' : 'слов'} в подборке
          </p>
          <button
            className={styles.back}
            onClick={() => navigate('/')}
          >
            Отменить
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = stats.total
      ? Math.round((stats.correct / stats.total) * 100)
      : 0;
    return (
      <div className={styles.wrap}>
        <div className={styles.results}>
          <p className={styles.resultLabel}>Тест пройден</p>
          <h1 className={styles.resultScore}>
            {stats.correct} / {stats.total}
          </h1>
          <p className={styles.resultPct}>{pct}% правильных ответов</p>
          <div className={styles.resultActions}>
            <button
              className={styles.secondary}
              onClick={() => navigate('/')}
            >
              На главную
            </button>
            <button
              className={styles.primary}
              onClick={() => window.location.reload()}
            >
              Ещё раз
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = pool[index];
  const isEng2Rus = current.direction === 'eng2rus';
  const prompt = isEng2Rus ? current.word.engWord : current.word.rusWord;
  const expected = (isEng2Rus
    ? current.word.rusWord
    : current.word.engWord
  ).toLowerCase();
  const directionLabel = isEng2Rus ? 'EN → RU' : 'RU → EN';
  const acceptanceNow = wordAcceptance(current.word);

  const persistAnswer = (correct) => {
    setData((prev) => {
      const next = [...prev];
      const day = next[current.dayIndex];
      const newWords = [...day.wordsDict];
      const w = newWords[current.wordIndex];
      newWords[current.wordIndex] = {
        ...w,
        trials: (w.trials || 0) + 1,
        success: (w.success || 0) + (correct ? 1 : 0),
        errors: (w.errors || 0) + (correct ? 0 : 1),
      };
      next[current.dayIndex] = { ...day, wordsDict: newWords };
      saveData(next);
      return next;
    });
  };

  const onChange = () => {
    if (revealed) return;
    const v = (inputRef.current?.value || '').trim().toLowerCase();
    if (!v) setFeedback('idle');
    else if (v === expected) setFeedback('correct');
    else setFeedback('wrong');
  };

  const onReveal = () => setRevealed(true);

  const onNext = () => {
    const v = (inputRef.current?.value || '').trim().toLowerCase();
    const correct = !revealed && v === expected;
    persistAnswer(correct);

    const isLast = index + 1 >= pool.length;
    const nextStats = {
      correct: stats.correct + (correct ? 1 : 0),
      total: stats.total + 1,
    };
    setStats(nextStats);

    if (isLast) {
      saveTestStatus(nextStats);
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
    setFeedback('idle');
    if (inputRef.current) inputRef.current.value = '';
  };

  const onKey = (e) => {
    if (e.key === 'Enter') onNext();
  };

  const progressPct = ((index) / pool.length) * 100;
  const hasTranscription = !!current.word.transcription;

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button
          className={styles.back}
          onClick={() => {
            if (window.confirm('Прервать тест?')) navigate('/');
          }}
        >
          ✕
        </button>
        <div className={styles.headerMeta}>
          <span>
            {index + 1} / {pool.length}
          </span>
          <span className={styles.score}>
            ✓ {stats.correct} · ✗ {stats.total - stats.correct}
          </span>
        </div>
      </header>

      <div className={styles.progressTrack}>
        <div
          className={styles.progressBar}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <FlipCard
        prompt={prompt}
        transcription={current.word.transcription}
        flipped={revealed}
        directionLabel={directionLabel}
      />

      <div className={styles.acceptanceLine}>
        Усвоение: {acceptanceNow.toFixed(0)}% ·
        {' '}попыток: {current.word.trials || 0}
      </div>

      <input
        ref={inputRef}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        className={`${styles.input} ${styles[feedback]}`}
        placeholder={isEng2Rus ? 'Ваш перевод…' : 'Your translation…'}
        onChange={onChange}
        onKeyDown={onKey}
        disabled={revealed}
      />

      <div className={styles.actionsRow}>
        {hasTranscription && (
          <button
            className={styles.reveal}
            onClick={onReveal}
            disabled={revealed}
            title="Засчитается как ошибка"
          >
            👁 Транскрипция
          </button>
        )}
        <button className={styles.next} onClick={onNext}>
          Дальше →
        </button>
      </div>
    </div>
  );
};

export default Test;
