import Header from '../components/Header';
import Input from '../components/Input';
import Note from '../components/Note';
import styles from './page.module.scss';

const NameSelect = () => {
  return (
    <div className={styles.nameSelect}>
      <Header>ENTER YOUR NAME:</Header>
      <Input placeholder="Name" />
    </div>
  );
};

const IdleScreen = () => {
  return (
    <div className={styles.idleScreen}>
      <div className={styles.youreIn}>YOU&#8217;RE IN!</div>
      <Note>Waiting for start...</Note>
    </div>
  );
};

const Room = ({ params }: { params: { roomCode: string } }) => {
  return (
    <main className={styles.main}>
      <IdleScreen />
      {/* <NameSelect /> */}
    </main>
  );
};

export default Room;
