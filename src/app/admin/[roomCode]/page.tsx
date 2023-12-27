'use client';
import Header from '@/app/components/Header';
import styles from './page.module.scss';
import Input, { IconInput } from '@/app/components/Input';
import { useEffect, useState } from 'react';
import Button from '@/app/components/Button';
import { FaArrowDown, FaArrowUp, FaTimes } from 'react-icons/fa';
import Note from '@/app/components/Note';
import { GiQueenCrown } from 'react-icons/gi';
import { formatSeconds } from '@/app/util/format';

const ChooseTopics = () => {
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
      <Button className={styles.hostRoom} fill="secondary">
        Host Room
      </Button>
    </div>
  );
};

interface LobbyProps {
  roomCode: string;
}

const Lobby = ({ roomCode }: LobbyProps) => {
  const [players, setPlayers] = useState([
    'Andrew',
    'Yuchen',
    'Sherry',
    'Soap',
    'Andrew',
    'Yuchen',
    'Sherry',
    'Soap',
    'Andrew',
    'Yuchen',
    'Sherry',
    'Soap',
    'Andrew',
    'Yuchen',
    'Sherry',
    'Soap',
    'Andrew',
    'Yuchen',
    'Sherry',
    'Soap',
    'Andrew',
    'Yuchen',
    'Sherry',
    'Soap',
    'Andrew',
    'Yuchen',
    'Sherry',
    'Soap',
    'Andrew',
    'Yuchen',
    'Sherry',
    'Soap',
    'Andrew',
    'Yuchen',
    'Sherry',
    'Soap',
  ]);

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
          {players.map((name, i) => (
            <Button key={name} className={styles.item}>
              {name}
            </Button>
          ))}
        </div>
      </div>
      <Button className={styles.startGame}>Start Game</Button>
    </div>
  );
};

const Countdown = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(2.5 * 60);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (secondsLeft > 0) {
        setSecondsLeft(prev => prev - 1);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  return (
    <div className={styles.centeredWrapper}>
      <div className={styles.header}>Create your quiz questions!</div>
      <div className={styles.timeLeft}>{formatSeconds(secondsLeft)}</div>
    </div>
  );
};

const RevealQuizzer = () => {
  return (
    <div className={styles.centeredWrapper}>
      <div className={styles.quizzer}>Andrew</div>
      <div className={styles.isTheQuizzer}>is the quizzer...</div>
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
      <Button className={styles.nextButton}>Next</Button>
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
  return (
    <main className={styles.main}>
      {/* <ChooseTopics /> */}
      {/* <Lobby roomCode={params.roomCode} /> */}
      {/* <Countdown /> */}
      {/* <RevealQuizzer /> */}
      <Leaderboard />
      {/* <Podium /> */}
    </main>
  );
};

export default AdminPage;
