'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { UnstyledLink } from './components/UnstyledLink';
import Image from 'next/image';

const StudentLanding = () => {
  const [roomCode, setRoomCode] = useState<string>('');
  const router = useRouter();

  // validate session on page load, rejoining game if possible
  useEffect(() => {
    const validateSession = async () => {
      const sessionID = sessionStorage.getItem('sessionID');
      if (!sessionID) {
        return;
      }

      try {
        const res = await fetch(
          'http://localhost:8000/api/game/validateSession',
          {
            method: 'POST',
            body: JSON.stringify({ sessionID }),
          }
        );

        if (res.status === 200) {
          const { valid } = await res.json();
          if (valid) {
            router.replace('/play');
          } else {
            sessionStorage.removeItem('sessionID');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    validateSession();
  }, []);

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
          width={550}
          height={150}
          alt="Spotlite Logo"
        />
        <div className={styles.tag}>For Students</div>
        <div className={styles.roomCodeInput}>
          <input
            value={roomCode}
            onChange={e => setRoomCode(e.target.value)}
            placeholder="Room Code"
            maxLength={6}
          />
        </div>
        <button className={styles.join} disabled={roomCode.length !== 6}>
          Join Game!
        </button>
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
