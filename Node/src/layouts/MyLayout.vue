<template>
  <q-layout view="hHh lpR lFr">

    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="text-h6 text-center">
          <q-avatar size="75px">
          <!-- <div class="my-avatar"> -->
            <!-- <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"> -->
            <img :src="`${baseUrl}api/uploadAvatar/logoLayout9.png`" :crossorigin="credentials ? 'use-credentials' : 'anonymous'"/>
          </q-avatar>
          <!-- </div> -->
          T.R.I.S Pong
        </q-toolbar-title>

        <!-- <q-btn dense flat round icon="menu" @click="toggleRightDrawer" /> -->
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/home" label="Profile" />
        <q-route-tab to="/game" label="Game" />
        <q-route-tab to="/chat" label="Chat" />
      </q-tabs>
    </q-header>

    <!-- <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered> -->
      <!-- drawer content -->
      <!-- <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px"> -->
      <!--     <div class="absolute-bottom bg-transparent"> -->
      <!--       <q-avatar size="56px" class="q-mb-sm"> -->
      <!--         <img :src="`${baseUrl}api/uploadAvatar/${profileData.avatar}`" :crossorigin="credentials ? 'use-credentials' : 'anonymous'"/> -->
      <!--       </q-avatar> -->
      <!--       <div class="text-weight-bold">Razvan Stoenescu</div> -->
      <!--       <div>@rstoenescu</div> -->
      <!--     </div> -->
      <!--   </q-img> -->
    <!-- </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
// import { ref } from 'vue'

export default {
  setup () {
    // const rightDrawerOpen = ref(false)

    return {
      // rightDrawerOpen,
      // toggleRightDrawer () {
      //   rightDrawerOpen.value = !rightDrawerOpen.value
      // }
    }
  },
  data () {
    return {
      // baseUrl: process.env.NODE_ENV === 'production' ? 'http://localhost:3000/' : 'http://localhost:3000/',
      baseUrl: 'http://' + window.location.hostname + ':3000/',
      // localIp: window.location.hostname,
    };
  },
}
</script>

<style>
.my-avatar {
  position: left;
  vertical-align: middle;
  display: inline-block;
  border-radius: 50%;
  font-size: 38px;
  height: 2em;
  width: 2em;
}
</style>
