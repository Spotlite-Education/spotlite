'use client';

import Link from 'next/link';
import Button from '../components/Button';
import styles from './page.module.scss';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SOCKET_URL } from '../../context/socket';

const HostRoom = () => {
  const router = useRouter();

  const handleCreateRoom = e => {
    e.preventDefault();
    fetch(SOCKET_URL + '/createRoom', { method: 'POST' })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        router.push('/admin/' + data.room.code);
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
