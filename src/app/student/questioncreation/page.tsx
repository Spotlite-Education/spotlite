import Link from 'next/link';
import Button from '../../components/Button';
import Paper from '../../components/Paper';
import styles from './page.module.scss';

const StudentCreateQuestion = () => {
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

export default StudentCreateQuestion;
