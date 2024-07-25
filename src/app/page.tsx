'use client';
import { useState } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { UnstyledLink } from './components/UnstyledLink';
import Image from 'next/image';
import { useValidateSession } from './hooks/useValidateSession';
import { RingSelect } from './components/RingSelect';

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
        <UnstyledLink
          href="https://spotlite-education.vercel.app"
          target="_blank"
        >
          <div className={styles.spotlite} />
        </UnstyledLink>
        <UnstyledLink href="/host">
          <button className={styles.teacherMode}>Teacher Mode!</button>
        </UnstyledLink>
      </div>
      <div className={styles.centerContent}>
        <Image
          priority
          src="/Spotlite_Logo.svg"
          width={600}
          height={150}
          alt="Spotlite Logo"
        />
        <div className={styles.tag}>For Students</div>
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
          </div>
          <button
            className={styles.join}
            type="submit"
            disabled={roomCode.length !== 6 || checkingGameJoinable}
          >
            Join Game!
          </button>
        </form>
      </div>
      <div className={styles.footer}>
        <UnstyledLink
          href="https://spotlite-education.vercel.app/contact"
          target="_blank"
        >
          Contact Us!
        </UnstyledLink>
        <span>;)</span>
      </div>
    </main>
  );
};

export default StudentLanding;
