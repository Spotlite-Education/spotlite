'use client';

import Link from 'next/link';
import Button from './components/Button';
import Input from './components/Input';
import styles from './page.module.scss';
import React from 'react';
import { useState } from 'react';
import Header from '@/app/components/Header';
import { useRouter } from 'next/navigation';

import { SOCKET_URL } from '../context/socket';
import socket from '../context/socket';

const NameSelect = ({
  handleJoin,
  handleChangeUsername,
}: {
  handleJoin: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChangeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={styles.nameSelect}>
      <Header>ENTER YOUR NAME:</Header>
      <form onSubmit={e => handleJoin(e)}>
        <Input placeholder="Name" onChange={e => handleChangeUsername(e)} />
      </form>
    </div>
  );
};

const Home = () => {
  const [roomCode, setRoomCode] = useState('');

  const [chooseUser, setChooseUser] = useState(false);
  const [username, setUsername] = React.useState('');

  const router = useRouter();

  const handleJoin = e => {
    e.preventDefault();
    socket.emit(
      'join',
      username,
      roomCode,
      sessionStorage.getItem('sessionToken')
    );
    router.push('/' + roomCode);
  };

  const handleChangeUsername = e => {
    setUsername(e.target.value);
  };

  const handleSubmitRoomCode = e => {
    e.preventDefault();
    fetch(SOCKET_URL + '/authenticate?roomCode=' + roomCode, {
      method: 'GET',
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.sessionToken != null) {
          console.log(data.sessionToken);
          sessionStorage.setItem('sessionToken', data.sessionToken);
          setChooseUser(true);
        }
      });
  };

  return (
    <main className={styles.main}>
      {chooseUser ? (
        <NameSelect
          handleJoin={handleJoin}
          handleChangeUsername={handleChangeUsername}
        />
      ) : (
        <>
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
        </>
      )}
    </main>
  );
};

export default Home;
