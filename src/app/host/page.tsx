'use client';

import Link from 'next/link';
import Button from '../components/Button';
import styles from './page.module.scss';
import { socketAtom } from '../../context/socket';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';

const NameSelect = () => {
  return (
    <div className={styles.nameSelect}>
      <Header>ENTER YOUR NAME:</Header>
      <Input placeholder="Name" />
    </div>
  );
};

const HostRoom = () => {
  const [socket, setSocket] = useAtom(socketAtom);
  const router = useRouter();

  const handleCreateRoom = e => {
    e.preventDefault();
    console.log('host room clicked');
    socket.emit('createGame', response => {
      router.push('/admin/' + response.room.roomCode);
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
