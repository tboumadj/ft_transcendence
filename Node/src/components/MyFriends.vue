<!-- Friends.vue -->
<template>
  <q-list bordered :class="`${ color }`">
      <q-item clickable v-ripple @click="toggleCard">
        <q-item-section avatar>
          <q-avatar square>
          <q-img :src="`${baseUrl}api/uploadAvatar/${Avatar}`" :crossorigin="credentials ? 'use-credentials' : 'anonymous'" />
          </q-avatar>
        </q-item-section>
      <q-item-section style="color: white;">[ {{ searchUsername }} ]</q-item-section>
      </q-item>
    </q-list>

  <div v-show="showContent" class="flex-container">
      <!-- <q-dialog v-model="card"> -->
      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis">
      <q-btn color="primary" icon="account_circle" @click="redirectToFriend" />
      <!-- <q-btn color="primary" icon="question_answer" @click="dm = true" /> -->
      <q-btn v-if='friend === false' color="positive" icon="favorite" @click="addFriend" />
        </div>
      </div>
      <!-- </q-dialog> -->
        <q-separator />
</div>
</template>


<script lang="ts">
import { ref, inject } from 'vue';

export default {
  props: {
    search_data: {
      type: Object,
      default: null,
    }
  },
  setup() {
  return {
      dm: ref(false),
      friend: ref(false),
      bus: inject('bus'),
      state: ref({}),

  }
  },
  data() {
    return {
      // baseUrl: process.env.NODE_ENV === 'production' ? 'http://localhost:3000/' : 'http://localhost:3000/',
      baseUrl: 'http://' + window.location.hostname + ':3000/',
      localIp: window.location.hostname,
      showContent: false,
      Avatar: null,
      id: ref(0),
      color: ref({}),
    };
  },
  computed: {
    searchUsername() {
      if (this.search_data) {
        return this.search_data.username;
      } else {
        return '';
      }
    },
  },
  mounted() {
    this.searchAvatar();
    this.areWeFriend();
    this.fetchState();
    this.bus.on('refreshFriend', () => {this.fetchState()});
  },
  methods: {
    toggleCard() {
      //console.log('Search= ',this.search_data);
      this.showContent = !this.showContent;
    },
    redirectToFriend() {
      if (this.search_data) {
       // const friendId = this.search_data.id;
       // this.$router.push({ name: 'Friend', params: { id: this.search_data.id} });
        this.$router.push({path: `/friend/${this.id}` });
      } else {
        //this.$router.push({path: '/friend/11', params: { id: 11 } });
        this.$router.push({path: `/friend/${this.id}` });
      }
    },
    searchAvatar() {
      if (this.search_data) {
        this.id = this.search_data.id;
        this.Avatar = this.search_data.avatar;
        //console.log('Avatar= ', this.Avatar);
        return this.search_data.avatar;
      } else {
        return '';
  // background-color: #0273d4;
      }
    },

    async addFriend() {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
          const response = await fetch(`http://${this.localIp}:3000/api/update/addFriend`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              friend: this.id,
            }),
          });
          const result = await response.json();
          //console.log('result = ', result);
          if (result.success == true) {
            console.log('FRIEND FOR LIFE');
            this.areWeFriend();
            this.bus.emit('freshFriend');
          } else {
            console.log('WE ALREADY FRIEND');
          }
        }
      } catch (error) {
        console.error('BUG WITH ADDING FRIEND', error);
      }
    },

    async areWeFriend() {
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
          //console.log("Myprofile", dataP);

          const result = dataP.friends.includes(+this.id);
         if (result === true) {
            //console.log('JESUISLLAAAA');
            this.friend = true;
          } else {
            this.friend = false;
          }
      }
      }
      catch (error) {
        console.log('error');
      }
    },

    async fetchState() {
      try {
        const response = await fetch(`http://${this.localIp}:3000/api/status`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const result = await response.json();
        console.log('resultStatus = ', result);

      if (this.id in result) {
        console.log('TEST', result[this.id].state);
          this.state = result[this.id].state;
          this.colorMyFriend();
      }
        else {
          this.color = 'state-0';
        }
      } catch (error) {
        console.error('Error with fetch StateFriend');
      }
    },

  colorMyFriend() {
    if (this.state === 0) {
      this.color = 'state-0';
    }
    else if (this.state === 1) {
      this.color = 'state-1';
    }
    else if (this.state === 2) {
      this.color = 'state-2';
    }
    else if (this.state === 3) {
      this.color = 'state-3';
    }
  },

  },

};
</script>

<style>
.custom-background {
  background-color: grey;
}

.state-0 {
  background-color: grey;
}

.state-1 {
  background-color: green;
}
.state-2 {
  background-color: red;
}

.state-3 {
  background-color: gold;
}
</style>
