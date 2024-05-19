<template>
  <!-- <div class="q-pa-md game-container button-container"></div> -->
      <template v-if="gameStarted === false && queueStarted === false && gameisEnd === false">
        <div class="q-pa-md game-container button-container">
    <q-card class="Game custom-background" flat bordered >
      <div class='flex flex-col items-center justify-center'>
        <div class='Title-game mb-10'>Welcome to T.R.I.S Game</div>
          <button class="custom-button" data-text="Awesome" @click="() => {gameSocket?.emit('joinQueue')}">
            <span class="actual-text">&nbsp;PONG&nbsp;</span>
          </button>
        </div>
    </q-card>
        </div>
    </template>

        <template v-else-if="gameStarted === false && queueStarted === true && gameisEnd === false">
        <div class="q-pa-md game-container button-container">
          <q-card class="Game custom-background" flat bordered >
            <div class='flex flex-col items-center justify-center'>
            <div class='Title-game mb-10'>Awaiting a challenger...</div>
            <q-spinner-ball
        color="black"
        size="5.5em"
      />
            <button class="custom-button" data-text="Awesome" @click="() => {gameSocket?.emit('leaveQueue')}">
              <span class="actual-text">&nbsp;LEAVE&nbsp;</span>
            </button>
            </div>
          </q-card>
          </div>
    </template>

  <template v-else-if="gameisEnd === true">
        <div class="q-pa-md game-container button-container">
          <q-card class="Game custom-background" flat bordered >
            <div class='flex flex-col items-center justify-center'>
      <div class="result-message">
            <h1>END GAME!</h1>
            <h2>Check History on Profile</h2>
        <!-- Vous pouvez afficher d'autres détails ou actions ici -->
          </div>
        </div>
          </q-card>
      </div>
      </template>

<template v-else>
  <div class='players-name'>
    <div class=''>{{players1?.name}} VS {{players2?.name}}</div><br/>
    {{gameContext.gameState.score1}} - {{gameContext.gameState.score2}}
  </div>
  <CanvasGame :ctx="gameContext.gameState" />
  <div class='custom-button'>
    <button class="custom-button" @click="() => gameSocket?.emit('abondonGame')">
      <span class="actual-text">&nbsp;GIVE UP&nbsp;</span>
    </button>
  </div>

    <!--   <div class="result-message"> -->
    <!--     <h2>{{ gameContext.gameState.loser === 1 ? players1!.name : players2!.name }} a abandonné!</h2> -->
    <!--   </div> -->
    <!-- </template> -->

</template>



  <!-- </div> -->
</template>


<script lang="ts">
import CanvasGame from './CanvasGame.vue';
import { watch, defineComponent, ref, onMounted, onUnmounted, inject, computed} from 'vue';
import { useRoute } from 'vue-router';
import { newSocketEvent, useSocketContext } from './SocketProvider';
//import ThemeSelector from './themeSelector.vue';
//import BallSelector from './themeBall.vue';
//import icon from '../../assets/icon.png';
import apiHandle, { withAuth } from './API_Access';
import { IUser } from './types/types';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { useQuasar } from 'quasar'



export function newSocket(): Socket {
      const cookies = localStorage.getItem('jwtToken')!;
  // console.log(cookies);
  return io( `http://${window.location.hostname}:3000`, {
        extraHeaders: {
          'cookies': cookies,
        }
      });
}

