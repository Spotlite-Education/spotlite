import { GameState } from '@/types/GameState';
import styles from './StartingGame.module.scss';

export const StartingGame = ({ gameState }: { gameState: GameState }) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Starting the Game!</span>
      <span className={styles.secondsLeft}>
        {gameState.countdown.secondsLeft}
      </span>
    </div>
  );
};
