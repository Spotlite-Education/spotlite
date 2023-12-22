import Button from '../../components/Button';
import Paper from '../../components/Paper';
import styles from './QuestionCreation.module.scss';

const CreateQuestion = () => {
  return (
    <main className={styles.main}>
      <div className={styles.gridContainer}>
        <Paper></Paper>
        <div className={styles.gridRight}>
          <Paper></Paper>
          <Button className={styles.button}>Submit Question</Button>
        </div>
      </div>
    </main>
  );
};

export default CreateQuestion;
