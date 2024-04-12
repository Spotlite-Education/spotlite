'use client';
import Header from '@/app/components/Header';
import styles from './page.module.scss';
import Input, { IconInput } from '@/app/components/Input';
import { useEffect, useState, useCallback } from 'react';
import Button from '@/app/components/Button';
import { FaArrowDown, FaArrowUp, FaTimes } from 'react-icons/fa';
import Note from '@/app/components/Note';
import { GiQueenCrown } from 'react-icons/gi';
import { formatSeconds } from '@/app/util/format';
import { render } from 'react-dom';
import Paper from '@/app/components/Paper';
import Guess from '@/app/components/Guess';
import socket from '../../../context/socket';

interface LobbyProps {
  roomCode: string;
  players: string[];
  changeStatus: (newStatus: string) => void;
}

const Lobby = ({ changeStatus, roomCode, players }: LobbyProps) => {
  useEffect(() => {
    socket.emit('refreshLobby', roomCode, sessionStorage.getItem('sessionID'));
  }, []);

  return (
    <div className={styles.lobby}>
      <div className={styles.roomSettings}>
        <div className={styles.roomCodeDetails}>
          <div className={styles.subtleText}>Your room code is</div>
          <div className={styles.roomCode}>{roomCode}</div>
        </div>
        <div className={styles.settings}>
          <div>
            <div className={styles.subtleText}>Question Creation Time</div>
            <div className={styles.time}>3:00</div>
          </div>
          <div>
            <div className={styles.subtleText}>Question Answering Timed</div>
            <div className={styles.time}>1:00</div>
          </div>
        </div>
      </div>
      <div className={styles.players}>
        <div className={styles.playerCount}>
          <div className={styles.number}>{players.length}</div>
          <div className={styles.text}>
            {players.length === 1 ? 'Player' : 'Players'}
          </div>
        </div>
        <div className={styles.playerList}>
          {players.map(({ id, username }) => (
            <Button key={id} className={styles.item}>
              {username}
            </Button>
          ))}
        </div>
      </div>
      <Button
        onClick={e => {
          changeStatus('chooseTopics');
        }}
        className={styles.startGame}
      >
        Start Game
      </Button>
    </div>
  );
};

