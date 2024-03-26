'use client';
import { useEffect, useState } from 'react';
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

const IdleScreen = () => {
  return (
    <div className={styles.idleScreen}>
      <div className={styles.youreIn}>YOU&#8217;RE IN!</div>
      <Note>Waiting for start...</Note>
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

  useEffect(() => {
    socket.emit(
      'getStudentInfo',
      sessionStorage.getItem('sessionToken'),
      info => {
        setTopic(info.theme);
      }
    );
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    socket.emit('submitQuestion', formJson.question, formJson.answer);
    changeStatus('questionSubmitted');
  };

  return (
    <form className={styles.questionCreationWrapper} onSubmit={onSubmit}>
      <div className={styles.timer}>{formatSeconds(secondsLeft)}</div>
      <div className={styles.drawablePaper}>
        <Paper>
          Create a quiz question related to&nbsp;
          <span
            style={{
              color: 'var(--accent-color)',
              fontSize: 'inherit',
              fontWeight: 'inherit',
            }}
          >
            {topic}.
          </span>
          <div>
            <LongInput
              className={styles.input}
              placeholder="Write your quiz question here..."
              name="question"
            />
          </div>
        </Paper>
      </div>
      <div className={styles.gridRight}>
        <Paper>
          Answer:
          <div>
            <LongInput
              className={styles.input}
              placeholder="Write your answer here..."
              name="answer"
            />
          </div>
        </Paper>
        <Button className={styles.submitButton} type="submit">
          Submit Question
        </Button>
      </div>
    </form>
  );
};

const QuestionSubmitted = () => {
  return (
    <div
      className={styles.centeredWrapper}
      style={{ backgroundColor: 'var(--accent-color)' }}
    >
      <div className={styles.bigText}>Submitted!</div>
      <div className={styles.subText}>Waiting for game start...</div>
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

const AnswerResult = () => {
  const [correct, setCorrect] = useState<boolean>(true);

  return (
    <div
      className={styles.centeredWrapper}
      style={{ backgroundColor: 'var(--accent-color)' }}
    >
      <div className={styles.lessLessBigText}>Correct!</div>
      <div className={styles.pointsChange}>+657</div>
    </div>
  );
};

const LeaderboardPosition = () => {
  return (
    <div
      className={styles.centeredWrapper}
      style={{ backgroundColor: 'var(--accent-color)' }}
    >
      <div className={styles.lessLessBigText}>Your Position:</div>
      <div className={styles.pointsChange}>#N/A</div>
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

const Room = ({ params }: { params: { roomCode: string } }) => {
  const [status, setStatus] = useState('idleScreen');
  const router = useRouter();
  const [quizzerID, setQuizzerID] = useState('');
  const [quizzerUsername, setQuizzerUsername] = useState('');
  const [isQuizzer, setIsQuizzer] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0.2 * 60);

  const changeStatus = (newStatus: string) => {
    setStatus(newStatus);
  };

  useEffect(() => {
    const handleGameStateChange = game => {
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

    socket.on('gameStateChange', handleGameStateChange);

    return () => {
      socket.off('gameStateChange', handleGameStateChange);
    };
  }, [status]);

  const renderComponent = (component: string) => {
    switch (component) {
      case 'idleScreen':
        return <IdleScreen />;
      case 'questionSubmitted':
        return <QuestionSubmitted />;
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
        return <AnswerResult />;
      case 'leaderboardPosition':
        return <LeaderboardPosition />;
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
