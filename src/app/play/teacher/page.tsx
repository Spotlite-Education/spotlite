'use client';
import { GameStateContext } from '@/context/GameStateContext';
import { useContext, useEffect } from 'react';
import styles from './page.module.scss';
import { formatSeconds } from '@/app/util/format';
import { socket } from '../layout';

const TeacherPlay = () => {
  // game state is guaranteed to exist by /play/layout.tsx
  const gameState = useContext(GameStateContext)!;

  useEffect(() => {
    console.log({ gameState });
  }, [gameState]);

  const numPlayers = gameState.players.length;
  const minPlayersNeeded = 2 - numPlayers;

  const handleUpdateQuestionMakingTime = (newTime: number) => {
    socket.emit('updateGameSettings', { questionMakingTimeSeconds: newTime });
  };

  const handleUpdateQuestionAnsweringTime = (newTime: number) => {
    socket.emit('updateGameSettings', {
      questionAnsweringTimeSeconds: newTime,
    });
  };

  const handleToggleRoomLock = () => {
    socket.emit('toggleRoomLock');
  };

  return (
    <main className={styles.main}>
      <div className={styles.settings}>
        <div className={styles.timeSetting}>
          <span className={styles.label}>
            Question Making:{' '}
            {formatSeconds(gameState.settings.questionMakingTimeSeconds)}
          </span>
          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={() =>
                handleUpdateQuestionMakingTime(
                  gameState.settings.questionMakingTimeSeconds + 30
                )
              }
            >
              +
            </button>
            <button
              className={styles.button}
              onClick={() =>
                handleUpdateQuestionMakingTime(
                  gameState.settings.questionMakingTimeSeconds - 30
                )
              }
            >
              –
            </button>
          </div>
        </div>
        <div className={styles.timeSetting}>
          <span className={styles.label}>
            Question Answering:{' '}
            {formatSeconds(gameState.settings.questionAnsweringTimeSeconds)}
          </span>
          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={() =>
                handleUpdateQuestionAnsweringTime(
                  gameState.settings.questionAnsweringTimeSeconds + 30
                )
              }
            >
              +
            </button>
            <button
              className={styles.button}
              onClick={() =>
                handleUpdateQuestionAnsweringTime(
                  gameState.settings.questionAnsweringTimeSeconds - 30
                )
              }
            >
              –
            </button>
          </div>
        </div>
        <button className={styles.buttonSetting} onClick={handleToggleRoomLock}>
          {gameState.settings.locked ? 'Unlock Room' : 'Lock Room'}
        </button>
      </div>
      <div className={styles.centerContent}>
        <div className={styles.tag}>
          Go Go Go!! Join this game at tossit.org
        </div>
        <span className={styles.roomCode}>{gameState.ID}</span>
        <span className={styles.numPlayers}>
          {numPlayers}{' '}
          {numPlayers === 1 ? 'Player Has Joined' : 'Players Have Joined'}
          {minPlayersNeeded > 0
            ? ` (${minPlayersNeeded} More Required To Play)`
            : ''}
        </span>
        <button className={styles.selectTopics}>Select Question Topics</button>
      </div>
    </main>
  );
};

export default TeacherPlay;
