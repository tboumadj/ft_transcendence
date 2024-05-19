<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createSocketContext } from './game/SocketProvider';

export default defineComponent({
  name: 'App',
setup() {
    createSocketContext();
    return {};
  }
});
</script>
