'use client';

import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export const SOCKET_URL = 'http://localhost:8000';

const socket = io(SOCKET_URL);
export default socket;
