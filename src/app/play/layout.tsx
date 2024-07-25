'use client';
import { GameStateContext } from '@/context/GameStateContext';
import { GameState } from '@/types/GameState';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useValidateSession } from '../hooks/useValidateSession';

export const socket = io('http://localhost:8000', { autoConnect: false });

const Play = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const handleSocketConnect = () => {
      socket.emit('handshake', sessionStorage.getItem('sessionID'));
    };

    socket.on('connect', handleSocketConnect);

    const handleGameStateUpdate = (gameState: GameState) => {
      console.log(gameState);
      setGameState(gameState);
    };

    socket.on('gameStateUpdate', handleGameStateUpdate);

    const handleServerRequestGameStateUpdate = () => {
      socket.emit('queryGameState');
    };

    socket.on('requestGameStateUpdate', handleServerRequestGameStateUpdate);

    // a socket should connect joining a game
    socket.connect();

    return () => {
      socket.off('connect', handleSocketConnect);
      socket.off('gameStateUpdate', handleGameStateUpdate);
      socket.off('requestGameStateUpdate', handleServerRequestGameStateUpdate);
    };
  });

  const router = useRouter();

  useValidateSession({
    invalidCallback: () => {
      router.replace('/');
    },
  });

  if (!gameState) {
    return null;
  }

  return (
    <GameStateContext.Provider value={gameState}>
      {children}
    </GameStateContext.Provider>
  );
};

export default Play;
