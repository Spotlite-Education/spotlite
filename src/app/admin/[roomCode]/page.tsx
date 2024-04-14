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

interface LobbyProps {
  roomCode: string;
  players: string[];
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
    minutes: '0',
    seconds: '20',
  });

  const [questionAnsweringTime, setQuestionAnsweringTime] = useState<{
    minutes: string;
    seconds: string;
  }>({
    minutes: '0',
    seconds: '20',
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
            <div className={styles.topic}>
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
        <button className={styles.startGame} onClick={() => handleStartGame()}>
          Start game!
        </button>
      </div>
    </div>
  );
};

const Countdown = ({
  secondsLeft,
  totalTime,
}: {
  secondsLeft: number;
  totalTime: number;
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

  return (
    <div className={styles.quizQuestionWrapper}>
      <div className={styles.timer}>{formatSeconds(secondsLeft)}</div>

      <Paper className={styles.quizQuestion}>
        {quizzerUsername} is the quizzer...
        <div>{question}</div>
      </Paper>
      <div className={styles.gridRight}>
        <Paper>
          Hint:
          {splitHint}
        </Paper>
        <div className={styles.guesses}>
          {guesses
            .slice(0, 3)
            .reverse()
            .map((guess, i) => (
              <Guess
                key={i}
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

const AnswerScreen = ({ answer }: { answer: string }) => {
  return (
    <div className={styles.centeredWrapper}>
      <div className={styles.title}> The answer was: </div>
      <div className={styles.answer}> {answer} </div>
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
          key={key}
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
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    socket.emit('getLeaderboard', leaderboard => {
      setLeaderboard(leaderboard);
    });
  }, []);

  return (
    <div className={styles.podiumWrapper}>
      <Button className={styles.seeQuestionBank}>See Question Bank</Button>
      <div className={styles.backgroundPillars}>
        {leaderboard.length > 2 ? (
          <div className={styles.pillarWrapper} style={{ height: '50%' }}>
            <div className={styles.player}>{leaderboard[2].username}</div>
            <div className={styles.pillar} />
          </div>
        ) : (
          <div></div>
        )}
        {leaderboard.length > 0 ? (
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
              {leaderboard[0].username}
            </div>
            <div className={styles.pillar} />
          </div>
        ) : (
          <div></div>
        )}

        {Object.entries(leaderboard).length > 1 ? (
          <div className={styles.pillarWrapper} style={{ height: '60%' }}>
            <div className={styles.player}>{leaderboard[1].username}</div>
            <div className={styles.pillar} />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className={styles.foregroundPillars}>
        {leaderboard.length > 4 ? (
          <div className={styles.pillarWrapper} style={{ height: '25%' }}>
            <div className={styles.player}>
              {Object.entries(leaderboard)[4].username}
            </div>
            <div className={styles.pillar} />
          </div>
        ) : (
          <div></div>
        )}
        {leaderboard.length > 3 ? (
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
      setQuestionCreatingTime(game.questionCreatingTime);
      setQuestionAnsweringTime(game.questionAnsweringTime);
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

    const handleRevealAnswer = answer => {
      console.log(answer);
      setAnswer(answer);
    };

    socket.on('updateSpotlitQuestion', handleUpdateSpotlitQuestion);
    socket.on('lobbyUpdate', handleLobbyUpdate);
    socket.on('gameStateChange', handleGameStateChange);
    socket.on('newGuess', handleNewGuess);
    socket.on('revealAnswer', handleRevealAnswer);

    return () => {
      socket.off('lobbyUpdate', handleLobbyUpdate);
      socket.off('gameStateChange', handleGameStateChange);
      socket.off('updateSpotlitQuestion', handleUpdateSpotlitQuestion);
      socket.off('newGuess', handleNewGuess);
      socket.off('revealAnswer', handleRevealAnswer);
    };
  }, [status]);

  const handleStartGame = () => {
    console.log({ questionCreatingTime, questionAnsweringTime });
    socket.emit(
      'createGame',
      topics,
      questionCreatingTime,
      questionAnsweringTime
    );
    changeStatus('countdown');
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
