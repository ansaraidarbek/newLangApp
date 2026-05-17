import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadData, saveData, ensureWordShape } from '../../utils/storage';
import { getFormattedDate } from '../../utils/dates';
import styles from './style.module.css';

const DAILY_LIMIT = 20;

const AddWord = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(() => loadData());
  const [notice, setNotice] = useState(null);
  const eng = useRef(null);
  const rus = useRef(null);
  const trs = useRef(null);

  const today = getFormattedDate();
  const lastIdx = data.length - 1;
  const todayCount =
    data[lastIdx]?.date === today ? data[lastIdx].wordsDict.length : 0;
  const limitReached = todayCount >= DAILY_LIMIT;

  const submit = (e) => {
    e.preventDefault();
    if (limitReached) {
      setNotice({ type: 'warn', msg: `Лимит сегодня — ${DAILY_LIMIT} слов.` });
      return;
    }
    const e1 = eng.current.value.trim();
    const r1 = rus.current.value.trim();
    if (!e1 || !r1) {
      setNotice({
        type: 'warn',
        msg: 'Заполните английское и русское слово.',
      });
      return;
    }
    const word = ensureWordShape({
      engWord: e1,
      rusWord: r1,
      transcription: trs.current.value.trim(),
    });
    const newData = [...data];
    if (newData[lastIdx]?.date === today) {
      newData[lastIdx] = {
        ...newData[lastIdx],
        wordsDict: [...newData[lastIdx].wordsDict, word],
      };
    } else {
      newData.push({ date: today, wordsDict: [word] });
    }
    saveData(newData);
    setData(newData);
    setNotice({
      type: 'ok',
      msg: `Добавлено: ${e1} → ${r1}`,
    });
    eng.current.value = '';
    rus.current.value = '';
    trs.current.value = '';
    eng.current.focus();
  };

  const progress = Math.min(100, (todayCount / DAILY_LIMIT) * 100);

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>
          ← Назад
        </button>
        <h1 className={styles.title}>Новое слово</h1>
        <span className={styles.counter}>
          {todayCount} / {DAILY_LIMIT}
        </span>
      </header>

      <div className={styles.progressTrack}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      {limitReached ? (
        <div className={styles.done}>
          <h2>Готово на сегодня! 🎉</h2>
          <p>Вы добавили {DAILY_LIMIT} слов. Возвращайтесь завтра.</p>
          <button
            className={styles.submit}
            onClick={() => navigate('/')}
          >
            На главную
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className={styles.form}>
          <label className={styles.label}>Английское слово</label>
          <input
            ref={eng}
            autoFocus
            autoComplete="off"
            className={styles.input}
            placeholder="example"
          />
          <label className={styles.label}>Транскрипция (необязательно)</label>
          <input
            ref={trs}
            autoComplete="off"
            className={styles.input}
            placeholder="[ɪɡˈzɑːmpəl]"
          />
          <label className={styles.label}>Русский перевод</label>
          <input
            ref={rus}
            autoComplete="off"
            className={styles.input}
            placeholder="пример"
          />
          <button type="submit" className={styles.submit}>
            Добавить
          </button>
        </form>
      )}

      {notice && (
        <div className={`${styles.notice} ${styles[notice.type]}`}>
          {notice.msg}
        </div>
      )}
    </div>
  );
};

export default AddWord;
