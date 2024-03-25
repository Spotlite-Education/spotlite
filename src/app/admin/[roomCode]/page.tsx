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
  changeStatus: (newStatus: string, socketEvent: string) => void;
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
          changeStatus('chooseTopics', 'null');
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
  changeStatus: (newStatus: string, socketEvent: string) => void;
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
          socket.emit('createGame', topics, 20, 20);
          changeStatus('countdown', 'null');
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
  quizzer,
  secondsLeft,
}: {
  quizzer: string;
  secondsLeft: number;
}) => {
  const [question, setQuestion] = useState('');

  useEffect(() => {
    socket.emit('getStudentInfo', quizzer, info => {
      setQuestion(info.question);
    });
  }, []);

  return (
    <div className={styles.quizQuestionWrapper}>
      <div className={styles.timer}>{formatSeconds(secondsLeft)}</div>

      <Paper className={styles.quizQuestion}>
        {quizzer} is the quizzer...
        <div>{question}</div>
      </Paper>
      <div className={styles.gridRight}>
        <Paper>Hint:</Paper>
        <div className={styles.guesses}>
          <Guess
            name={'SOAP'}
            guess={'hello'}
            correct={true}
            points={100}
          ></Guess>
          <Guess
            name={'Yuchen'}
            guess={'poo'}
            correct={false}
            points={0}
          ></Guess>
        </div>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<
    {
      player: string;
      points: number;
      status: 'idle' | 'ascended' | 'descended';
    }[]
  >([
    { player: 'Soap', points: 2458, status: 'ascended' },
    { player: 'Andrew', points: 2104, status: 'ascended' },
    { player: 'Yuchen', points: 2092, status: 'descended' },
    { player: 'Sherry', points: 1095, status: 'ascended' },
    { player: 'Momo', points: 506, status: 'descended' },
  ]);

  return (
    <div className={styles.leaderboardWrapper}>
      {leaderboard.map((position, i) => (
        <div
          key={position.player}
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
          <div className={styles.name}>{position.player}</div>
          <div className={styles.score}>
            {position.points}
            <div className={styles.icon}>
              {position.status === 'ascended' ? (
                <FaArrowUp size="3rem" />
              ) : position.status === 'descended' ? (
                <FaArrowDown size="3rem" />
              ) : null}
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
  return (
    <div className={styles.podiumWrapper}>
      <Button className={styles.seeQuestionBank}>See Question Bank</Button>
      <div className={styles.backgroundPillars}>
        <div className={styles.pillarWrapper} style={{ height: '50%' }}>
          <div className={styles.player}>Yuchen</div>
          <div className={styles.pillar} />
        </div>
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
            Soap
          </div>
          <div className={styles.pillar} />
        </div>
        <div className={styles.pillarWrapper} style={{ height: '60%' }}>
          <div className={styles.player}>Andrew</div>
          <div className={styles.pillar} />
        </div>
      </div>
      <div className={styles.foregroundPillars}>
        <div className={styles.pillarWrapper} style={{ height: '25%' }}>
          <div className={styles.player}>Momo</div>
          <div className={styles.pillar} />
        </div>
        <div className={styles.pillarWrapper} style={{ height: '35%' }}>
          <div className={styles.player}>Sherry</div>
          <div className={styles.pillar} />
        </div>
      </div>
    </div>
  );
};

const AdminPage = ({ params }: { params: { roomCode: string } }) => {
  const [status, setStatus] = useState('lobby');
  const [players, setPlayers] = useState([]);
  const [quizzer, setQuizzer] = useState('');
  const [secondsLeft, setSecondsLeft] = useState<number>(0.2 * 60);

  const changeStatus = (newStatus: string, socketEvent: string) => {
    setStatus(newStatus);
    if (socketEvent !== 'null') {
      socket.emit(socketEvent);
    }
  };

  useEffect(() => {
    socket.on('lobbyUpdate', players => {
      setPlayers(players);
    });
    socket.on('gameStateChange', game => {
      setSecondsLeft(game.countdown);
      console.log(game);
      switch (game.state) {
        case 'choosing quizzer':
          setQuizzer(game.quizzer);
          changeStatus('revealQuizzer', 'null');
          break;
        case 'answerQuestion':
          changeStatus('quizQuestion', 'null');
          break;
        case 'leaderboardPosition':
          changeStatus('leaderboard', 'null');
          break;
        case 'end':
          changeStatus('podium', 'null');
      }
    });

    return () => {
      socket.off('lobbyUpdate', players => {});
      socket.off('gameStateChange', game => {});
    };
  }, [socket]);

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
        return <RevealQuizzer quizzer={quizzer} />;
      case 'quizQuestion':
        return <QuizQuestion quizzer={quizzer} secondsLeft={secondsLeft} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'podium':
        return <Podium />;
    }
  };

  return <main className={styles.main}>{renderComponent(status)}</main>;
};

export default AdminPage;
