'use client';
import {
  FormEvent,
  KeyboardEvent,
  MutableRefObject,
  forwardRef,
  memo,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import LongInput from '../components/Input';
import Note from '../components/Note';
import styles from './page.module.scss';
import { formatRank, formatSeconds } from '../util/format';
import { FaChevronRight } from 'react-icons/fa';
import Paper from '../components/Paper';
import { useRouter } from 'next/navigation';
import socket from '../../context/socket';
import { Logo } from '../components/Logo';
import { MdClose, MdDelete, MdFunctions, MdTextFields } from 'react-icons/md';
import { RiAddFill, RiEraserFill, RiSubtractFill } from 'react-icons/ri';
import { Inset, Popover } from '@radix-ui/themes';
import { RgbColorPicker } from 'react-colorful';
import { IoIosRedo, IoIosUndo } from 'react-icons/io';
import { isRedo, isUndo } from '../util/keys';
import { addStyles, EditableMathField } from 'react-mathquill';
import { Question } from '../types/Question';
import { GamePlayerState } from '../types/GamePlayerState';
import { Game } from '../types/Game';
import { Guess } from '../types/Guess';

const IdleScreen = () => {
  return (
    <div className={styles.idleScreen}>
      <div className={styles.youreIn}>YOU&apos;RE IN!</div>
      <div className={styles.note}>Waiting for start...</div>
    </div>
  );
};

export type CanvasAction = {
  type: 'drawLine' | 'clear';
  data: any;
};

type Line = {
  color: string;
  width: number;
  points: [number, number][];
};

const Canvas = ({
  width,
  height,
  onHoverStart,
  onHoverEnd,
  onDraw,
  onDrawEnd,
}: {
  width: number;
  height: number;
  onHoverStart?: Function;
  onHoverEnd?: Function;
  onDraw?: (imageData: string) => any;
  onDrawEnd?: (imageData: string) => any;
}) => {
  const SCALE_FACTOR = 1;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [color, setColor] = useState<{ r: number; g: number; b: number }>({
    r: 0,
    g: 0,
    b: 0,
  });
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [erasing, setErasing] = useState<boolean>(false);

  const [actions, setActions] = useState<CanvasAction[]>([]);
  const [undos, setUndos] = useState<CanvasAction[]>([]);

  const determineStrokeStyle = () => {
    if (erasing) return '#f4ede8';
    return `rgb(${color.r} ${color.g} ${color.b})`;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (actions[actions.length - 1].type !== 'clear') {
      setActions(prev => [...prev, { type: 'clear', data: null }]);
    }

    if (onDraw) {
      onDraw(canvas.toDataURL());
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;

      reconstructCanvas(aggregateLines(actions));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    let line: Line = { color: '', width: 0, points: [] };

    const startDrawing = (e: { offsetX: number; offsetY: number }) => {
      isDrawing = true;
      lastX = e.offsetX / SCALE_FACTOR;
      lastY = e.offsetY / SCALE_FACTOR;

      line.points.push([lastX, lastY]);
    };

    const draw = (e: { offsetX: number; offsetY: number }) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = determineStrokeStyle();
      ctx.lineWidth = lineWidth + 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      line.color = ctx.strokeStyle;
      line.width = lineWidth + 3;

      const xTo = e.offsetX / SCALE_FACTOR;
      const yTo = e.offsetY / SCALE_FACTOR;

      line.points.push([xTo, yTo]);

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(xTo, yTo);
      ctx.stroke();

      lastX = xTo;
      lastY = yTo;

      if (onDraw) {
        onDraw(canvas.toDataURL());
      }
    };

    const stopDrawing = () => {
      if (!canvasRef.current) return;

      if (onDrawEnd) {
        onDrawEnd(canvasRef.current.toDataURL());
      }

      isDrawing = false;
      if (line.points.length >= 2) {
        const lineCopy = line;
        setActions(prev => [
          ...prev,
          {
            type: 'drawLine',
            data: lineCopy,
          },
        ]);
        setUndos([]);
      }
      line = { color: '', width: 0, points: [] };
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [
    color,
    lineWidth,
    erasing,
    setActions,
    setUndos,
    actions,
    onDraw,
    onDrawEnd,
  ]);

  const aggregateLines = (actions: CanvasAction[]) => {
    let lines: Line[] = [];
    for (const action of actions) {
      switch (action.type) {
        case 'drawLine':
          lines.push(action.data as Line);
          break;
        case 'clear':
          lines = [];
      }
    }

    return lines;
  };

  const reconstructCanvas = (lines: Line[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const line of lines) {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      for (let i = 1; i < line.points.length; i++) {
        const [x1, y1] = line.points[i - 1];
        ctx.moveTo(x1, y1);

        const [x2, y2] = line.points[i];
        ctx.lineTo(x2, y2);

        ctx.stroke();
      }
    }
  };

  const undo = () => {
    if (actions.length === 0) return;

    const actionsCopy = actions.slice();
    const lastAction = actionsCopy.pop()!;
    setUndos(prev => [...prev, lastAction]);

    const lines = aggregateLines(actionsCopy);
    reconstructCanvas(lines);

    setActions(actionsCopy);
  };

  const redo = () => {
    if (undos.length === 0) return;

    const undosCopy = undos.slice();
    const lastUndo = undosCopy.pop()!;

    const actionsWithRedo = actions.slice();
    actionsWithRedo.push(lastUndo);

    const lines = aggregateLines(actionsWithRedo);
    reconstructCanvas(lines);

    setActions(actionsWithRedo);
    setUndos(undosCopy);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isUndo(e)) {
      undo();
    } else if (isRedo(e)) {
      redo();
    }
  };

  return (
    <div
      className={styles.whiteboardWrapper}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => onHoverStart && onHoverStart()}
      onMouseLeave={() => onHoverEnd && onHoverEnd()}
    >
      <div className={styles.drawSettings}>
        <div className={styles.strokeWidth}>
          <span className={styles.label}>Stroke — {lineWidth}</span>
          <button
            disabled={lineWidth === 10}
            onClick={() => setLineWidth(prev => Math.min(10, prev + 1))}
          >
            <RiAddFill />
          </button>
          <button disabled={lineWidth === 1}>
            <RiSubtractFill
              onClick={() => setLineWidth(prev => Math.max(1, prev - 1))}
            />
          </button>
        </div>
        <Popover.Root>
          <Popover.Trigger>
            <button>
              <div className={styles.colorWheelIcon} />
            </button>
          </Popover.Trigger>
          <Popover.Content style={{ width: 'min-content' }}>
            <Inset>
              <div className={styles.colorPickerWrapper}>
                <RgbColorPicker color={color} onChange={setColor} />
              </div>
            </Inset>
          </Popover.Content>
        </Popover.Root>
        <button
          style={{
            outline: erasing ? '1.5px solid var(--dark-text)' : undefined,
          }}
          onClick={() => setErasing(prev => !prev)}
        >
          <RiEraserFill />
        </button>
        <button disabled={actions.length === 0} onClick={undo}>
          <IoIosUndo />
        </button>
        <button disabled={undos.length === 0} onClick={redo}>
          <IoIosRedo />
        </button>
        <button onClick={clearCanvas}>
          <MdDelete />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className={styles.whiteboard}
        width="100%"
        height="100%"
      />
    </div>
  );
};

