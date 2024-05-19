<template>
  <q-layout view="hHh lpR lFr">

    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="text-h6 text-center">
          <q-avatar size="75px">
            <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"> -->
            <img :src="`${baseUrl}api/uploadAvatar/logoLayout9.png`" :crossorigin="credentials ? 'use-credentials' : 'anonymous'"/>
          </q-avatar>
          T.R.I.S Pong
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/home" label="Profile" />
        <q-route-tab to="/game" label="Game" />
        <q-route-tab to="/chat" label="Chat" />
      </q-tabs>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay show-if-above bordered>
      <!-- drawer content -->
      <q-toolbar style="height: 130px;">
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img :src="`${baseUrl}api/uploadAvatar/${profileData.avatar}`" :crossorigin="credentials ? 'use-credentials' : 'anonymous'"/>
          </q-avatar>
          <!-- <q-btn -->
          <!--     fab -->
          <!--     color="primary" -->
          <!--     icon="sync" -->
          <!--     class="absolute" -->
          <!--     style="top: 10; right: 5px; transform: translateY(-20%);" -->
          <!--     @click='this.fetchProfileData' /> -->
          <div class="text-weight-bold">{{profileData.pseudo}}</div>
          <div>@{{profileData.username}}</div>
          </div>
      </q-img>
      </q-toolbar>

      <!-- <div class="absolute-bottom"> -->
      <friends-list />
      <!-- </div> -->
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { ref, inject } from 'vue'
import FriendsList from '../components/MyFriendList.vue';
import io, { Socket } from 'socket.io-client';



      let socket: Socket;

export default {
  components: {
    FriendsList
  },
  setup () {
    const rightDrawerOpen = ref(false)

    return {
      bus: inject('bus'),
      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  },
  data () {
    return {
      profileData: {},
      // baseUrl: process.env.NODE_ENV === 'production' ? 'http://localhost:3000/' : 'http://localhost:3000/',
      baseUrl: 'http://' + window.location.hostname + ':3000/',
      localIp: window.location.hostname,
    };
  },
  methods: {
  async fetchProfileData() {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      //console.log('jwtTest: ', jwtToken);
      if (jwtToken) {
          const responseData = await fetch(`http://${this.localIp}:3000/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          credentials: 'include',
        });
        const dataP = await responseData.json();
        this.profileData = dataP;
      }
    } catch (error) {
      console.log('error');
    }
  },

    async WsConnect() {
      socket = io( `http://${this.localIp}:3000/status`, {
        extraHeaders: {
          'cookies': localStorage.getItem('jwtToken')!,
        }
      });
    },



    async sendOnLineMessage() {
      try {
        socket.emit('onLine');
        console.log('Message onLine envoyé avec succès');
    } catch (error) {
    console.error('Erreur lors de l\'envoi du message onLine', error);
    }
    },

    async sendOffLineMessage() {
      try {
        socket.emit('offLine');
        console.log('Message OffLine envoyé avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message OffLine:', error);
      }
    },

    async sendInGameMessage() {
      try {
        socket.emit('inGame');
        console.log('Message inGame envoyé avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message inGame:', error);
      }
    },

    async sendInChatMessage() {
      try {
        socket.emit('inChat');
        console.log('Message inChat envoyé avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message inChat:', error);
      }
    },


  },
  mounted () {
    this.fetchProfileData();
    this.WsConnect();
    this.sendOnLineMessage();
    this.bus.on('refreshProfile', this.fetchProfileData);
    this.bus.on('inGameSet', this.sendInGameMessage);
    this.bus.on('inChatSet', this.sendInChatMessage);
    this.bus.on('inOnSet', this.sendOnLineMessage);
    this.bus.on('inOffSet', this.sendOffLineMessage);
    socket.on('update', () => { this.bus.emit('refreshFriend');this.bus.emit('refreshList')});
  },
}
</script>
