import Link from 'next/link';
import Button from '../components/Button';
import styles from './page.module.scss';

const CreateRoom = () => {
  return (
    <main className={styles.main}>
      <div className={styles.title}>TOSS-IT!</div>
      <div className={styles.forTeachers}>FOR TEACHERS</div>
      <Button>Host Room</Button>
      <Link href="/">
        <Button className={styles.toStudentMode} fill='secondary'>To Student Mode</Button>
      </Link>
      <div className={styles.box} />
    </main>
  );
};

export default CreateRoom;