const CanvasDisplay = ({
  imageURL,
  width,
  height,
}: {
  imageURL: string;
  width: number;
  height: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    var img = new Image();

    img.onload = function () {
      ctx.drawImage(img, 0, 0, width, height); // Or at whatever offset you like
    };
    img.src = imageURL;
  });

  return <canvas ref={canvasRef} width={width} height={height} />;
};

//addStyles();

const TextEditor = ({ setValue }: { setValue: Function }) => {
  const [text, setText] = useState<string>('');
  const [mode, setMode] = useState<'text' | 'math'>('text');

  return (
    <div className={styles.textEditorWrapper}>
      {/* <div className={styles.settings}>
        <button
          className={styles.setting}
          style={{ opacity: mode === 'text' ? 1 : 0.5 }}
          onClick={() => setMode('text')}
        >
          <MdTextFields />
        </button>
        <button
          className={styles.setting}
          style={{ opacity: mode === 'math' ? 1 : 0.5 }}
          onClick={() => setMode('math')}
        >
          <MdFunctions />
        </button>
      </div> */}
      {/* <EditableMathField
        className={styles.equationEditor}
        latex={text}
        onChange={mathField => setText(mathField.latex())}
      /> */}
      <textarea
        placeholder="Type your question here!"
        maxLength={100}
        value={text}
        onChange={e => {
          setText(e.target.value);
          setValue(e.target.value);
        }}
      />
    </div>
  );
};

