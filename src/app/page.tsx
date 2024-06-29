'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { UnstyledLink } from './components/UnstyledLink';
import Image from 'next/image';
import { useValidateSession } from './hooks/useValidateSession';

const StudentLanding = () => {
  const [roomCode, setRoomCode] = useState<string>('');
  const router = useRouter();

  useValidateSession({
    validCallback: () => router.replace('/play'),
  });

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
