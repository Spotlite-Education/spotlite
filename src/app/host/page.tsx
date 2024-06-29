'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { UnstyledLink } from '../components/UnstyledLink';
import Image from 'next/image';
import { useValidateSession } from '../hooks/useValidateSession';

const TeacherLanding = () => {
  const [creatingGame, setCreatingGame] = useState(false);
  const router = useRouter();

  useValidateSession({
    validCallback: () => router.replace('/play'),
  });

  const handleCreateGame = async () => {
    if (creatingGame) return;

    try {
      setCreatingGame(true);

      const res = await fetch('http://localhost:8000/api/game/create', {
        method: 'POST',
      });

      if (res.status === 200) {
        const { adminSessionID } = await res.json();
        if (!adminSessionID) {
          return;
        }

        sessionStorage.setItem('sessionID', adminSessionID);
        router.replace('/play');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCreatingGame(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <UnstyledLink
          href="https://spotlite-education.vercel.app"
          target="_blank"
        >
          <div className={styles.spotlite} />
        </UnstyledLink>
        <UnstyledLink href="/">
          <button className={styles.studentMode}>Student Mode!</button>
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
        <div className={styles.tag}>For Teachers</div>
        <button
          className={styles.createGame}
          onClick={handleCreateGame}
          disabled={creatingGame}
        >
          Create Game!
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

export default TeacherLanding;