const Editor = ({
  width,
  height,
  only,
  onTextEditorChange,
  onDraw,
  onDrawEnd,
  onCanvasHoverStart,
  onCanvasHoverEnd,
}: {
  width: number;
  height: number;
  only?: 'text' | 'draw';
  onTextEditorChange?: Function;
  onDraw?: (imageData: string) => any;
  onDrawEnd?: (imageData: string) => any;
  onCanvasHoverStart?: Function;
  onCanvasHoverEnd?: Function;
}) => {
  const [mode, setMode] = useState<'text' | 'draw'>(only || 'draw');

  return (
    <div className={styles.editor} tabIndex={0} style={{ width, height }}>
      <div className={styles.modeSelect}>
        {!only && (
          <>
            <div
              className={styles.mode}
              style={{ opacity: mode === 'text' ? 1 : 0.5 }}
              onClick={() => setMode('text')}
            >
              Text
            </div>
            <div
              className={styles.mode}
              style={{ opacity: mode === 'draw' ? 1 : 0.5 }}
              onClick={() => setMode('draw')}
            >
              Draw
            </div>
          </>
        )}
      </div>
      {mode === 'text' ? (
        <TextEditor
          setValue={onTextEditorChange ? onTextEditorChange : () => {}}
        />
      ) : (
        <Canvas
          width={width}
          height={height}
          onHoverStart={onCanvasHoverStart ? onCanvasHoverStart : () => {}}
          onHoverEnd={onCanvasHoverEnd ? onCanvasHoverEnd : () => {}}
          onDraw={onDraw ? onDraw : undefined}
          onDrawEnd={onDrawEnd ? onDrawEnd : undefined}
        />
      )}
    </div>
  );
};

const QuestionCreation = ({
  changeStatus,
  secondsLeft,
}: {
  changeStatus: (newStatus: string) => void;
  secondsLeft: number;
}) => {
  const [topic, setTopic] = useState<string>('');

  const promptInputRef = useRef<HTMLInputElement>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);
  const [canvasHovered, setCanvasHovered] = useState<boolean>(false);

  useEffect(() => {
    socket.emit(
      'getStudentInfo',
      sessionStorage.getItem('sessionToken'),
      (info: GamePlayerState) => {
        setTopic(info.theme);
      }
    );
  }, []);

  const [imageURL, setImageURL] = useState('');
  const [prompt, setPrompt] = useState('');

  const [answer, setAnswer] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    socket.emit('submitQuestion', prompt, imageURL, answer);
    changeStatus('questionSubmitted');
  };

  const timeLeft = formatSeconds(secondsLeft);

  return (
    <div className={styles.questionCreation}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Logo color="white" variant="bordered" />
        </div>
        <div className={styles.topicWrapper}>
          <div className={styles.topic}>Question Theme: {topic}</div>
        </div>
        <div className={styles.time} data-time={timeLeft}>
          {timeLeft}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.content}>
          <div className={styles.promptInput}>
            <input
              ref={promptInputRef}
              disabled={
                document.activeElement !== promptInputRef.current &&
                canvasHovered
              }
              placeholder="Type a prompt here..."
              onChange={e => setPrompt(e.target.value)}
            />
          </div>
          <Editor
            width={window.innerWidth || 0}
            height={window.innerHeight - 5 * 10 - 28 * 10 || 0}
            only="draw"
            onDrawEnd={setImageURL}
            onCanvasHoverStart={() => setCanvasHovered(true)}
            onCanvasHoverEnd={() => setCanvasHovered(false)}
          />
          <div className={styles.answerWrapper}>
            <div className={styles.input}>
              Answer:
              <input
                ref={answerInputRef}
                disabled={
                  document.activeElement !== answerInputRef.current &&
                  canvasHovered
                }
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type here..."
              />
            </div>
            <button
              className={styles.submit}
              disabled={(!prompt && !imageURL) || !answer}
              type="submit"
            >
              Submit It!
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const QuestionSubmitted = ({
  secondsLeft,
  changeStatus,
}: {
  secondsLeft: number;
  changeStatus: (newStatus: string) => void;
}) => {
  const timeLeft = formatSeconds(secondsLeft);
  const timeText = `Game starts in ${timeLeft}`;

  return (
    <div className={styles.questionSubmitted}>
      <div className={styles.logo}>
        <Logo color="white" variant="bordered" />
      </div>
      <div className={styles.subtitle}>Good Job! Your question has been</div>
      <div className={styles.title}>Submitted!</div>
      <div className={styles.time} data-text={timeText}>
        {timeText}
      </div>
      <button
        className={styles.editQuestion}
        onClick={() => changeStatus('questionCreation')}
      >
        Edit Question
      </button>
    </div>
  );
};

