'use client';
import { useState } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';
import { UnstyledLink } from '../components/UnstyledLink';
import { useValidateSession } from '../hooks/useValidateSession';
import { motion } from 'framer-motion';
import { AnimatedLogo } from '../components/AnimatedLogo';

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
        <div />
        <UnstyledLink href="/">
          <motion.button
            className={styles.studentMode}
            initial={{ rotate: 180, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            Student Mode!
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
          For Teachers
        </motion.div>
        <motion.button
          className={styles.createGame}
          onClick={handleCreateGame}
          disabled={creatingGame}
          initial={{ scale: 0, rotate: 180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          Create Game!
        </motion.button>
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

export default TeacherLanding;
