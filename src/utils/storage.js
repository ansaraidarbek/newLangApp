import { SEED } from './seedWords';

const STORAGE_KEY = 'englishWords';
const CONFIRMED_KEY = 'newConfirmedEng';
const TEST_STATUS_KEY = 'testStatus';

export const ensureWordShape = (w) => ({
  engWord: w.engWord,
  rusWord: w.rusWord,
  transcription: w.transcription || '',
  trials: typeof w.trials === 'number' ? w.trials : 0,
  success: typeof w.success === 'number' ? w.success : 0,
  errors: typeof w.errors === 'number' ? w.errors : 0,
});

export const loadData = () => {
  let raw;
  try {
    raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    raw = [];
  }
  if (!Array.isArray(raw)) {
    const keys = Object.keys(raw).sort();
    raw = keys
      .filter((k) => Array.isArray(raw[k]))
      .map((k) => ({ date: k, wordsDict: raw[k] }));
  }
  return raw.map((day) => ({
    date: day.date,
    wordsDict: (day.wordsDict || []).map(ensureWordShape),
  }));
};

export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadTestStatus = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(TEST_STATUS_KEY)) || {
        correct: 0,
        total: 0,
      }
    );
  } catch {
    return { correct: 0, total: 0 };
  }
};

export const saveTestStatus = (s) => {
  localStorage.setItem(TEST_STATUS_KEY, JSON.stringify(s));
};

const isConfirmed = () => {
  try {
    return JSON.parse(localStorage.getItem(CONFIRMED_KEY) || 'false');
  } catch {
    return false;
  }
};

const setConfirmed = (v) => {
  localStorage.setItem(CONFIRMED_KEY, JSON.stringify(v));
};

export const seedIfEmpty = () => {
  if (isConfirmed()) return;
  if (loadData().length > 0) {
    setConfirmed(true);
    return;
  }
  const data = [];
  for (let i = SEED.length - 1; i >= 0; i--) {
    data.push({
      date: SEED[i][0],
      wordsDict: SEED[i][1].map(ensureWordShape),
    });
  }
  saveData(data);
  setConfirmed(true);
};
