'use client';

import Link from 'next/link';
import Button from '../components/Button';
import styles from './page.module.scss';
import { socketAtom } from '../../context/socket';
import { useAtom } from 'jotai';

const HostRoom = () => {
  const [socket, setSocket] = useAtom(socketAtom);

  const handleCreateRoom = e => {
    e.preventDefault();
    console.log('host room clicked');
    socket.emit('createGame', response => {
      console.log(response.ok);
      console.log(response.room);
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>TOSS-IT!</div>
      <div className={styles.forTeachers}>FOR TEACHERS</div>
      <Button onClick={e => handleCreateRoom(e)}>Host Room</Button>
      <Link href="/">
        <Button className={styles.toStudentMode} fill="secondary">
          To Student Mode
        </Button>
      </Link>
      <div className={styles.box} />
    </main>
  );
};

export default HostRoom;
