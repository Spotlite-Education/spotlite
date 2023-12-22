import Button from './components/Button';
import Input from './components/Input';
import styles from './page.module.scss';

const Home = () => {
  return (
    <main className={styles.main}>
      <div className={styles.title}>TOSS-IT!</div>
      <Input className={styles.roomCodeInput} placeholder="Room Code" />
      <Button className={styles.toTeacherMode} fill="secondary">
        To Teacher Mode
      </Button>
      <div className={styles.box} />
    </main>
  );
};

export default Home;
