'use client';
import { useState } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { UnstyledLink } from './components/UnstyledLink';
import Image from 'next/image';
import { useValidateSession } from './hooks/useValidateSession';
import { RingSelect } from './components/RingSelect';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedLogo } from './components/AnimatedLogo';

const CHARACTERS = ['bunny', 'cat', 'dog', 'frog', 'horse'];
const CHARACTER_PREVIEWS = CHARACTERS.map(characterID => (
  <Image
    className={styles.characterPreview}
    width={150}
    height={150}
    src={`/characters/${characterID}.png`}
    alt={'Character: ' + characterID}
  />
));

const UsernameCharacterSelect = ({
  clearGameID,
  gameID,
}: {
  clearGameID: Function;
  gameID: string;
}) => {
  const router = useRouter();

  const [characterIndex, setCharacterIndex] = useState<number>(0);
  const [username, setUsername] = useState<string>('');

  const canJoinGame = () => {
    return (
      username.replace(/\s+/g, '').trim().length >= 3 &&
      characterIndex >= 0 &&
      characterIndex < CHARACTERS.length
    );
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
      const characterID = CHARACTERS[characterIndex];

      const res = await fetch('http://localhost:8000/api/game/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameID, username, characterID }),
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
          case 'game/invalid_character':
            setError('Invalid character!');
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

  return (
    <div className={styles.usernameCharacterSelect}>
      <div className={styles.characterSelect}>
        <RingSelect
          items={CHARACTER_PREVIEWS}
          selectedIndex={characterIndex}
          onSelect={setCharacterIndex}
          radiusX={200}
          radiusY={50}
        />
      </div>
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
        <input
          className={styles.usernameInput}
          value={username}
          onChange={e => {
            setUsername(e.target.value);
            setError('');
          }}
          placeholder="Your Username"
          maxLength={20}
          autoFocus
        />
        <button
          className={styles.join}
          type="submit"
          disabled={!allowJoin || loading}
        >
          Join Game!
        </button>
      </form>
      <span className={styles.error}>{error}</span>
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
