<!-- ModuleHistory.vue -->
<template>
  <tbody v-if="data">
    <tr>
      <td class="text-left">{{ data.opponent.name }}</td>
      <td class="text-left">{{ data.scorP1 }} - {{ data.scorP2 }}</td>
      <td class="text-left">{{ data.win ? 'Win' : 'Loss' }}</td>
    </tr>
  </tbody>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';


interface DataInfo {
  scorP1: number,
  scorP2: number,
  playedOn: Date,
  opponent: {
    name: string,
  },
  win: boolean,
}

export default defineComponent({
  props: {
    data: {
      type: Object as () => DataInfo,
      required: true,
    },
},

});
</script>
