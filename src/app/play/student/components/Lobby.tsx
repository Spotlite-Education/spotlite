'use client';
import { GameState } from '@/types/GameState';
import styles from './Lobby.module.scss';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const TIPS = [
  'Make your answers short and sweet! Your classmates have to enter them exactly.',
  'Having trouble making your question? Try looking at your notes!',
  'Remember to be respectful and kind to your classmates!',
  "You can answer multiple times, so don't worry if you don't get it right the first time!",
  "Everybody's questions get saved at the end of the game. Use them to review later!",
];

export const Lobby = ({ gameState }: { gameState: GameState }) => {
  const [tipIndex, setTipIndex] = useState<number>(0);

  useEffect(() => {
    const cycleTip = setInterval(
      () => setTipIndex(prev => (prev + 1) % TIPS.length),
      7500
    );

    return () => {
      clearInterval(cycleTip);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <span className={styles.title}>You&apos;re In!</span>
      <span className={styles.prompt}>
        See yourself on the big screen? Use your mouse to move around!
      </span>
      <span className={styles.tip}>Tip: {TIPS[tipIndex]}</span>
    </div>
  );
};
