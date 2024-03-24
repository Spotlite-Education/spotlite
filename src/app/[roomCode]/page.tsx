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
  changeStatus: (newStatus: string, socketEvent: string) => void;
  secondsLeft: number;
}) => {
  const [topic, setTopic] = useState<string>('');

  useEffect(() => {
    socket.emit('getStudentInfo', info => {
      setTopic(info.theme);
      console.log(info);
    });
  }, []);

  const onClick = () => {
    changeStatus('questionSubmitted', 'null');
  };

  return (
    <div className={styles.questionCreationWrapper}>
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
            />
          </div>
        </Paper>
        <Button className={styles.submitButton} onClick={onClick}>
          Submit Question
        </Button>
      </div>
    </div>
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

const ShowQuizzer = ({ quizzer }: { quizzer: string }) => {
  const isQuizzer = sessionStorage.getItem('sessionToken') == quizzer;
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
          <div className={styles.isTheQuizzer}>{quizzer} is the quizzer...</div>
        </div>
      )}
      ;
    </>
  );
};

const AnswerQuestion = ({
  quizzer,
  secondsLeft,
}: {
  quizzer: string;
  secondsLeft: number;
}) => {
  return (
    <div className={styles.centeredWrapper}>
      <div className={styles.timer}>{formatSeconds(secondsLeft)}</div>
      <div className={styles.lessBigText}>
        Answer {quizzer}&#8217;s Question:
      </div>
      <div className={styles.answerInputWrapper}>
        <Input className={styles.answerInput} placeholder="Answer here..." />
        <button className={styles.submitAnswer}>
          <FaChevronRight size="2.5rem" color="var(--input-text-color)" />
        </button>
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
      <div className={styles.lessLessBigText}>
        {correct ? 'Correct!' : 'Incorrect...'}
      </div>
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
  return (
    <div
      className={styles.questionSpotlightWrapper}
      style={{ backgroundColor: 'var(--accent-color)' }}
    >
      <div className={styles.timer}>{formatSeconds(secondsLeft)}</div>
      <div className={styles.questionDetails}>
        <Paper className={styles.questionDraftWrapper}>
          Your Question Draft:
        </Paper>
        <Paper className={styles.questionAnswerWrapper}>
          Your Question Answer:
        </Paper>
        {/* <div className={styles.lastResponseWrapper}>
          <div className={styles.name}>No responses yet</div>
        </div> */}
      </div>
      <Paper drawable className={styles.whiteboardWrapper}>
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
      </Paper>
    </div>
  );
};

const Room = ({ params }: { params: { roomCode: string } }) => {
  const [status, setStatus] = useState('idleScreen');
  const router = useRouter();
  const [quizzer, setQuizzer] = useState('');
  const [isQuizzer, setIsQuizzer] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0.2 * 60);

  useEffect(() => {
    socket.on('gameStateChange', game => {
      setSecondsLeft(game.countdown);
      switch (game.state) {
        case 'questionCreation':
          if (status == 'idleScreen') {
            changeStatus('questionCreation', 'null');
          }
          break;
        case 'choosing quizzer':
          setQuizzer(game.quizzer);
          changeStatus('showQuizzer', 'null');
          break;
        case 'answerQuestion':
          if (sessionStorage.getItem('sessionToken') == game.quizzer) {
            changeStatus('questionSpotlight', 'null');
          } else {
            changeStatus('answerQuestion', 'null');
          }
          break;
        case 'leaderboardPosition':
          changeStatus('leaderboardPosition', 'null');
          break;
      }
    });

    return () => {
      socket.off('gameStateChange', players => {});
    };
  }, [socket]);

  const changeStatus = (newStatus: string, socketEvent: string) => {
    setStatus(newStatus);
    if (socketEvent !== 'null') {
      socket.emit(socketEvent);
    }
  };

  const changeQuizzer = (newQuizzer: string) => {
    setQuizzer(newQuizzer);
  };

  const renderComponent = (component: string) => {
    switch (component) {
      case 'idleScreen':
        return <IdleScreen />;
      case 'questionSubmitted':
        return <QuestionSubmitted />;
      case 'answerQuestion':
        return <AnswerQuestion quizzer={quizzer} secondsLeft={secondsLeft} />;
      case 'showQuizzer':
        return <ShowQuizzer quizzer={quizzer} />;
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
