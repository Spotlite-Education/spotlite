import { GameState } from '@/types/GameState';
import { formatSeconds } from '@/app/util/format';
import styles from './CreateQuestions.module.scss';
import { useState } from 'react';
import { socket } from '../../layout';

const CreateQuestions = ({ gameState }: { gameState: GameState }) => {
  const [editing, setEditing] = useState<boolean>(false);

  const savedQuestion = gameState.playerInfo!.question;

  const [question, setQuestion] = useState<string>(savedQuestion.text);
  const [answer, setAnswer] = useState<string>(savedQuestion.answer);

  const validQuestion = () => {
    const normalized = question.trim();
    return normalized.length >= 10 && normalized.length <= 100;
  };

  const validAnswer = () => {
    const normalized = answer.trim();
    return normalized.length > 0 && normalized.length <= 20;
  };

  const handleSubmitQuestion = () => {
    socket.emit('submitQuestion', question, answer);
    setEditing(false);
  };

  if (savedQuestion.submitted && !editing) {
    return (
      <div className={styles.submitted}>
        <span className={styles.title}>Question Submitted!</span>
        <p className={styles.prompt}>
          Good Job! If you want to edit your question, click the button below.
          Just remember to click submit again, or your changes won&apos;t be
          saved!
        </p>
        <button className={styles.edit} onClick={() => setEditing(true)}>
          Edit question
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.topic}>
          Create a question about: {savedQuestion.topic}
        </div>
        <div className={styles.timeLeft}>
          {formatSeconds(gameState.countdown.secondsLeft)}
        </div>
      </div>
      <div className={styles.canvas}>
        <textarea
          className={styles.question}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Enter your question here (10 characters min)"
          minLength={10}
          autoFocus
        />
        <div className={styles.answer}>
          <input
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Enter your answer here (20 characters max)"
            maxLength={20}
          />
          <button
            className={styles.submit}
            onClick={handleSubmitQuestion}
            disabled={!validQuestion() || !validAnswer()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestions;
