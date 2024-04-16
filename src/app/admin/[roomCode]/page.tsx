'use client';
import styles from './page.module.scss';
import {
  useEffect,
  useState,
  useCallback,
  SetStateAction,
  Dispatch,
  MouseEvent,
} from 'react';
import { FaArrowDown, FaArrowUp, FaTimes } from 'react-icons/fa';
import { GiQueenCrown } from 'react-icons/gi';
import { formatSeconds } from '@/app/util/format';
import socket from '../../../context/socket';
import { UnstyledLink } from '@/app/components/UnstyledLink';
import { Logo } from '@/app/components/Logo';
import { Game } from '@/app/types/Game';
import { FinalLeaderboard, type Leaderboard } from '@/app/types/Leaderboard';
import { Player } from '@/app/types/Player';
import { useRouter } from 'next/navigation';

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
  const [questionMakingTime, setQuestionMakingTime] = useState<number>(3 * 60);

  const [questionAnsweringTime, setQuestionAnsweringTime] = useState<number>(
    1 * 60 + 30
  );

  // 10 minutes
  const QUESTION_MAKING_TIME_MAX = 10 * 60;
  // 15 seconds
  const QUESTION_MAKING_TIME_MIN = 15;

  // 10 minutes
  const QUESTION_ANSWERING_TIME_MAX = 10 * 60;
  // 15 seconds
  const QUESTION_ANSWERING_TIME_MIN = 15;

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
              setCreatingTime(questionMakingTime);
              setAnsweringTime(questionAnsweringTime);
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
              <div className={styles.timeRepresentation}>
                {formatSeconds(questionMakingTime)}
              </div>
              <div className={styles.tickers}>
                <button
                  disabled={questionMakingTime > QUESTION_MAKING_TIME_MAX - 60}
                  onClick={() =>
                    setQuestionMakingTime(prev =>
                      Math.min(prev + 60, QUESTION_MAKING_TIME_MAX)
                    )
                  }
                >
                  +1 min
                </button>
                <button
                  disabled={questionMakingTime > QUESTION_MAKING_TIME_MAX - 15}
                  onClick={() =>
                    setQuestionMakingTime(prev =>
                      Math.min(prev + 15, QUESTION_MAKING_TIME_MAX)
                    )
                  }
                >
                  +15 sec
                </button>
              </div>
              <div className={styles.tickers}>
                <button
                  disabled={questionMakingTime < QUESTION_MAKING_TIME_MIN + 60}
                  onClick={() =>
                    setQuestionMakingTime(prev =>
                      Math.max(QUESTION_MAKING_TIME_MIN, prev - 60)
                    )
                  }
                >
                  -1 min
                </button>
                <button
                  disabled={questionMakingTime < QUESTION_MAKING_TIME_MIN + 15}
                  onClick={() =>
                    setQuestionMakingTime(prev =>
                      Math.max(QUESTION_MAKING_TIME_MIN, prev - 15)
                    )
                  }
                >
                  -15 sec
                </button>
              </div>
            </div>
          </div>
          <div className={styles.setting}>
            <div className={styles.settingName}>Answering Time</div>
            <div className={styles.time}>
              <div className={styles.timeRepresentation}>
                {formatSeconds(questionAnsweringTime)}
              </div>
              <div className={styles.tickers}>
                <button
                  disabled={
                    questionAnsweringTime > QUESTION_ANSWERING_TIME_MAX - 60
                  }
                  onClick={() =>
                    setQuestionAnsweringTime(prev =>
                      Math.min(prev + 60, QUESTION_ANSWERING_TIME_MAX)
                    )
                  }
                >
                  +1 min
                </button>
                <button
                  disabled={
                    questionAnsweringTime > QUESTION_ANSWERING_TIME_MAX - 15
                  }
                  onClick={() =>
                    setQuestionAnsweringTime(prev =>
                      Math.min(prev + 15, QUESTION_ANSWERING_TIME_MAX)
                    )
                  }
                >
                  +15 sec
                </button>
              </div>
              <div className={styles.tickers}>
                <button
                  disabled={
                    questionAnsweringTime < QUESTION_ANSWERING_TIME_MIN + 60
                  }
                  onClick={() =>
                    setQuestionAnsweringTime(prev =>
                      Math.max(QUESTION_ANSWERING_TIME_MIN, prev - 60)
                    )
                  }
                >
                  -1 min
                </button>
                <button
                  disabled={
                    questionAnsweringTime < QUESTION_ANSWERING_TIME_MIN + 15
                  }
                  onClick={() =>
                    setQuestionAnsweringTime(prev =>
                      Math.max(QUESTION_ANSWERING_TIME_MIN, prev - 15)
                    )
                  }
                >
                  -15 sec
                </button>
              </div>
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
  changeStatus,
  topics,
  setTopics,
  handleStartGame,
}: {
  changeStatus: (newStatus: string) => any;
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
        <button
          className={styles.backToLobby}
          onClick={() => changeStatus('lobby')}
        >
          Back to lobby
        </button>
      </div>
    </div>
  );
};

