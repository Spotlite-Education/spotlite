'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { UnstyledLink } from './components/UnstyledLink';
import { useValidateSession } from './hooks/useValidateSession';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { AnimatedLogo } from './components/AnimatedLogo';

const UsernameCharacterSelect = ({
  clearGameID,
  gameID,
}: {
  clearGameID: Function;
  gameID: string;
}) => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');

  const canJoinGame = () => {
    return username.replace(/\s+/g, '').trim().length >= 3;
  };

  const allowJoin = canJoinGame();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const handleAttemptJoinGame = async () => {
    if (loading || !allowJoin) {
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('http://localhost:8000/api/game/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameID, username }),
      });

      const { sessionID, error } = await res.json();

      if (!sessionID) {
        switch (error) {
          case 'game/invalid_username':
            setError('Invalid username!');
            break;
          case 'game/username_taken':
            setError('Username taken!');
            break;
          case 'game/nonexistent':
            clearGameID();
            break;
          case 'game/full_capacity':
            setError('Game is full!');
            break;
          case 'game/locked':
            setError('Game is locked!');
            break;
          default:
            setError('Sorry, an unknown error occurred!');
            break;
        }
      } else {
        sessionStorage.setItem('sessionID', sessionID);
        router.replace('/play');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [pencilScope, animate] = useAnimate();
  useEffect(() => {
    const pencilAnimation = async () => {
      const PENCIL_JITTER = 10;

      // show pencil
      await animate(pencilScope.current, { scale: 1 });

      // move pencil
      await animate(
        pencilScope.current,
        {
          x: 465,
          y: [0, -5, 2.5, 0],
          rotate: [
            0,
            PENCIL_JITTER,
            0,
            -PENCIL_JITTER,
            0,
            PENCIL_JITTER,
            0,
            -PENCIL_JITTER,
            0,
            PENCIL_JITTER,
            0,
            -PENCIL_JITTER,
          ],
        },
        { duration: 0.5 }
      );

      // drop pencil
      await animate(
        pencilScope.current,
        { x: 465 + 50, y: -100, rotate: 30, opacity: 1 },
        {
          delay: 0.05,
          ease: 'circOut',
        }
      );
      animate(
        pencilScope.current,
        { x: 465 + 100, y: 150, scale: 0, rotate: 65, opacity: 0 },
        { ease: 'circIn' }
      );
    };

    pencilAnimation();
  }, []);

  return (
    <div className={styles.usernameCharacterSelect}>
      <motion.span
        className={styles.prompt}
        initial={{ y: -100, scale: 2, rotate: 180, opacity: 0 }}
        animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        What&apos;s your name?
      </motion.span>
      <form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault();
          if (!allowJoin || loading) {
            return;
          }

          handleAttemptJoinGame();
        }}
      >
        <motion.input
          className={styles.usernameInput}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          value={username}
          onChange={e => {
            setUsername(e.target.value);
            setError('');
          }}
          placeholder="Your Username"
          maxLength={20}
          autoFocus
        />
        <div className={styles.joinWrapper}>
          <AnimatePresence mode="popLayout">
            {allowJoin && !loading && (
              <motion.button
                className={styles.join}
                type="submit"
                initial={{ x: '-50%', y: 10, rotate: -30, opacity: 0 }}
                animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                exit={{ x: '50%', y: 10, rotate: 30, opacity: 0 }}
                disabled={!allowJoin || loading}
              />
            )}
          </AnimatePresence>
        </div>
        <motion.img
          ref={pencilScope}
          className={styles.pencil}
          width="166.5"
          height="175.95"
          src="/assets/pencil.svg"
          initial={{ x: 7.5, scale: 0 }}
        />
        <svg
          width="47.5rem"
          height="2rem"
          viewBox="0 0 475 20"
          className={styles.underline}
        >
          <motion.path
            d="M 10 10 C 76.16 5 158.33 15 237.5 10 C 316.67 5 392.83 15 465 10"
            fill="none"
            stroke="var(--purple)"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              opacity: 0,
              strokeDasharray: 455.2,
              strokeDashoffset: 455.2,
            }}
            animate={{ opacity: 1, strokeDashoffset: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.518,
              opacity: { duration: 0 },
            }}
          />
        </svg>
      </form>
      <div className={styles.errorWrapper}>
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.span
              className={styles.error}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StudentLanding = () => {
  const [checkingGameJoinable, setCheckingGameJoinable] =
    useState<boolean>(false);
  const [roomCode, setRoomCode] = useState<string>('');
  const router = useRouter();

  const [gameJoinable, setGameJoinable] = useState<boolean>(false);

  useValidateSession({
    validCallback: () => router.replace('/play'),
  });

  const handleCheckGameJoinable = async () => {
    if (checkingGameJoinable) {
      return;
    }

    try {
      setCheckingGameJoinable(true);

      if (!roomCode || roomCode.length !== 6) {
        return;
      }

      const res = await fetch(
        `http://localhost:8000/api/game/joinable?gameID=${roomCode.toUpperCase()}`
      );

      const { joinable } = await res.json();

      setGameJoinable(joinable);
    } catch (error) {
      console.error(error);
    } finally {
      setCheckingGameJoinable(false);
    }
  };

  if (gameJoinable) {
    return (
      <UsernameCharacterSelect
        clearGameID={() => {
          setGameJoinable(false);
          setRoomCode('');
        }}
        gameID={roomCode}
      />
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div />
        <UnstyledLink href="/host">
          <motion.button
            className={styles.teacherMode}
            initial={{ rotate: 180, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            Teacher Mode!
          </motion.button>
        </UnstyledLink>
      </div>
      <div className={styles.centerContent}>
        <AnimatedLogo />
        <motion.div
          className={styles.tag}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          For Students
        </motion.div>
        <form
          className={styles.form}
          onSubmit={e => {
            e.preventDefault();
            if (roomCode.length !== 6 || checkingGameJoinable) {
              return;
            }

            handleCheckGameJoinable();
          }}
        >
          <div className={styles.roomCodeInput}>
            <input
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Room Code"
              maxLength={6}
              autoFocus
            />
            <AnimatePresence mode="popLayout">
              {roomCode.length === 6 && !checkingGameJoinable && (
                <motion.button
                  className={styles.enter}
                  initial={{ x: '-50%', y: 10, rotate: -30, opacity: 0 }}
                  animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  exit={{ x: '50%', y: 10, rotate: 30, opacity: 0 }}
                />
              )}
            </AnimatePresence>
            <motion.img
              className={styles.underline}
              src="/assets/underline.svg"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85 }}
            />
          </div>
        </form>
      </div>
      <div className={styles.footer}>
        <UnstyledLink
          href="https://spotlite-education.vercel.app"
          target="_blank"
        >
          About Spotlite
        </UnstyledLink>
        <UnstyledLink
          href="https://spotlite-education.vercel.app/contact"
          target="_blank"
        >
          Contact Us
        </UnstyledLink>
      </div>
    </main>
  );
};

export default StudentLanding;
