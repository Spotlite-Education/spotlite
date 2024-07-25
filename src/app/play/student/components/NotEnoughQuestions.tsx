'use client';
import { GameState } from '@/types/GameState';
import styles from './NotEnoughQuestions.module.scss';

const NotEnoughQuestions = ({ gameState }: { gameState: GameState }) => {
  const submittedQuestion = gameState.playerInfo!.question.submitted;

  return (
    <div className={styles.wrapper}>
      <span
        className={`${styles.title} ${
          submittedQuestion ? styles.submitted : styles.notSubmitted
        }`}
      >
        {submittedQuestion ? 'One Moment!' : 'Woah!'}
      </span>
      {submittedQuestion ? (
        <p className={styles.description}>
          Looks like there weren&apos;t enough questions to start the game.
          <br />
          Don&apos;t worry though! Your teacher will handle this. (By the way:
          good job for submitting a question!)
        </p>
      ) : (
        <p className={styles.description}>
          Looks like there weren&apos;t enough questions to start the game. If
          you forgot, don&apos;t worry! You&apos;ll get a chance to in a moment.
          <br />
          Just make sure to click the submit button when you&apos;re done, or
          you and your classmates won&apos;t be able to play!
        </p>
      )}
    </div>
  );
};

export default NotEnoughQuestions;