const Countdown = ({
  secondsLeft,
  totalTime,
  addTime,
  forceSkip,
}: {
  secondsLeft: number;
  totalTime: number;
  addTime: () => void;
  forceSkip: () => void;
}) => {
  const [submissions, setSubmissions] = useState<{
    submitted: number;
    numPlayers?: number;
  }>({
    submitted: 0,
    numPlayers: undefined,
  });
  const timeLeft = formatSeconds(secondsLeft);

  useEffect(() => {
    const handleUpdateSubmissions = (submissions: {
      submitted: number;
      numPlayers?: number;
    }) => {
      console.log(submissions);
      setSubmissions(submissions);
    };

    socket.on('questionSubmitted', handleUpdateSubmissions);

    return () => {
      socket.off('questionSubmitted', handleUpdateSubmissions);
    };
  }, []);

  const submissionsText = submissions.numPlayers
    ? `${submissions.submitted}/${submissions.numPlayers} Questions Submitted`
    : `${submissions.submitted} Questions Submitted`;

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
      <div className={styles.submissions} data-text={submissionsText}>
        {submissionsText}
      </div>
      <div className={styles.actionRow}>
        <button className={styles.addTime} onClick={addTime}>
          Add 30 seconds
        </button>
        <button className={styles.addTime} onClick={forceSkip}>
          Force Submit
        </button>
      </div>
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
  correct,
  playerCount,
  hint,
  guesses,
  forceSkip,
}: {
  quizzerID: string;
  quizzerUsername: string;
  secondsLeft: number;
  question: string;
  correct: number;
  playerCount: number;
  hint: string;
  guesses: {
    username: string;
    guess: string;
    correct: boolean;
    points: number;
  }[];
  forceSkip: () => void;
}) => {
  var splitHint = '';
  for (let i = 0; i < hint.length; i++) {
    splitHint += hint[i];
    splitHint += '\xa0';
    if (hint[i] == ' ') {
      splitHint += '\xa0\xa0\xa0';
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
      <div className={styles.hintWrapper}>
        <div className={styles.questionHint}>Hint: {hint}</div>
        <div className={styles.correctAnswers}>
          {correct}/{playerCount - 1} correct
        </div>
      </div>
      <button className={styles.forceSkip} onClick={forceSkip}>
        Force skip
      </button>
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

  const router = useRouter();

  const handleEndGame = (e: MouseEvent) => {
    e.preventDefault();
    router.push('/host');
    socket.emit('endGame');
  };

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
      <button className={styles.endGame} onClick={handleEndGame}>
        End game!
      </button>
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
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answer, setAnswer] = useState('');

  const changeStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  useEffect(() => {
    const handleGameStateChange = (game?: Game) => {
      if (!game) {
        return;
      }

      setSecondsLeft(game.countdown);
      setHint(game.hint);
      switch (game.state) {
        case 'questionCreation':
          changeStatus('countdown');
          break;
        case 'choosing quizzer':
          setCorrectAnswers(0);
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

    const handleUpdateCorrectAnswers = (count: number) => {
      setCorrectAnswers(count);
    };

    socket.on('updateSpotlitQuestion', handleUpdateSpotlitQuestion);
    socket.on('lobbyUpdate', handleLobbyUpdate);
    socket.on('gameStateChange', handleGameStateChange);
    socket.on('revealAnswer', handleRevealAnswer);
    socket.on('updateCorrectAnswers', handleUpdateCorrectAnswers);

    socket.emit('gameStateRefresh', handleGameStateChange);

    return () => {
      socket.off('lobbyUpdate', handleLobbyUpdate);
      socket.off('gameStateChange', handleGameStateChange);
      socket.off('updateSpotlitQuestion', handleUpdateSpotlitQuestion);
      socket.off('revealAnswer', handleRevealAnswer);
      socket.off('updateCorrectAnswers', handleUpdateCorrectAnswers);
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

  const handleForceSkip = () => {
    socket.emit('forceSkip');
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
            changeStatus={changeStatus}
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
            forceSkip={handleForceSkip}
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
            correct={correctAnswers}
            playerCount={players.length}
            hint={hint}
            guesses={guesses}
            forceSkip={handleForceSkip}
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
