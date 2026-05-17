import styles from './style.module.css';

const FlipCard = ({ prompt, transcription, flipped, directionLabel }) => (
  <div
    className={`${styles.scene} ${flipped ? styles.flipped : ''}`}
    aria-live="polite"
  >
    <div className={styles.card}>
      <div className={`${styles.face} ${styles.front}`}>
        {directionLabel && (
          <span className={styles.badge}>{directionLabel}</span>
        )}
        <span className={styles.prompt}>{prompt}</span>
      </div>
      <div className={`${styles.face} ${styles.back}`}>
        <span className={styles.badge}>Транскрипция</span>
        <span className={styles.transcription}>{transcription || '—'}</span>
      </div>
    </div>
  </div>
);

export default FlipCard;