const ChooseTopics = ({
  changeStatus,
}: {
  changeStatus: (newStatus: string) => void;
}) => {
  const [topics, setTopics] = useState<string[]>([]);

  const handleAddTopic = () => {
    setTopics(prev => [...prev, '']);
  };

  const handleEditTopic = (index: number, value: string) => {
    const copy = topics.slice();
    copy[index] = value;
    setTopics(copy);
  };

  const handleDeleteTopic = (index: number) => {
    const copy = topics.slice();
    copy.splice(index, 1);
    setTopics(copy);
  };

  const DeleteTopic = ({ index }: { index: number }) => (
    <button
      className={styles.deleteTopic}
      onClick={() => handleDeleteTopic(index)}
    >
      <FaTimes size="2rem" color="var(--input-placeholder-color)" />
    </button>
  );

  return (
    <div className={styles.chooseTopics}>
      <Header>WHAT TOPICS SHOULD STUDENTS COVER?</Header>
      <div className={styles.topics}>
        {topics.length === 0 ? <Note>There's nothing here...</Note> : null}
        {topics.map((topic, i) => (
          <IconInput
            className={styles.topic}
            placeholder="Some topic..."
            value={topic}
            onChange={e => handleEditTopic(i, e.target.value)}
            right={<DeleteTopic index={i} />}
          />
        ))}
      </div>
      <button
        className={styles.addTopic}
        disabled={topics.length >= 4}
        onClick={handleAddTopic}
      >
        +
      </button>
      <Button
        onClick={e => {
          socket.emit('createGame', topics, 7, 5);
          changeStatus('countdown');
        }}
        className={styles.hostRoom}
        fill="secondary"
      >
        Start Game
      </Button>
    </div>
  );
};

const Countdown = ({ secondsLeft }: { secondsLeft: number }) => {
  return (
    <div className={styles.centeredWrapper}>
      <div className={styles.header}>Create your quiz questions!</div>
      <div className={styles.timeLeft}>{formatSeconds(secondsLeft)}</div>
    </div>
  );
};

const RevealQuizzer = ({ quizzer }: { quizzer: string }) => {
  return (
    <div className={styles.centeredWrapper}>
      <div className={styles.quizzer}>{quizzer}</div>
      <div className={styles.isTheQuizzer}>is the quizzer...</div>
    </div>
  );
};

const QuizQuestion = ({
  quizzerID,
  quizzerUsername,
  secondsLeft,
  question,
  guesses,
}: {
  quizzerID: string;
  quizzerUsername: string;
  secondsLeft: number;
  question: string;
  guesses: {
    username: string;
    guess: string;
    correct: boolean;
    points: number;
  }[];
}) => {
  return (
    <div className={styles.quizQuestionWrapper}>
      <div className={styles.timer}>{formatSeconds(secondsLeft)}</div>

      <Paper className={styles.quizQuestion}>
        {quizzerUsername} is the quizzer...
        <div>{question}</div>
      </Paper>
      <div className={styles.gridRight}>
        <Paper>Hint:</Paper>
        <div className={styles.guesses}>
          {guesses
            .slice(0, 3)
            .reverse()
            .map(guess => (
              <Guess
                name={guess.username}
                guess={guess.guess}
                correct={guess.correct}
                points={guess.points}
              ></Guess>
            ))}
        </div>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState({});

  useEffect(() => {
    socket.emit('getLeaderboard', leaderboard => {
      console.log(leaderboard);
      setLeaderboard(leaderboard);
    });
  }, []);

  return (
    <div className={styles.leaderboardWrapper}>
      {Object.entries(leaderboard).map(([key, player], i) => (
        <div
          className={styles.leaderboardItem}
          style={{
            color: i === 0 ? 'var(--accent-color)' : undefined,
            backgroundColor:
              i === 0
                ? 'var(--text-color)'
                : i >= 3
                ? 'var(--dark-orange)'
                : 'var(--accent-color)',
          }}
        >
          {i === 0 && <GiQueenCrown size="4.5rem" fill="var(--accent-color)" />}
          <div className={styles.name}>{player.username}</div>
          <div className={styles.score}>
            {player.points}
            <div className={styles.icon}>
              {player.ascended ? (
                <FaArrowUp size="3rem" />
              ) : (
                <FaArrowDown size="3rem" />
              )}
            </div>
          </div>
        </div>
      ))}
      <Button
        //onClick={e => changeStatus('podium', 'showPodium')}
        className={styles.nextButton}
      >
        Next
      </Button>
    </div>
  );
};

const Podium = () => {
  const [leaderboard, setLeaderboard] = useState({});

  useEffect(() => {
    socket.emit('getLeaderboard', leaderboard => {
      setLeaderboard(Object.entries(leaderboard).values);
    });
  }, []);

  return (
    <div className={styles.podiumWrapper}>
      <Button className={styles.seeQuestionBank}>See Question Bank</Button>
      <div className={styles.backgroundPillars}>
        {Object.entries(leaderboard).length > 2 ? (
          <div className={styles.pillarWrapper} style={{ height: '50%' }}>
            <div className={styles.player}>{leaderboard[2].username}</div>
            <div className={styles.pillar} />
          </div>
        ) : (
          <div></div>
        )}
        {Object.entries(leaderboard).length > 0 ? (
          <div className={styles.pillarWrapper} style={{ height: '82.5%' }}>
            <div
              className={styles.player}
              style={{
                width: '48rem',
                height: '12rem',
                boxShadow: '0px 0px 65px var(--brand-color)',
                fontSize: '5rem',
              }}
            >
              <GiQueenCrown size="7.5rem" style={{ marginRight: '3.5rem' }} />
              {Object.entries(leaderboard)[0].username}
            </div>
            <div className={styles.pillar} />
          </div>
        ) : (
          <div></div>
        )}

        {Object.entries(leaderboard).length > 1 ? (
          <div className={styles.pillarWrapper} style={{ height: '60%' }}>
            <div className={styles.player}>
              {Object.entries(leaderboard)[1].username}
            </div>
            <div className={styles.pillar} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className={styles.foregroundPillars}>
        {Object.entries(leaderboard).length > 4 ? (
          <div className={styles.pillarWrapper} style={{ height: '25%' }}>
            <div className={styles.player}>
              {Object.entries(leaderboard)[4].username}
            </div>
            <div className={styles.pillar} />
          </div>
        ) : (
          <div></div>
        )}
        {Object.entries(leaderboard).length > 3 ? (
          <div className={styles.pillarWrapper} style={{ height: '35%' }}>
            <div className={styles.player}>
              {Object.entries(leaderboard)[3].username}
            </div>
            <div className={styles.pillar} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const AdminPage = ({ params }: { params: { roomCode: string } }) => {
  const [status, setStatus] = useState('lobby');
  const [players, setPlayers] = useState([]);
  const [quizzerID, setQuizzerID] = useState('');
  const [quizzerUsername, setQuizzerUsername] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number>(0.2 * 60);
  const [question, setQuestion] = useState('');
  const [guesses, setGuesses] = useState([]);

  const changeStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  useEffect(() => {
    const handleGameStateChange = game => {
      setSecondsLeft(game.countdown);
      switch (game.state) {
        case 'choosing quizzer':
          setQuizzerID(game.quizzer.id);
          setQuizzerUsername(game.quizzer.username);
          changeStatus('revealQuizzer');
          break;
        case 'answerQuestion':
          changeStatus('quizQuestion');
          break;
        case 'leaderboardPosition':
          changeStatus('leaderboard');
          break;
        case 'end':
          changeStatus('podium');
      }
    };

    const handleUpdateSpotlitQuestion = question => {
      setQuestion(question);
    };

    const handleLobbyUpdate = players => {
      setPlayers(players);
    };

    const handleNewGuess = guesses => {
      console.log(guesses);
      setGuesses(guesses);
    };

    socket.on('updateSpotlitQuestion', handleUpdateSpotlitQuestion);
    socket.on('lobbyUpdate', handleLobbyUpdate);
    socket.on('gameStateChange', handleGameStateChange);
    socket.on('newGuess', handleNewGuess);

    return () => {
      socket.off('lobbyUpdate', handleLobbyUpdate);
      socket.off('gameStateChange', handleGameStateChange);
      socket.off('updateSpotlitQuestion', handleUpdateSpotlitQuestion);
      socket.off('newGuess', handleNewGuess);
    };
  }, [status]);

  const renderComponent = (component: string) => {
    switch (component) {
      case 'lobby':
        return (
          <Lobby
            changeStatus={changeStatus}
            roomCode={params.roomCode}
            players={players}
          />
        );
      case 'chooseTopics':
        return <ChooseTopics changeStatus={changeStatus} />;
      case 'countdown':
        return <Countdown secondsLeft={secondsLeft} />;
      case 'revealQuizzer':
        return <RevealQuizzer quizzer={quizzerUsername} />;
      case 'quizQuestion':
        return (
          <QuizQuestion
            quizzerID={quizzerID}
            quizzerUsername={quizzerUsername}
            secondsLeft={secondsLeft}
            question={question}
            guesses={guesses}
          />
        );
      case 'leaderboard':
        return <Leaderboard />;
      case 'podium':
        return <Podium />;
    }
  };

  return <main className={styles.main}>{renderComponent(status)}</main>;
};

export default AdminPage;
