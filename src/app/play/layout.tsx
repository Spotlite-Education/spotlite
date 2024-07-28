'use client';
import { GameStateContext } from '@/context/GameStateContext';
import { GameState } from '@/types/GameState';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useValidateSession } from '../hooks/useValidateSession';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CharacterContext } from '@/context/CharacterContext';

export const socket = io('http://localhost:8000', { autoConnect: false });

const Play = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const queryClient = useQueryClient();

  const fetchCharacter = async () => {
    try {
      const res = await fetch(
        'http://localhost:8000/api/game/requestCharacter',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionID: sessionStorage.getItem('sessionID'),
          }),
        }
      );

      const { curves } = await res.json();
      return curves;
    } catch (err) {
      console.error(err);
    }
  };

  const characterQuery = useQuery({
    queryKey: ['character'],
    queryFn: fetchCharacter,
  });

  useEffect(() => {
    const handleSocketConnect = () => {
      socket.emit('handshake', sessionStorage.getItem('sessionID'));
    };

    socket.on('connect', handleSocketConnect);

    const handleGameStateUpdate = (newGameState: GameState) => {
      console.log(newGameState);

      const shouldFetchCharacter =
        !characterQuery.data && newGameState.playerInfo?.characterSubmitted;

      if (shouldFetchCharacter) {
        queryClient.invalidateQueries({ queryKey: ['character'] });
      }

      setGameState(newGameState);
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
  }, []);

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
      <CharacterContext.Provider value={characterQuery.data || null}>
        {children}
      </CharacterContext.Provider>
    </GameStateContext.Provider>
  );
};

export default Play;
