import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Conectado com ID:', socket.id);
});

socket.on('message', (data) => {
  console.log('Mensagem recebida:', data);
});