export default defineComponent({
  components: {
    CanvasGame,
    //ThemeSelector,
    //BallSelector,
  },
  setup() {

    interface GameState {
      inQueue: boolean;
      gameState: any | null;
    }
    const gameContext = ref(<GameState>{});
    const $q = useQuasar();
    //const socket = io('http://localhost:3000');
    // const route = useRoute();
    // const location = route.path; // Obtention du chemin actuel
    //const location = useLocation();
    // const queryParams = new URLSearchParams(route.query.toString());
    //const queryParams = new URLSearchParams(location.value.search);
    const route = useRoute();
    const queryParams = route.query;
    let frind_id = route.query.frind_id;
    let owner = route.query.owner;
    let accept = route.query.accept;
    const theme = ref<string>('default');
    const ball = ref<string>('default');
    //const gameSocket = ref<Socket | null>(null);
    //const gameContext = ref<any>(null);
    const players1 = ref<IUser | undefined>();
    const players2 = ref<IUser | undefined>();
    const gameStarted = ref(false);
    const queueStarted = ref(false);
    const gameisEnd = ref(false);
    // const winnerIs = ref();
    //const socketContext = SocketContext.inject();
    const socketContext = useSocketContext();
    var { gameSocket, connectSockets, disconnectSockets } = useSocketContext();

    const startingGame = () => {
      console.log('GAME LAUNCH');
      gameStarted.value = true;
    };

 // const checkWinner = computed(() => {
 //      console.log('checkwin', gameContext.value.gameState.score1 >= 11 || gameContext.value.gameState.score2 >= 11);
 //        return gameContext.value.gameState.score1 >= 11 || gameContext.value.gameState.score2 >= 11;
 //    });

 //    const getWinnerName = computed(() => {
 //      console.log('getname', gameContext.value.gameState.score1 >= 11 ? players1.value?.name : players2.value?.name);
 //      return gameContext.value.gameState.score1 >= 11 ? players1.value?.name : players2.value?.name;
 //    });

    // const handleGiveUp = (player: number) => {
    //   gameContext.value.gameState.loser = player;
    // };

 // onMounted(() => {
 //      newSocketEvent(gameSocket, 'giveUp', (data: any) => {
 //        handleGiveUp(data.player);
 //      });
 //    });

    onMounted(() => {
      connectSockets();
      // console.log('Query inGame = ', queryParams);
    });

    onUnmounted(() => {
      disconnectSockets();
    });

    onMounted(() => {
      newSocketEvent(gameSocket, 'connect', () => {
        // handle socket connected event
      });

      newSocketEvent(gameSocket, 'disconnect', () => {
        // handle socket disconnected event
      });
    });

    onMounted(() => {
      gameSocket.value = newSocket();
      connectSockets();
    });

    onUnmounted(() => {
      disconnectSockets();
    });

    // const connectSockets = () => {
    //   gameSocket.value?.emit('connect');
    // };

    //const disconnectSockets = () => {
    //  gameSocket.value?.emit('disconnect');
    //};

    // const handleThemeChangeBackground = (theme: string) => {
    //   localStorage.setItem('theme', theme);
    //   theme.value = theme;
    // };

    // const handleThemeChangeBall = (ball: string) => {
    //   localStorage.setItem('ball', ball);
    //   ball.value = ball;
    // };

    onMounted(() => {
      if (!gameSocket.value || gameSocket.value.connected) {
        return;
      }
      localStorage.removeItem('theme');
      localStorage.removeItem('ball');
      // console.log('queryparam = ', queryParams);
      // console.log('friend value= ', frind_id.value);
      if (frind_id) {
      $q.dialog({
            title: 'Theme Selector',
        message: 'Choose your Theme:',
        options: {
         type: 'radio',
          model: 'opt1',
          // inline: true
          items: [
            { label: 'Green & White', value: 'opt1', color: 'secondary' },
            { label: 'Blue & White', value: 'opt2' },
            { label: 'Yellow & Black', value: 'opt3' }
          ]
          },
        persistent: true
          }).onOk(data => {
            if(data === 'opt2'){
              localStorage.setItem('theme', '#333399');
              localStorage.setItem('ball', 'white');
            } else if(data === 'opt3'){
              localStorage.setItem('theme', '#dada3d');
              localStorage.setItem('ball', 'black');
            }
          })
        // console.log('Send TO BACK PRIVATEQUEU');
        gameSocket.value.emit('privateQueue', {
          owner: owner === 'yes' ? true : false,
          second: frind_id,
          accept: accept === 'yes' ? true : false,
        });
        setNullForAll();
      }
    });

    const setNullForAll = () => {
      frind_id = null;
      owner = null;
      accept = null;
    };

    onMounted(() => {
      if (!gameSocket.value || gameSocket.value.connected) {
        return;
      }




      newSocketEvent(gameSocket, 'connect', () => {
         //forceUpdate();
      });

      newSocketEvent(gameSocket, 'disconnect', () => {
         //forceUpdate();
      });

      newSocketEvent(gameSocket, 'joinQueueSuccess', () => {

            $q.dialog({
            title: 'Theme Selector',
        message: 'Choose your Theme:',
        options: {
         type: 'radio',
          model: 'opt1',
          // inline: true
          items: [
            { label: 'Green & White', value: 'opt1', color: 'secondary' },
            { label: 'Blue & White', value: 'opt2' },
            { label: 'Yellow & Black', value: 'opt3' }
          ]
          },
        persistent: true
          }).onOk(data => {
            if(data === 'opt2'){
              localStorage.setItem('theme', '#333399');
              localStorage.setItem('ball', 'white');
            } else if(data === 'opt3'){
              localStorage.setItem('theme', '#dada3d');
              localStorage.setItem('ball', 'black');
            }
        gameContext.value.inQueue = true;
        queueStarted.value = true;
          })
      });

      newSocketEvent(gameSocket, 'joinPrivateQueueSuccess', () => {
        gameContext.value.inQueue = true;
        queueStarted.value = true;
      });

      newSocketEvent(gameSocket, 'leaveQueueSuccess', () => {
        gameContext.value.inQueue = false;
        queueStarted.value = false;
      });

      newSocketEvent(gameSocket, 'gameStart', (data: any) => {
        gameContext.value = { inQueue: false, gameState: data };
        //console.log('GAMESTATE= ', gameContext.value.gameState);
        gameStarted.value = true;
      });

      newSocketEvent(gameSocket, 'gameUpdate', (data: any) => {
        gameContext.value.gameState= data;
      });

      newSocketEvent(gameSocket, 'gameEnd', () => {
        // winnerIs.value = getWinnerName;
        // console.log('winnerIs=', winnerIs.value);
        gameisEnd.value = true;
        gameContext.value = { inQueue: false, gameState: null };
        gameStarted.value = false;
        queueStarted.value = false;
        players1.value = undefined;
        players2.value = undefined;
      });

      gameSocket.value.connect();
    });

    onMounted(() => {
      const keyDownHandler = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') gameSocket.value?.emit('startUp');
        if (e.key === 'ArrowDown') gameSocket.value?.emit('startDown');
      };

      const keyUpHandler = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') gameSocket.value?.emit('stopUp');
        if (e.key === 'ArrowDown') gameSocket.value?.emit('stopDown');
      };

      document.addEventListener('keydown', keyDownHandler);
      document.addEventListener('keyup', keyUpHandler);

      onUnmounted(() => {
        if (gameSocket.value) {
          gameSocket.value.disconnect();
          gameSocket.value = null;
        }
        document.removeEventListener('keydown', keyDownHandler);
        document.removeEventListener('keyup', keyUpHandler);
      });
    });

// if (gameContext.value.gameState) {
//   watch(checkWinner, (isWinner) => {
//     if (isWinner) {
//           winnerIs.value = getWinnerName;
//           console.log('winnneris= ', winnerIs.value);
//       gameSocket.value?.emit('gameEnd');
//     }
//   });
//     }

    return {
      gameSocket,
      gameContext,
      players1,
      players2,
      connectSockets,
      disconnectSockets,
      gameStarted,
      queueStarted,
      startingGame,
      location,
      // checkWinner,
      // getWinnerName,
      gameisEnd,
      // winnerIs,
      // handleThemeChangeBackground,
      // handleThemeChangeBall,
    };
  },
});

</script>


<style scoped>
.game-container {
  display: flex;
  justify-content: flex-start;
}

.Game {
  width: 700px;
  height: 400px;
}

.hover-text {
    position: absolute;
    box-sizing: border-box;
    content: attr(data-text);
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: 0.5s;
    -webkit-text-stroke: 1px var(--animation-color);
  }


.button-container {
  display: flex;
  margin-top: 20px;
}

.custom-button {
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.custom-button:hover {
  background-color: #0273d4;
}

.custom-background {
  background-color: #0273d4;
}

.button-container Button:first-child {
  margin-right: 50px;
}

.Title-game
    {
        font-family: 'ArcadeClassic', sans-serif;
        font-size: 5em;
        text-align: center;
        color: black;
        text-shadow: 5px 3px 20px rgb(69, 78, 70);
    }

    .players-icon
    {
      border: 2px solid #2C3E50;
      width: 50px;
      height: 50px;
      align-items: start;
      border-radius: 80%;
    }

    .players-name
    {
      font-family: 'ArcadeClassic', sans-serif;
      font-size: 1.5em;
      text-align: center;
    }
</style>
