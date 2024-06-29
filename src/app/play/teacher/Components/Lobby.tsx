import { GameState } from '@/types/GameState';
import { socket } from '../../layout';
import { formatSeconds } from '@/app/util/format';
import styles from './Lobby.module.scss';
import { useState } from 'react';

const ChooseTopics = ({
  cachedTopics,
  returnToLobby,
}: {
  cachedTopics: string[];
  returnToLobby: Function;
}) => {
  const [topics, setTopics] = useState<string[]>(
    cachedTopics ? cachedTopics : new Array(4).fill('')
  );

  const handleAddNewTopic = () => {
    setTopics([...topics, ''].slice(0, 10));
  };

  const handleRemoveTopic = (i: number) => {
    if (topics.length <= 4) return; // don't allow removing the last 4 topics (required to start game)

    const newTopics = [...topics];
    newTopics.splice(i, 1);
    setTopics(newTopics);
  };

  const handleUpdateTopic = (i: number, newTopic: string) => {
    const newTopics = [...topics];
    newTopics[i] = newTopic;
    setTopics(newTopics);
  };

  const nonEmptyTopics = topics.filter(topic => topic.trim() !== '').length;

  return (
    <main className={styles.chooseTopics}>
      <div className={styles.centerContent}>
        <span className={styles.title}>Question Topics</span>
        <span>4 Required to Start Game</span>
        <div className={styles.buttonRow}>
          <button
            className={styles.goBack}
            onClick={() => returnToLobby(topics)}
          >
            Go Back
          </button>
          <button
            className={styles.addTopic}
            onClick={handleAddNewTopic}
            disabled={topics.length >= 10}
          >
            Add Another
          </button>
          <button className={styles.startGame} disabled={nonEmptyTopics < 4}>
            Start Game
          </button>
        </div>
        <div
          className={
            topics.length <= 5 ? styles.topicsNarrow : styles.topicsWide
          }
        >
          {topics.map((topic: string, i: number) => (
            <div key={i} className={styles.topic}>
              <div className={styles.index}>{i + 1}</div>
              <input
                value={topic}
                placeholder="Enter Topic Here..."
                onChange={e => handleUpdateTopic(i, e.target.value)}
              />
              {topics.length > 4 ? (
                <button
                  className={styles.removeTopic}
                  onClick={() => handleRemoveTopic(i)}
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export const Lobby = ({ gameState }: { gameState: GameState }) => {
  const [cachedTopics, setCachedTopics] = useState<string[]>(
    new Array(4).fill('')
  );
  const [choosingTopics, setChoosingTopics] = useState(false);

  const returnToLobbyAndCacheTopics = (topics: string[]) => {
    setChoosingTopics(false);
    setCachedTopics(topics);
  };

  if (choosingTopics) {
    return (
      <ChooseTopics
        cachedTopics={cachedTopics}
        returnToLobby={returnToLobbyAndCacheTopics}
      />
    );
  }

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
              disabled={gameState.settings.questionMakingTimeSeconds >= 60 * 10}
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
              disabled={gameState.settings.questionMakingTimeSeconds <= 30}
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
              disabled={
                gameState.settings.questionAnsweringTimeSeconds >= 60 * 10
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
              disabled={gameState.settings.questionAnsweringTimeSeconds <= 30}
            >
              –
            </button>
          </div>
        </div>
        <button
          className={styles.buttonSetting}
          style={{ width: '14.5rem' }}
          onClick={handleToggleRoomLock}
        >
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
        <button
          className={styles.selectTopics}
          onClick={() => setChoosingTopics(true)}
        >
          Select Question Topics
        </button>
      </div>
    </main>
  );
};
