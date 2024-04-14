'use client';
import {
  KeyboardEvent,
  MutableRefObject,
  forwardRef,
  use,
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
import { formatSeconds } from '../util/format';
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
  setHovered,
  setQuestion,
}: {
  setHovered: Function;
  setQuestion: Function;
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
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 10 * 10 - 28 * 10;

      reconstructCanvas(aggregateLines(actions));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [actions]);

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
    };

    const stopDrawing = () => {
      setQuestion(actions);
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
  }, [color, lineWidth, erasing, setActions, setUndos, actions, setQuestion]);

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

//addStyles();

const TextEditor = ({ setQuestion }: { setQuestion: Function }) => {
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
          setQuestion(e.target.value);
        }}
      />
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

  const [canvas, setCanvas] = useState();
  const [text, setText] = useState('');

  const [answer, setAnswer] = useState<string>('');

  const handleSubmit = () => {
    console.log(canvas);
    console.log(text);
    //socket.emit('submitQuestion', question, answer);
    //changeStatus('questionSubmitted');
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
          <div className={styles.canvas} tabIndex={0}>
            <div>
              <TextEditor setQuestion={setText} />
              <Canvas setHovered={setCanvasHovered} setQuestion={setCanvas} />
            </div>
          </div>
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
              disabled={(!text && !canvas) || !answer}
              type="submit"
              onClick={e => {
                e.preventDefault();
              }}
            >
              Submit It!
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// <form className={styles.questionCreationWrapper} onSubmit={onSubmit}>
//   <div className={styles.timer}>{formatSeconds(secondsLeft)}</div>
//   <div className={styles.drawablePaper}>
//     <Paper>
//       Create a quiz question related to&nbsp;
//       <span
//         style={{
//           color: 'var(--accent-color)',
//           fontSize: 'inherit',
//           fontWeight: 'inherit',
//         }}
//       >
//         {topic}.
//       </span>
//       <div>
//         <LongInput
//           className={styles.input}
//           placeholder="Write your quiz question here..."
//           name="question"
//         />
//       </div>
//     </Paper>
//   </div>
//   <div className={styles.gridRight}>
//     <Paper>
//       Answer:
//       <div>
//         <LongInput
//           className={styles.input}
//           placeholder="Write your answer here..."
//           name="answer"
//         />
//       </div>
//     </Paper>
//     <Button className={styles.submitButton} type="submit">
//       Submit Question
//     </Button>
//   </div>
// </form>

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
    <>
      {isQuizzer ? (
        <div
          style={{ backgroundColor: 'var(--accent-color)' }}
          className={styles.centeredWrapper}
        >
          <div className={styles.isTheQuizzer}>You are the quizzer!</div>
        </div>
      ) : (
        <div className={styles.centeredWrapper}>
          <div className={styles.isTheQuizzer}>
            {quizzerUsername} is the quizzer...
          </div>
        </div>
      )}
      ;
    </>
  );
};

const AnswerQuestion = ({
  quizzerUsername,
  secondsLeft,
  changeStatus,
}: {
  quizzerUsername: string;
  secondsLeft: number;
  changeStatus: (newStatus: string) => void;
}) => {
  const onAnswer = e => {
    e.preventDefault();
    // do something with the answer
    socket.emit('guessAnswer', e.target[0].value, result => {
      if (result) {
        changeStatus('answerResult');
      }
    });
  };

  return (
    <div className={styles.centeredWrapper}>
      <div className={styles.timer}>{formatSeconds(secondsLeft)}</div>
      <div className={styles.lessBigText}>
        Answer {quizzerUsername}&#8217;s Question:
      </div>
      <div className={styles.answerInputWrapper}>
        <form onSubmit={onAnswer}>
          <Input className={styles.answerInput} placeholder="Answer here..." />
          <button className={styles.submitAnswer}>
            <FaChevronRight size="2.5rem" color="var(--input-text-color)" />
          </button>
        </form>
      </div>
    </div>
  );
};

const AnswerResult = ({ points }) => {
  return (
    <div
      className={styles.centeredWrapper}
      style={{ backgroundColor: 'var(--accent-color)' }}
    >
      <div className={styles.lessLessBigText}>Correct!</div>
      <div className={styles.pointsChange}>+{points}</div>
    </div>
  );
};

const LeaderboardPosition = ({ rank }) => {
  return (
    <div
      className={styles.centeredWrapper}
      style={{ backgroundColor: 'var(--accent-color)' }}
    >
      <div className={styles.lessLessBigText}>Your Position:</div>
      <div className={styles.pointsChange}>#{rank}</div>
    </div>
  );
};

const QuestionSpotlight = ({ secondsLeft }: { secondsLeft: number }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const onWrite = e => {
    socket.emit('updateSpotlitQuestion', e.target.value);
  };

  useEffect(() => {
    socket.emit(
      'getStudentInfo',
      sessionStorage.getItem('sessionToken'),
      info => {
        setAnswer(info.answer);
        setQuestion(info.question);
      }
    );
  }, []);

  return (
    <div
      className={styles.questionSpotlightWrapper}
      style={{ backgroundColor: 'var(--accent-color)' }}
    >
      <div className={styles.timer}>{formatSeconds(secondsLeft)}</div>
      <div className={styles.questionDetails}>
        <Paper className={styles.questionDraftWrapper}>
          Your Question Draft:
          <div>{question}</div>
        </Paper>
        <Paper className={styles.questionAnswerWrapper}>
          Your Question Answer:
          <div>{answer}</div>
        </Paper>
        {/* <div className={styles.lastResponseWrapper}>
          <div className={styles.name}>No responses yet</div>
        </div> */}
      </div>
      {/* <Paper drawable className={styles.whiteboardWrapper}> */}
      <Paper className={styles.whiteboardWrapper}>
        <span
          style={{
            color: 'var(--accent-color)',
            fontSize: 'inherit',
            fontWeight: 'inherit',
          }}
        >
          Write out your quiz question
        </span>{' '}
        for everyone!
        <form
          onChange={onWrite}
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <LongInput
            className={styles.input}
            placeholder="Write your quiz question here..."
            name="question"
          />
        </form>
      </Paper>
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
      console.log('updating info');
      console.log(info);
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
        return <LeaderboardPosition rank={studentInfo.rank} />;
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
