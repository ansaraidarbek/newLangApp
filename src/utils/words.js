import { countPercentage } from './countPercentage';
import { dateOffset } from './dates';

const ACCEPTANCE_THRESHOLD = 80;
const MIN_TRIALS_FOR_STRUGGLE = 2;

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const wordAcceptance = (w) =>
  countPercentage(w.trials || 0, w.success || 0, w.errors || 0);

export const isStruggling = (w) =>
  (w.trials || 0) >= MIN_TRIALS_FOR_STRUGGLE &&
  wordAcceptance(w) < ACCEPTANCE_THRESHOLD;

export const buildTestPool = (data) => {
  if (!data.length) return [];
  const last = data.length - 1;
  const seenKeys = new Set();
  const pool = [];

  const addItem = (dayIndex, wordIndex) => {
    const key = `${dayIndex}:${wordIndex}`;
    if (seenKeys.has(key)) return;
    seenKeys.add(key);
    pool.push({
      dayIndex,
      wordIndex,
      word: data[dayIndex].wordsDict[wordIndex],
    });
  };

  [last, last - 3, last - 8, last - 20]
    .filter((i) => i >= 0 && data[i])
    .forEach((dayIndex) => {
      data[dayIndex].wordsDict.forEach((_, wordIndex) =>
        addItem(dayIndex, wordIndex)
      );
    });

  data.forEach((day, dayIndex) => {
    day.wordsDict.forEach((w, wordIndex) => {
      if (isStruggling(w)) addItem(dayIndex, wordIndex);
    });
  });

  return shuffle(pool);
};

export const dailyAnalytics = (data, days = 7) => {
  const map = new Map();
  for (let i = 0; i < days; i++) {
    map.set(dateOffset(-i), {
      added: 0,
      mistakes: 0,
      attempts: 0,
      correct: 0,
    });
  }
  data.forEach((day) => {
    if (!map.has(day.date)) return;
    const entry = map.get(day.date);
    entry.added = day.wordsDict.length;
    day.wordsDict.forEach((w) => {
      entry.attempts += w.trials || 0;
      entry.correct += w.success || 0;
      entry.mistakes += w.errors || 0;
    });
  });
  return Array.from(map.entries())
    .map(([date, v]) => ({ date, ...v }))
    .reverse();
};

export const mostMistakenWords = (data, n = 5) => {
  const all = [];
  data.forEach((day) => {
    day.wordsDict.forEach((w) => {
      if ((w.errors || 0) > 0) {
        all.push({
          engWord: w.engWord,
          rusWord: w.rusWord,
          errors: w.errors || 0,
          trials: w.trials || 0,
          acceptance: wordAcceptance(w),
        });
      }
    });
  });
  return all.sort((a, b) => b.errors - a.errors).slice(0, n);
};

export const overallAcceptance = (data) => {
  let trials = 0;
  let success = 0;
  data.forEach((day) =>
    day.wordsDict.forEach((w) => {
      trials += w.trials || 0;
      success += w.success || 0;
    })
  );
  return countPercentage(trials, success, trials - success);
};

export const totalWords = (data) =>
  data.reduce((sum, day) => sum + day.wordsDict.length, 0);
