'use client';
import Header from '@/app/components/Header';
import styles from './page.module.scss';
import Input, { IconInput } from '@/app/components/Input';
import {
  useEffect,
  useState,
  useCallback,
  SetStateAction,
  Dispatch,
} from 'react';
import Button from '@/app/components/Button';
import { FaArrowDown, FaArrowUp, FaTimes } from 'react-icons/fa';
import Note from '@/app/components/Note';
import { GiQueenCrown } from 'react-icons/gi';
import { formatSeconds } from '@/app/util/format';
import Paper from '@/app/components/Paper';
import Guess from '@/app/components/Guess';
import socket from '../../../context/socket';
import { UnstyledLink } from '@/app/components/UnstyledLink';
import { Logo } from '@/app/components/Logo';
import { Game } from '@/app/types/Game';
import { FinalLeaderboard, type Leaderboard } from '@/app/types/Leaderboard';
import { Player } from '@/app/types/Player';

interface LobbyProps {
  roomCode: string;
  players: Player[];
  setCreatingTime: (seconds: number) => any;
  setAnsweringTime: (seconds: number) => any;
  changeStatus: (newStatus: string) => void;
}

const Lobby = ({
  changeStatus,
  setCreatingTime,
  setAnsweringTime,
  roomCode,
  players,
}: LobbyProps) => {
  const [questionMakingTime, setQuestionMakingTime] = useState<{
    minutes: string;
    seconds: string;
  }>({
    minutes: '5',
    seconds: '00',
  });

  const [questionAnsweringTime, setQuestionAnsweringTime] = useState<{
    minutes: string;
    seconds: string;
  }>({
    minutes: '1',
    seconds: '00',
  });

  const cleanNumber = (numberString: string): string => {
    numberString = numberString.replace(/([^\d]+)/g, '');
    return numberString;
  };

  const setNumber = (setState: Function, value: string) => {
    value = cleanNumber(value).substring(0, 2);
    if (value[0] && !value[0].match(/^[012345]$/)) {
      return;
    }
    setState(value);
  };

  const toSeconds = ({
    minutes,
    seconds,
  }: {
    minutes: string;
    seconds: string;
  }): number => {
    let m = Number(minutes);
    let s = Number(seconds);

    if (isNaN(m)) {
      m = 0;
    }
    if (isNaN(s)) {
      s = 0;
    }

    return m * 60 + s;
  };

  useEffect(() => {
    socket.emit('refreshLobby', roomCode, sessionStorage.getItem('sessionID'));
  }, []);

  return (
    <div className={styles.lobby}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Logo size="md" color="black" />
        </div>
        <div className={styles.tag}>
          Go go go!! Join this game at{' '}
          <UnstyledLink href="https://spotlite.com" target="_blank">
            Spotlite.com
          </UnstyledLink>
        </div>
        <div className={styles.roomCode} data-text={roomCode}>
          {roomCode}
        </div>
        <div className={styles.actions}>
          <button className={styles.lockRoom}>Lock Room</button>
          <button
            className={styles.startGame}
            disabled={players.length < 2}
            onClick={e => {
              setCreatingTime(toSeconds(questionMakingTime));
              setAnsweringTime(toSeconds(questionAnsweringTime));
              changeStatus('chooseTopics');
            }}
          >
            Start Game
          </button>
        </div>
        <div className={styles.settings}>
          <div className={styles.setting}>
            <div className={styles.settingName}>Question Making Time</div>
            <div className={styles.time}>
              {questionMakingTime.minutes.length === 1 && (
                <div className={styles.minutePlaceholder}>0</div>
              )}
              <input
                placeholder="00"
                value={questionMakingTime.minutes}
                onChange={e =>
                  setNumber(
                    (minutes: string) =>
                      setQuestionMakingTime(prev => ({ ...prev, minutes })),
                    e.target.value
                  )
                }
              />
              :
              <input
                placeholder="00"
                value={questionMakingTime.seconds}
                onChange={e =>
                  setNumber(
                    (seconds: string) =>
                      setQuestionMakingTime(prev => ({ ...prev, seconds })),
                    e.target.value
                  )
                }
              />
            </div>
          </div>
          <div className={styles.setting}>
            <div className={styles.settingName}>Question Answer Time</div>
            <div className={styles.time}>
              {questionAnsweringTime.minutes.length === 1 && (
                <div className={styles.minutePlaceholder}>0</div>
              )}
              <input
                placeholder="00"
                value={questionAnsweringTime.minutes}
                onChange={e =>
                  setNumber(
                    (minutes: string) =>
                      setQuestionAnsweringTime(prev => ({ ...prev, minutes })),
                    e.target.value
                  )
                }
              />
              :
              <input
                placeholder="00"
                value={questionAnsweringTime.seconds}
                onChange={e =>
                  setNumber(
                    (seconds: string) =>
                      setQuestionAnsweringTime(prev => ({ ...prev, seconds })),
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        {players.length} {players.length === 1 ? 'Player' : 'Players'} Joined
      </div>
    </div>
  );
};

const ChooseTopics = ({
  topics,
  setTopics,
  handleStartGame,
}: {
  topics: string[];
  setTopics: Dispatch<SetStateAction<string[]>>;
  handleStartGame: Function;
}) => {
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

  return (
    <div className={styles.chooseTopics}>
      <div className={styles.logo}>
        <Logo color="black" />
      </div>
      <div>
        <div className={styles.title}>What theme should questions follow?</div>
        <div className={styles.topics}>
          {topics.map((topic, i) => (
            <div key={i} className={styles.topic}>
              <div className={styles.index}>{i + 1}.</div>
              <div className={styles.inputWrapper}>
                <input
                  placeholder="Enter a theme here!!"
                  value={topic}
                  onChange={e => handleEditTopic(i, e.target.value)}
                  maxLength={40}
                />
              </div>
              <div className={styles.delete}>
                <button onClick={e => handleDeleteTopic(i)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.anothaOne}
          onClick={handleAddTopic}
          disabled={topics.length >= 4}
        >
          Anotha one.
        </button>
        <button
          className={styles.startGame}
          disabled={
            topics.length === 0 ||
            topics.filter(topic => topic.length > 0).length === 0
          }
          onClick={() => handleStartGame()}
        >
          Start game!
        </button>
      </div>
    </div>
  );
};

const Countdown = ({
  secondsLeft,
  totalTime,
  addTime,
}: {
  secondsLeft: number;
  totalTime: number;
  addTime: () => void;
}) => {
  const timeLeft = formatSeconds(secondsLeft);

  return (
    <div className={styles.createQuestions}>
      <div className={styles.logo}>
        <Logo size="md" color="white" variant="bordered" />
      </div>
      <div className={styles.title}>Create your quiz questions!</div>
      <div className={styles.time} data-time={timeLeft}>
        {timeLeft}
      </div>
      <div className={styles.progressWrapper}>
        <div
          className={styles.inner}
          style={{ width: `${(secondsLeft / totalTime) * 100}%` }}
        />
      </div>
      <button className={styles.addTime} onClick={addTime}>
        Add 30 seconds
      </button>
    </div>
  );
};

const RevealQuizzer = ({ quizzer }: { quizzer: string }) => {
  return (
    <div className={styles.revealQuizzer}>
      <div className={styles.quizzer} data-text={quizzer}>
        {quizzer}
      </div>
      <div className={styles.subtext}>...is in the spotlite!</div>
    </div>
  );
};

const QuizQuestion = ({
  quizzerID,
  quizzerUsername,
  secondsLeft,
  question,
  hint,
  guesses,
}: {
  quizzerID: string;
  quizzerUsername: string;
  secondsLeft: number;
  question: string;
  hint: string;
  guesses: {
    username: string;
    guess: string;
    correct: boolean;
    points: number;
  }[];
}) => {
  var splitHint = '';
  for (let i = 0; i < hint.length; i++) {
    splitHint += hint[i];
    splitHint += ' ';
    if (hint[i] == ' ') {
      splitHint += '\xa0\xa0';
    }
  }

  const [drawing, setDrawing] = useState<string>('');

  useEffect(() => {
    const handleSyncDrawing = (imageData: string) => setDrawing(imageData);
    socket.on('syncDrawing', handleSyncDrawing);

    return () => {
      socket.off('syncDrawing', handleSyncDrawing);
    };
  }, []);

  const timeLeft = formatSeconds(secondsLeft);

  return (
    <div className={styles.quizQuestionWrapper}>
      <div className={styles.logo}>
        <Logo color="white" variant="bordered" />
      </div>
      <div className={styles.quizzer}>{quizzerUsername} is quizzing!</div>
      <div className={styles.timerWrapper}>
        <div className={styles.timer} data-text={timeLeft}>
          {timeLeft}
        </div>
      </div>
      <div className={styles.questionPrompt}>{question}</div>
      {drawing && <img className={styles.questionDisplay} src={drawing} />}
      <div className={styles.questionHint}>Answer: {hint}</div>
    </div>
  );
};

const AnswerScreen = ({ answer }: { answer: string }) => {
  return (
    <div className={styles.answerReveal}>
      <div className={styles.logo}>
        <Logo color="white" variant="bordered" />
      </div>
      <div className={styles.title}> The answer was:</div>
      <div className={styles.answer}>{answer}</div>
    </div>
  );
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    socket.emit('getLeaderboard', (leaderboard: Leaderboard) => {
      setLeaderboard(leaderboard);
    });
  }, []);

  return (
    <div className={styles.leaderboardWrapper}>
      <div className={styles.logo}>
        <Logo color="white" variant="bordered" />
      </div>
      <div className={styles.title}>Leaderboard</div>
      <div className={styles.list}>
        {leaderboard.map(player => (
          <div key={player.id} className={styles.item}>
            <div className={styles.meta}>{player.username}</div>
            <div className={styles.points}>{player.points} Pts</div>
            <div className={styles.status}>{player.ascended ? '«' : '•'}</div>
          </div>
        ))}
      </div>
      {/* <button className={styles.next}>Next</button> */}
    </div>
  );
};

const Podium = () => {
  const [leaderboard, setLeaderboard] = useState<FinalLeaderboard>([]);

  useEffect(() => {
    socket.emit('getLeaderboard', (leaderboard: FinalLeaderboard) => {
      setLeaderboard(leaderboard);
    });
  }, []);

  const winnerText =
    leaderboard.length > 0
      ? `${leaderboard[0]?.username} is the winner!`
      : 'Winner winner chicken dinner!';

  return (
    <div className={styles.podiumWrapper}>
      <div className={styles.logo}>
        <Logo color="white" variant="bordered" />
      </div>
      <div className={styles.titleWrapper}>
        <div className={styles.title} data-text={winnerText}>
          {winnerText}
        </div>
      </div>
      <div className={styles.topThree}>
        {leaderboard.length >= 3 ? (
          <div className={styles.third}>
            <div className={styles.spotlight} />
            <div className={styles.rank} data-text="3rd">
              3rd
            </div>
            <div className={styles.name} data-text={leaderboard[2]?.username}>
              {leaderboard[2]?.username}
            </div>
          </div>
        ) : (
          <div />
        )}
        <div className={styles.first}>
          <div className={styles.spotlight} />
          <div className={styles.rank} data-text="1st">
            1st
          </div>
          <div className={styles.name} data-text={leaderboard[0]?.username}>
            {leaderboard[0]?.username}
          </div>
        </div>
        <div className={styles.second}>
          <div className={styles.spotlight} />
          <div className={styles.rank} data-text="2nd">
            2nd
          </div>
          <div className={styles.name} data-text={leaderboard[1]?.username}>
            {leaderboard[1]?.username}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPage = ({ params }: { params: { roomCode: string } }) => {
  const [status, setStatus] = useState('lobby');
  const [players, setPlayers] = useState<Player[]>([]);
  const [quizzerID, setQuizzerID] = useState('');
  const [quizzerUsername, setQuizzerUsername] = useState('');
  const [questionCreatingTime, setQuestionCreatingTime] = useState<number>(0);
  const [questionAnsweringTime, setQuestionAnsweringTime] = useState<number>(0);
  const [topics, setTopics] = useState<string[]>(['']);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [question, setQuestion] = useState('');
  const [hint, setHint] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [answer, setAnswer] = useState('');

  const changeStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  useEffect(() => {
    const handleGameStateChange = (game: Game) => {
      setSecondsLeft(game.countdown);
      setHint(game.hint);
      switch (game.state) {
        case 'choosing quizzer':
          setQuizzerID(game.quizzer.id);
          setQuizzerUsername(game.quizzer.username);
          changeStatus('revealQuizzer');
          break;
        case 'answerQuestion':
          changeStatus('quizQuestion');
          break;
        case 'showingAnswer':
          changeStatus('showingAnswer');
          break;
        case 'leaderboardPosition':
          changeStatus('leaderboard');
          break;
        case 'end':
          changeStatus('podium');
      }
    };

    const handleUpdateSpotlitQuestion = (question: string) => {
      setQuestion(question);
    };

    const handleLobbyUpdate = (players: Player[]) => {
      setPlayers(players);
    };

    const handleRevealAnswer = (answer: string) => {
      console.log(answer);
      setAnswer(answer);
    };

    socket.on('updateSpotlitQuestion', handleUpdateSpotlitQuestion);
    socket.on('lobbyUpdate', handleLobbyUpdate);
    socket.on('gameStateChange', handleGameStateChange);
    socket.on('revealAnswer', handleRevealAnswer);

    return () => {
      socket.off('lobbyUpdate', handleLobbyUpdate);
      socket.off('gameStateChange', handleGameStateChange);
      socket.off('updateSpotlitQuestion', handleUpdateSpotlitQuestion);
      socket.off('revealAnswer', handleRevealAnswer);
    };
  }, [status]);

  const handleStartGame = () => {
    socket.emit(
      'createGame',
      topics,
      questionCreatingTime,
      questionAnsweringTime
    );
    changeStatus('countdown');
  };

  const handleAddTime = () => {
    setQuestionCreatingTime(questionCreatingTime + 30);
    socket.emit('addTime', 30);
  };

  const renderComponent = (component: string) => {
    switch (component) {
      case 'lobby':
        return (
          <Lobby
            changeStatus={changeStatus}
            roomCode={params.roomCode}
            players={players}
            setCreatingTime={setQuestionCreatingTime}
            setAnsweringTime={setQuestionAnsweringTime}
          />
        );
      case 'chooseTopics':
        return (
          <ChooseTopics
            topics={topics}
            setTopics={setTopics}
            handleStartGame={handleStartGame}
          />
        );
      case 'countdown':
        return (
          <Countdown
            secondsLeft={secondsLeft}
            totalTime={questionCreatingTime}
            addTime={handleAddTime}
          />
        );
      case 'revealQuizzer':
        return <RevealQuizzer quizzer={quizzerUsername} />;
      case 'quizQuestion':
        return (
          <QuizQuestion
            quizzerID={quizzerID}
            quizzerUsername={quizzerUsername}
            secondsLeft={secondsLeft}
            question={question}
            hint={hint}
            guesses={guesses}
          />
        );
      case 'showingAnswer':
        return <AnswerScreen answer={answer} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'podium':
        return <Podium />;
    }
  };

  return <main className={styles.main}>{renderComponent(status)}</main>;
};

export default AdminPage;
