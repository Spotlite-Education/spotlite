'use client';

import Link from 'next/link';
import Button from './components/Button';
import Input from './components/Input';
import styles from './page.module.scss';
import React from 'react';
import { useState } from 'react';
import { socketAtom } from '../context/socket';
import { useAtom } from 'jotai';

import Header from '@/app/components/Header';

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
  const [socket, setSocket] = useAtom(socketAtom);

  const [chooseUser, setChooseUser] = useState(false);
  const [username, setUsername] = React.useState('');

  const handleJoin = e => {
    e.preventDefault();
    socket.emit('joinGame', roomCode, username, response => {
      if (response.ok) {
        console.log('joined game');
      }
    });
  };

  const handleChangeUsername = e => {
    setUsername(e.target.value);
  };

  const handleSubmitRoomCode = e => {
    e.preventDefault();
    console.log('hello');
    socket.emit('checkRoomExists', roomCode, response => {
      console.log('hi');
      if (response.ok) {
        console.log('room exists');
        setChooseUser(true);
      } else {
        console.log('room does not exist');
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
