'use client';
import { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import LongInput from '../components/Input';
import Note from '../components/Note';
import styles from './page.module.scss';
import { formatSeconds } from '../util/format';
import { FaChevronRight } from 'react-icons/fa';
import Paper from '../components/Paper';

const IdleScreen = () => {
  return (
    <div className={styles.idleScreen}>
      <div className={styles.youreIn}>YOU&#8217;RE IN!</div>
      <Note>Waiting for start...</Note>
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

const AnswerQuestion = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(47);

  return (
    <div className={styles.centeredWrapper}>
      <div className={styles.timer}>{formatSeconds(secondsLeft)}</div>
      <div className={styles.lessBigText}>Answer Andrew&#8217;s Question:</div>
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
      <div className={styles.pointsChange}>#1</div>
    </div>
  );
};

const QuestionCreation = () => {
  const [topic, setTopic] = useState<string>('topic');

  return (
    <div className={styles.questionCreationWrapper}>
      <div className={styles.timer}>{formatSeconds(47)}</div>
      <div className={styles.drawablePaper}>
        <Paper>
          Create a quiz question related to{' '}
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
        <Button className={styles.submitButton}>Submit Question</Button>
      </div>
    </div>
  );
};

const QuestionSpotlight = () => {
  return (
    <div className={styles.questionSpotlightWrapper}>
      <div className={styles.timer}>{formatSeconds(47)}</div>
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

  const renderComponent = (component: string) => {
    switch (component) {
      case 'idleScreen':
        return <IdleScreen />;
      case 'questionSubmitted':
        return <QuestionSubmitted />;
      case 'answerQuestion':
        return <AnswerQuestion />;
      case 'answerResult':
        return <AnswerResult />;
      case 'leaderboardPosition':
        return <LeaderboardPosition />;
      case 'questionCreation':
        return <QuestionCreation />;
      case 'questionSpotlight':
        return <QuestionSpotlight />;
      default:
        return null;
    }
  };

  return <main className={styles.main}>{renderComponent(status)}</main>;
};

export default Room;
