import { GameState } from '@/types/GameState';
import styles from './CreateQuestions.module.scss';
import { formatSeconds } from '@/app/util/format';
import { socket } from '../../layout';
import { CompletePlayerInfo } from '@/types/Player';

const CreateQuestions = ({ gameState }: { gameState: GameState }) => {
  // make the type checker happy
  if (gameState.playerInfo) {
    return null;
  }

  const handleAddTime = () => {
    socket.emit('addQuestionMakingTime');
  };

  const numPlayersSubmitted = gameState.players.filter(
    (player: CompletePlayerInfo) => player.question.submitted
  ).length;

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Go go go!! Create your questions!</span>
      <span className={styles.timeLeft}>
        {formatSeconds(gameState.countdown.secondsLeft)}
      </span>
      <span className={styles.submittedQuestionCount}>
        {numPlayersSubmitted} / {gameState.players.length}{' '}
        {numPlayersSubmitted === 1 ? 'Player' : 'Players'} Submitted
      </span>
      <div className={styles.actions}>
        <button
          className={styles.forceStart}
          disabled={numPlayersSubmitted < 2}
        >
          Force Start
        </button>
        <button
          onClick={handleAddTime}
          disabled={gameState.countdown.secondsLeft > 10 * 60 - 30}
        >
          Add 30 Seconds
        </button>
      </div>
    </div>
  );
};

export default CreateQuestions;
