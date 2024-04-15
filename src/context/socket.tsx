'use client';

import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export const SOCKET_URL = 'http://localhost:8000';
// export const SOCKET_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

const socket = io(SOCKET_URL);
export default socket;
