import { ref, Ref, onMounted, onUnmounted, provide, inject } from 'vue';
import { Socket } from 'socket.io-client';

interface GameState {
  inQueue: boolean;
  gameState: any | null;
}

interface SocketContextProps {
  //gameSocket: Ref<Socket | null>;
  gameSocket: Ref<Socket<any, any> | null>;
  gameContext: GameState;
  setGameContext: (context: GameState) => void;
  connectSockets: () => void;
  disconnectSockets: () => void;
}

const SocketContextSymbol = Symbol();

export function createSocketContext() {
 // const gameSocket = ref<Socket | null>(null);
  const gameSocket = ref<Socket<any> | null>(null);
  const gameContext = ref<GameState>({
    inQueue: false,
    gameState: null,
  });

  const setGameContext = (context: GameState) => {
    gameContext.value = context;
  };

  const connectSockets = () => {
    console.log('Connecting sockets...');
    try {
      if (!gameSocket.value) {
        console.log('Socket1= ', gameSocket.value);
      }
    } catch (error) {
      console.error('Error connecting socket:', error);
    }
  };

  const disconnectSockets = () => {
    if (gameSocket.value && gameSocket.value.connected) {
      gameSocket.value.disconnect();
    }
    gameSocket.value = null;
    setGameContext({
      inQueue: false,
      gameState: null,
    });
  };

  onMounted(() => {
    connectSockets();
  });

  onUnmounted(() => {
    disconnectSockets();
  });

  provide(SocketContextSymbol, {
    gameSocket,
    gameContext,
    setGameContext,
    connectSockets,
    disconnectSockets,
  });
}

export function useSocketContext() {
  const socketContext = inject(SocketContextSymbol) as SocketContextProps | undefined;
  if (!socketContext) {
    throw new Error('Socket context is not provided');
  }
  return socketContext;
}

export function newSocketEvent(socket: Ref<any | null>, event: string, callback: (data: any) => void) {
  socket.value?.off(event).on(event, (data) => {
    callback(data);
  });
}
