'use client';
import { GameState } from '@/types/GameState';
import { createContext } from 'react';

export const GameStateContext = createContext<GameState | null>(null);
