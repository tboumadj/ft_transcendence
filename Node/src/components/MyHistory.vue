<!-- MyHistory.vue -->
<template>

  <div class="q-pa-md">
    <q-card class="history" flat bordered>
      <q-card-section>
        <div class="text-h6">Match History</div>
        <div class="text-subtitle2">{{ user.pseudo }}</div>
      </q-card-section>

      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">Against</th>
            <th class="text-left">Score</th>
            <th class="text-left">W/L</th>
          </tr>
        </thead>
          <template v-if="data.length">
            <ModulHistory v-for="(history, index) in data" :key="index" :data="history" />
          </template>
          <template v-else>
            <tr>
              <td colspan="3">No match history available</td>
            </tr>
          </template>
      </q-markup-table>
    </q-card>
  </div>

</template>

<script lang="ts">
import { ref } from 'vue';
import ModulHistory from './ModulHistory.vue';

interface UserInfo {
  id: number,
  pseudo: string,
};


interface DataInfo {
  scorP1: number,
  scorP2: number,
  playedOn: Date,
  opponent: {
    name: string,
  },
  win: boolean,
}

export default {
  components: {
  ModulHistory,
  },
  props: {
    user: {
      type: Object as () => UserInfo,
      required: true,
    },
  },
  setup() {

    return {
    data: ref(<DataInfo[]>[]),
    // baseUrl: 'http://' + window.location.hostname + ':3000/',
    localIp: window.location.hostname,
    }
    },

  methods: {
    async fetchHistory() {
    try {
        const response = await fetch(`http://${this.localIp}:3000/api/game?userId=${this.user.id}`, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    },
    credentials: 'include',
    });
    const result = await response.json();
    let newData: DataInfo[] = [];

      result.forEach((history: any) => {
      let win = false;
      let opponent = { name: '' };

      if (this.user.id === history.p1Id) {
        win = history.scorP1 > history.scorP2;
        opponent = {
          name: history.p2.name,
        };
      } else if (this.user.id === history.p2Id) {
        win = history.scorP2 > history.scorP1;
        opponent = {
          name: history.p1.name,
        };
      }

      newData.push({
        scorP1: history.scorP1,
        scorP2: history.scorP2,
        playedOn: history.playedOn,
        opponent: opponent,
        win: win,
      });
    });

    this.data = newData;

    } catch (error) {
    console.error('error with friendlist');
    }
    },
  },
    mounted() {
      this.fetchHistory();
    },
};
</script>


<style>

body {
  background-color: #229964;
  margin: 0;
}

.history {
  width: 100%;
  max-width: 700px;
}
</style>
