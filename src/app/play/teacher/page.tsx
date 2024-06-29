'use client';
import { GameStateContext } from '@/context/GameStateContext';
import { useContext } from 'react';
import { Lobby } from './Components/Lobby';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';

const TeacherPlay = () => {
  // game state is guaranteed to exist by /play/layout.tsx
  const gameState = useContext(GameStateContext)!;

  switch (gameState.stage) {
    case 'LOBBY':
      return <Lobby gameState={gameState} />;
    default:
      redirect('/');
  }
};

export default TeacherPlay;