const ShowQuizzer = ({
  quizzerID,
  quizzerUsername,
}: {
  quizzerID: string;
  quizzerUsername: string;
}) => {
  const isQuizzer = sessionStorage.getItem('sessionToken') == quizzerID;
  return (
    <div className={styles.showQuizzer}>
      {isQuizzer ? (
        <div className={styles.youAre}>You&apos;re in the spotlite!</div>
      ) : (
        <>
          <div
            className={styles.quizzerName}
            data-text={quizzerUsername || 'Andrew'}
          >
            {quizzerUsername || 'Andrew'}
          </div>
          <div className={styles.subtext}>...Is in the spotlite!</div>
        </>
      )}
    </div>
  );
};

const AnswerQuestion = ({
  quizzerUsername,
  secondsLeft,
  points,
  changeStatus,
}: {
  quizzerUsername: string;
  secondsLeft: number;
  points: number;
  changeStatus: (newStatus: string) => void;
}) => {
  const [answer, setAnswer] = useState<string>('');
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const onAnswer = (e: FormEvent) => {
    e.preventDefault();

    if (!answer) return;

    // do something with the answer
    socket.emit('guessAnswer', answer, (correct: boolean) => {
      if (correct) {
        changeStatus('answerResult');
      }
    });

    setAnswer('');
  };

  useEffect(() => {
    const handleChatUpdate = (guesses: Guess[]) => {
      setGuesses(guesses);
    };

    socket.on('newGuess', handleChatUpdate);

    return () => {
      socket.off('newGuess', handleChatUpdate);
    };
  }, []);

  const timeLeft = formatSeconds(secondsLeft);

  return (
    <div className={styles.questionAnswerWrapper}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Logo color="white" variant="bordered" />
        </div>
        <div className={styles.timer} data-text={timeLeft}>
          {timeLeft}
        </div>
        <div className={styles.chatWrapper}>
          <div className={styles.title}>Chat</div>
          <div className={styles.messages}>
            {guesses.map((guess: Guess, i) => (
              <div key={i} className={styles.guess}>
                <div className={styles.guesser}>{guess.player.username}:</div>
                <div className={styles.guess}>{guess.guess}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.answerSpace}>
          <div>Answer {quizzerUsername}&apos;s question!</div>
          <form onSubmit={onAnswer}>
            <div className={styles.inputWrapper}>
              <input
                placeholder="Type here..."
                value={answer}
                onChange={e => setAnswer(e.target.value)}
              />
            </div>
            <button>Submit!</button>
          </form>
        </div>
      </div>
      <div className={styles.footer}>{points || 0} PTS</div>
    </div>
  );
};

const AnswerResult = ({ points }: { points: number }) => {
  return (
    <div className={styles.answerResult}>
      <div className={styles.logo}>
        <Logo color="white" variant="bordered" />
      </div>
      <div className={styles.title} data-text={'+' + points}>
        +{points}
      </div>
      <div className={styles.correct}>Correct!</div>
    </div>
  );
};

const LeaderboardPosition = ({
  rank,
  points,
}: {
  rank: number;
  points: number;
}) => {
  const rankText = formatRank(rank) + ' Place';

  return (
    <div className={styles.leaderboard}>
      <div className={styles.spotlight} />
      <div className={styles.content}>
        <div className={styles.logo}>
          <Logo color="white" variant="bordered" />
        </div>
        <div className={styles.subtitle}>You are...</div>
        <div className={styles.rank} data-text={rankText + '!'}>
          {rankText}!
        </div>
        <div className={styles.points} data-text={(points || 0) + ' Pts'}>
          {points || 0} Pts
        </div>
      </div>
    </div>
  );
};

const QuestionSpotlight = ({ secondsLeft }: { secondsLeft: number }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [questionImageURL, setQuestionImageURL] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    socket.emit(
      'getStudentInfo',
      sessionStorage.getItem('sessionToken'),
      (info: GamePlayerState) => {
        setPrompt(info.question.text);
        setAnswer(info.question.answer);
        setQuestionImageURL(info.question.imageURL);

        syncPrompt(info.question.text);
      }
    );
  }, []);

  const syncPrompt = useCallback((prompt: string) => {
    socket.emit('updateSpotlitQuestion', prompt);
  }, []);

  const syncDrawing = useCallback((imageData: string) => {
    socket.emit('quizzerDraw', imageData);
  }, []);

  const timeLeft = formatSeconds(secondsLeft);

  return (
    <div className={styles.questionSpotlightWrapper}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Logo color="white" variant="bordered" />
        </div>
        <div className={styles.prompt}>Write your question out!</div>
        <div className={styles.timer} data-text={timeLeft}>
          {timeLeft}
        </div>
      </div>
      <div className={styles.content}>
        <div>
          <div className={styles.promptInput}>
            <input
              placeholder="Type a prompt..."
              value={prompt}
              onChange={e => {
                setPrompt(e.target.value);
                syncPrompt(e.target.value);
              }}
            />
          </div>
          <Editor
            width={window.innerWidth * 0.7 || 0}
            height={window.innerHeight - 10 * 10 - 7.5 * 10}
            only="draw"
            onDraw={syncDrawing}
          />
        </div>
        <div className={styles.guide}>
          <div className={styles.questionDraft}>
            <div className={styles.subtitle}>Your question</div>
            <div className={styles.preview}>
              {questionImageURL && <img src={questionImageURL} />}
            </div>
          </div>
          <div className={styles.answer}>
            <div className={styles.subtitle}>Your Answer</div>
            <div>{answer}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StudentInfo {
  username: string;
  theme: string;
  points: number;
  rank: number;
  ascended: boolean;
  questions: object;
}

const Room = ({ params }: { params: { roomCode: string } }) => {
  const [status, setStatus] = useState('idleScreen');
  const router = useRouter();
  const [quizzerID, setQuizzerID] = useState('');
  const [quizzerUsername, setQuizzerUsername] = useState('');
  const [isQuizzer, setIsQuizzer] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0.2 * 60);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(
    {} as StudentInfo
  );

  const changeStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  useEffect(() => {
    const handleGameStateChange = (game: Game) => {
      setSecondsLeft(game.countdown);
      switch (game.state) {
        case 'questionCreation':
          if (status == 'idleScreen') {
            changeStatus('questionCreation');
          }
          break;
        case 'choosing quizzer':
          setQuizzerID(game.quizzer.id);
          setQuizzerUsername(game.quizzer.username);
          changeStatus('showQuizzer');
          break;
        case 'answerQuestion':
          if (sessionStorage.getItem('sessionToken') == game.quizzer.id) {
            changeStatus('questionSpotlight');
          } else if (status != 'answerResult') {
            changeStatus('answerQuestion');
          }
          break;
        case 'leaderboardPosition':
          changeStatus('leaderboardPosition');
          break;
      }
    };

    const handleUpdateStudentInfo = (info: StudentInfo) => {
      setStudentInfo(info);
    };

    socket.on('gameStateChange', handleGameStateChange);
    socket.on('updateStudentInfo', handleUpdateStudentInfo);

    return () => {
      socket.off('gameStateChange', handleGameStateChange);
      socket.off('updateStudentInfo', handleUpdateStudentInfo);
    };
  }, [status]);

  const renderComponent = (component: string) => {
    switch (component) {
      case 'idleScreen':
        return <IdleScreen />;
      case 'questionSubmitted':
        return (
          <QuestionSubmitted
            secondsLeft={secondsLeft}
            changeStatus={changeStatus}
          />
        );
      case 'answerQuestion':
        return (
          <AnswerQuestion
            quizzerUsername={quizzerUsername}
            secondsLeft={secondsLeft}
            changeStatus={changeStatus}
            points={studentInfo.points}
          />
        );
      case 'showQuizzer':
        return (
          <ShowQuizzer
            quizzerID={quizzerID}
            quizzerUsername={quizzerUsername}
          />
        );
      case 'answerResult':
        return <AnswerResult points={studentInfo.points} />;
      case 'leaderboardPosition':
        return (
          <LeaderboardPosition
            rank={studentInfo.rank}
            points={studentInfo.points}
          />
        );
      case 'questionCreation':
        return (
          <QuestionCreation
            changeStatus={changeStatus}
            secondsLeft={secondsLeft}
          />
        );
      case 'questionSpotlight':
        return <QuestionSpotlight secondsLeft={secondsLeft} />;
      default:
        return null;
    }
  };

  return <main className={styles.main}>{renderComponent(status)}</main>;
};

export default Room;
