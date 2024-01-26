'use client';

import { io } from 'socket.io-client';
import { createContext } from 'react';
import { atom } from 'jotai';
import type { Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000';
const socket = io(SOCKET_URL);

export const socketAtom = atom<Socket>(socket);
