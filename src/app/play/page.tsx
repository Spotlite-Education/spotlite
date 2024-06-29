'use client';
import { GameStateContext } from '@/context/GameStateContext';
import { redirect, useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

const Page = () => {
  const router = useRouter();
  const gameState = useContext(GameStateContext);

  useEffect(() => {
    if (!gameState) {
      return;
    }

    if (gameState.isAdmin) {
      router.replace('/play/teacher');
    } else {
      router.replace('/play/student');
    }
  }, [gameState]);

  return null;
};

export default Page;
