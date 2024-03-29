import React from 'react';
import io from 'socket.io-client';
import { BASE_URL } from './Strings';

export const socket = io(`${BASE_URL}`, {
  transports: ['websocket'],
  pingInterval: 1000 * 60 * 5,
  pingTimeout: 1000 * 60 * 3,
});

export const SocketContext = React.createContext();
