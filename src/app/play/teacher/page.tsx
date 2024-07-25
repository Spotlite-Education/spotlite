'use client';
import { GameStateContext } from '@/context/GameStateContext';
import { useContext } from 'react';
import { Lobby } from './components/Lobby';
import { redirect } from 'next/navigation';
import { StartingGame } from './components/StartingGame';
import ChooseQuizzer from './components/ChooseQuizzer';
import CreateQuestions from './components/CreateQuestions';
import NotEnoughQuestions from './components/NotEnoughQuestions';
import WarnNumQuestions from './components/WarnNumQuestions';

const TeacherPlay = () => {
  // game state is guaranteed to exist by /play/layout.tsx
  const gameState = useContext(GameStateContext)!;

  switch (gameState.stage) {
    case 'LOBBY':
      return <Lobby gameState={gameState} />;
    case 'STARTING_GAME':
      return <StartingGame gameState={gameState} />;
    case 'CREATE_QUESTIONS':
      return <CreateQuestions gameState={gameState} />;
    case 'CHOOSE_QUIZZER':
      return <ChooseQuizzer />;
    case 'NOT_ENOUGH_QUESTIONS':
      return <NotEnoughQuestions />;
    case 'WARN_NUM_QUESTIONS':
      return <WarnNumQuestions />;
    default:
      redirect('/');
  }
};

export default TeacherPlay;
