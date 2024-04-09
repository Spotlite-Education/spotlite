'use client';

import Header from '@/app/components/Header';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import socket, { SOCKET_URL } from '../context/socket';
import Input from './components/Input';
import { Logo } from './components/Logo';
import { UnstyledLink } from './components/UnstyledLink';
import styles from './page.module.scss';

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

const Spotlight = () => {
  const [pos, setPos] = useState<{ x: string; y: string }>();

  useEffect(() => {
    const changePosition = setInterval(() => {
      setPos({
        x: `${Math.random() * 85 + 5}%`,
        y: `${Math.random() * 85 + 5}%`,
      });
    }, (Math.random() * 3 + 1) * 1000);

    return () => {
      clearInterval(changePosition);
    };
  }, []);

  return (
    <div
      className={styles.spotlight}
      style={{ opacity: pos ? 0.65 : 0, top: pos?.y, left: pos?.x }}
    />
  );
};

const Home = () => {
  const [roomCode, setRoomCode] = useState('');

  const [chooseUser, setChooseUser] = useState(false);
  const [username, setUsername] = React.useState('');

  const router = useRouter();

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    socket.emit(
      'join',
      username,
      roomCode,
      sessionStorage.getItem('sessionToken')
    );
    router.push('/' + roomCode);
  };

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmitRoomCode = (e: FormEvent) => {
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
    <main className={styles.wrapper}>
      {chooseUser ? (
        <NameSelect
          handleJoin={handleJoin}
          handleChangeUsername={handleChangeUsername}
        />
      ) : (
        <div className={styles.home}>
          <div className={styles.content}>
            <Spotlight />
            <div className={styles.corner} />
            <UnstyledLink href="/host">
              <div className={styles.teacherMode}>Teacher Mode!</div>
            </UnstyledLink>

            <Logo size="xl" />
            <form
              className={styles.roomCodeInputWrapper}
              onSubmit={e => handleSubmitRoomCode(e)}
            >
              <input
                className={styles.roomCodeInput}
                maxLength={6}
                autoCorrect="off"
              />
            </form>
            <button className={styles.play}>Play!</button>
          </div>
          <div className={styles.footer}>
            <div className={styles.legal}>
              <UnstyledLink href="/">Terms & Conditions</UnstyledLink>
              <UnstyledLink href="/">Privacy Policy</UnstyledLink>
            </div>
            <div className={styles.center}>
              <UnstyledLink href="/">
                See what other creative minds have made at spotlite.org
              </UnstyledLink>
            </div>
            <div className={styles.copyright}>Copyright © 2024 Spotlite</div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
