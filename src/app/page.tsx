import Link from 'next/link';
import Button from './components/Button';
import Input from './components/Input';
import styles from './page.module.scss';

const Home = () => {
  return (
    <main className={styles.main}>
      <div className={styles.title}>TOSS-IT!</div>
      <Input className={styles.roomCodeInput} placeholder="Room Code" />
      <Link href="/teacher/home">
        <Button className={styles.toTeacherMode}>
          To Teacher Mode
        </Button>
      </Link>
      <div className={styles.box} />
    </main>
  );
};

export default Home;
