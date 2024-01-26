'use client';

import Link from 'next/link';
import Button from './components/Button';
import Input from './components/Input';
import styles from './page.module.scss';
import React from 'react';
import { useState } from 'react';
import { socketAtom } from '../context/socket';
import { useAtom } from 'jotai';

const Home = () => {
  const [roomCode, setRoomCode] = useState('');
  const [socket, setSocket] = useAtom(socketAtom);

  const handleSubmitRoomCode = e => {
    e.preventDefault();
    socket.emit('joinRoom', roomCode);
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>TOSS-IT!</div>
      <form onSubmit={e => handleSubmitRoomCode(e)}>
        <Input
          onChange={e => setRoomCode(e.target.value)}
          className={styles.roomCodeInput}
          placeholder="Room Code"
        />
      </form>
      <Link href="/host">
        <Button className={styles.toTeacherMode}>To Teacher Mode</Button>
      </Link>
      <div className={styles.box} />
    </main>
  );
};

export default Home;
