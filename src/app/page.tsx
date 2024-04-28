'use client';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import socket, { SOCKET_URL } from '../context/socket';
import { Logo } from './components/Logo';
import { UnstyledLink } from './components/UnstyledLink';
import styles from './page.module.scss';
import { FaChevronRight } from 'react-icons/fa';

const NameSelect = ({
  roomCode,
  handleJoin,
  handleChangeUsername,
}: {
  roomCode: string;
  handleJoin: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChangeUsername: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const icons = [
    'catscaled.png',
    'dogscaled.png',
    'frogscaled.png',
    'bunnyscaled.png',
    'horsescaled.png',
  ];
  const [currentIconIndex, setCurrentIconIndex] = useState(1);
  const [currentIcon, setCurrentIcon] = useState('/catscaled.png');

  const changeIcon = () => {
    setCurrentIcon('/' + icons[currentIconIndex % icons.length]);
    setCurrentIconIndex(currentIconIndex + 1);
  };

  return (
    <div className={styles.nameSelect}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <Logo color="black" />
        </div>
        <div className={styles.iconNameWrapper}>
          <button onClick={changeIcon} className={styles.icon}>
            <img className={styles.iconImg} src={currentIcon}></img>
          </button>
          <div>
            <div className={styles.title}>What&apos;s your name?</div>
            <div className={styles.inputWrapper}>
              <form style={{ all: 'unset' }} onSubmit={e => handleJoin(e)}>
                <input
                  maxLength={15}
                  placeholder="Name Here"
                  autoFocus
                  onChange={e => handleChangeUsername(e)}
                />
                <FaChevronRight></FaChevronRight>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>You are joining room {roomCode}</div>
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

    if (username.length === 0) {
      return;
    }

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
    fetch(SOCKET_URL + '/authenticate?roomCode=' + roomCode.toUpperCase(), {
      method: 'GET',
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.sessionToken != null) {
          sessionStorage.setItem('sessionToken', data.sessionToken);
          setChooseUser(true);
        }
      });
  };

  return (
    <main className={styles.wrapper}>
      {chooseUser ? (
        <NameSelect
          roomCode={roomCode}
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
                placeholder="Room Code"
                maxLength={6}
                autoCorrect="off"
                autoFocus
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
              />
            </form>
            <button className={styles.play} onClick={handleSubmitRoomCode}>
              Play!
            </button>
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
