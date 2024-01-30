import styles from './Guess.module.scss';

interface GuessProps {
  name: string;
  guess: string;
  correct: boolean;
  points: number;
}

const Guess = ({ name, guess, correct, points }: GuessProps) => {
  return (
    <>
      {correct ? (
        <div
          className={styles.guess}
          style={{
            backgroundColor: 'var(--accent-color)',
          }}
        >
          <div>{name}</div>
          <div>{points}</div>
        </div>
      ) : (
        <div
          className={styles.guess}
          style={{
            backgroundColor: 'var(--input-text-color)',
          }}
        >
          <div>{name}</div>
          <div>{guess}</div>
        </div>
      )}
    </>
  );
};

export default Guess;
