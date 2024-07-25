'use client';
import { socket } from '../../layout';
import styles from './NotEnoughQuestions.module.scss';

const NotEnoughQuestions = () => {
  const handleCreateQuestions = () => {
    socket.emit('resumeCreateQuestions');
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>Oh No!</span>
      <p className={styles.prompt}>
        Looks like there aren&apos;t enough submitted questions to start the
        game.
        <br />
        Click the button below to go back to creating questions (don&apos;t
        worry, submitted questions were saved!)
      </p>
      <button className={styles.start} onClick={handleCreateQuestions}>
        Create Questions
      </button>
    </div>
  );
};

export default NotEnoughQuestions;
