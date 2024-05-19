<!-- Game.vue -->
<template>
  <div class="page-container">
    <h2>{{ message }}</h2>
  </div>
  <div class="flex-container">
    <div v-if="game !== true" class="button-container">
    <Button @click="game = true" class="custom-button">Quick match</Button>
    <!-- <Button @click="changeMessage" class="custom-button">Play with friend</Button> -->
  </div>
    <div v-else>
      <SocketProvider>
    <PongGame/>
  </SocketProvider>
    </div>
  </div>
</template>

<script lang="ts">
import SocketProvider from './SocketProvider.vue';
import PongGame from '../game/PongGame.vue';
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';


export default {
  components: {
    PongGame
  },
  setup() {
    const route = useRoute();
    // const queryParams = new URLSearchParams(route.query.toString());
    const queryParams = route.query;
    // const frind_id = route.query.frind_id;
    // const owner = ref(queryParams.get('owner'));
    // const accept = ref(queryParams.get('accept'));
    const game = ref(false);


    onMounted(() => {
      console.log('query after = ', queryParams);
      if(queryParams) {
         game.value = true;
      }
    });

    return {
      route,
      queryParams,
      // frind_id,
      game,
    }
  },

  data() {
    return {
      message: 'Ping!',
      // game: ref(false),
      bus: inject('bus'),
      baseUrl: 'http://' + window.location.hostname + ':3000/',
      localIp: window.location.hostname,
    };
  },
  methods: {
    // changeMessage() {
    //   this.message = 'Pong!';
    // },

    // async privateSend() {

    // },

    async checkToken() {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        try {
          const response = await fetch(`http://${this.localIp}:3000/api/auth/checkJWT`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwtToken}`,
            },
            credentials: 'include',
            //body: JSON.stringify({ token: jwtToken }),
          });
          const resp = await response.json();
          //console.log('responsecheck: ', resp);
          if (resp.success) {
            console.log('user validate!');
          }
          else {
            console.log('Unvalidate user!');
            this.$router.push('/');
          }
        }
        catch (error) {
          console.log('Error with validating JWT!');
          this.$router.push('/');
        }
      }
      else {
        console.log('User not connected!');
        this.$router.push('/');
      }
    },

  },
  mounted() {
    this.checkToken();
    this.bus.emit('inGameSet');
  },
};
</script>

<style>
body {
  background-color: #229964;
  margin: 0;
}

.page-container {
  border: 5px solid #000;
  border-left-width: 0px;
  border-right-width: 0px;
  padding: 5px;
  background-color: #fff;
  text-align: center;
}

.flex-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  text-align: left;
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
  background-color: #2980b9;
}

.button-container Button:first-child {
  margin-right: 50px;
}
</style>
