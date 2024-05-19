<!-- MyList.vue -->
<template>
  <q-list bordered :class="`${ color }`">
    <q-item clickable v-ripple @click="toggleCard">
      <q-item-section avatar>
        <q-avatar square>
          <q-img :src="`${baseUrl}api/uploadAvatar/${user.avatar}`" :crossorigin="credentials ? 'use-credentials' : 'anonymous'" />
        </q-avatar>
      </q-item-section>
      <q-item-section style="color: white;">[ {{ user.username }} ]</q-item-section>
    </q-item>
  </q-list>

  <div v-show="showContent" class="flex-container">
    <div class="row no-wrap items-center">
      <div class="col text-h6 ellipsis">
        <q-btn color="primary" icon="account_circle" @click="redirectToFriend" />
        <q-btn color="primary" icon="sports_esports" @click="sendMatch" />
        <q-btn v-if="private === false" color="primary" icon="question_answer" @click="sendMessage" />
        <q-btn v-else color="warning" icon="question_answer" @click="receiveMessage" />
        <q-btn color="negative" icon="dangerous" @click="deleteFriend" />
      </div>
    </div>
    <q-separator />
  </div>

</template>

<script lang="ts">
import { ref, inject } from 'vue';
import io, { Socket } from 'socket.io-client';

interface UserInfo {
  id: number,
  username: string,
  pseudo: string,
  avatar: string,
  state: number,
};

export default {
  props: {
    user: {
      type: Object as () => UserInfo,
      required: true,
    },
},
  setup() {

    return {
      // dm: ref(false),
      suppr: ref(false),
      bus: inject('bus'),
      state: ref({}),
      color: ref({}),
      dialog: ref(false),
      private: ref(false),
  }
},
data() {
return{
      // baseUrl: process.env.NODE_ENV === 'production' ? 'http://localhost:3000/' : 'http://localhost:3000/',
      baseUrl: 'http://' + window.location.hostname + ':3000/',
      localIp: window.location.hostname,
      showContent: false,
      id: {},
};
},
  methods: {
    toggleCard() {
      this.showContent = !this.showContent;
    },

    redirectToFriend() {
       // const friendId = this.search_data.id;
       // this.$router.push({ name: 'Friend', params: { id: this.search_data.id} });
        this.$router.push({path: `/friend/${this.user.id}` });
  },

    async sendMessage() {
      try {
        console.log('Sending invit message');
        const frind_id = this.user.id;
        const owner = 'yes';
        this.$router.push({path: 'chat', query: {frind_id, owner} });
      } catch (error) {
        console.error('Cannot Send private Message', error);
      }
    },


    async receiveMessage() {
      try {
        console.log('Accept invit message');
        const frind_id = this.user.id;
        const owner = 'no';
        this.private = false;
        this.$router.push({path: 'chat', query: {frind_id, owner} });
      } catch (error) {
        console.error('Cannot Send private Message', error);
      }
    },

    async sendMatch() {
      try {
        console.log('Sending invitation');
        const owner = 'yes';
        const frind_id = this.user.id;
        const accept = 'no';
        this.$router.push({path: 'game', query: {owner, frind_id, accept} });
      } catch (error) {
        console.error('Cannot send Invitation to match with this friend', error);
      }
    },

    async deleteFriend() {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
          const response = await fetch(`http://${this.localIp}:3000/api/update/deleteFriend`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              friend: this.user.id,
            }),
          });
          const result = await response.json();
          //console.log('result = ', result);
          if (result.success == true) {
            console.log('FRIEND DELETED');
           this.bus.emit('freshFriend');
          } else {
            console.log('FRIEND Not DELETE');
          }
        }
      } catch (error) {
        console.error('BUG WITH DELETING FRIEND', error);
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
        // console.log('resultStatus = ', result);

      if (this.user.id in result) {
        // console.log('TEST', result[this.user.id].state);
          this.state = result[this.user.id].state;
          this.colorMyFriend();
        if (result[this.user.id].state === 2)
          {
            // console.log('MAYBE INVITATION');
            await this.fetchInvit();
          }
        if (result[this.user.id].state === 3)
          {
            // console.log('MAYBE Message');
            await this.fetchMessage();
          }
      }
        else {
          this.color = 'state-0';
        }
      } catch (error) {
        console.error('Error with fetch StateFriend');
      }
    },

    async fetchInvit() {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
        const response = await fetch(`http://${this.localIp}:3000/api/auth/profile/invit`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
          },
          credentials: 'include',
        });
          const result =  await response.json();
          // console.log('respone INVIT= ', result);
          if (result === true) {
            // console.log('NOTIF TO MATCH');
            this.$q.dialog({
              title: 'Invitation To A Match',
              message: 'A Friend Invite You To PongGame',
              cancel: true,
              persistent: true,
            }).onOk(() => {
                // L'utilisateur a choisi "oui"
                fetch(`http://${this.localIp}:3000/api/update/ResInv`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                  },
                  credentials: 'include',
                });
                const owner = 'no';
                const frind_id = this.user.id;
                const accept = 'yes';
                this.$router.push({path: 'game', query: {owner, frind_id, accept} });
                console.log('L\'utilisateur a choisi Oui');
              }).onCancel(() => {
                // L'utilisateur a choisi "non"
                fetch(`http://${this.localIp}:3000/api/update/ResInv`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                  },
                  credentials: 'include',
                });
                console.log('L\'utilisateur a choisi Non');

              });

          }
        }
      } catch(error) {
          console.error('Error cannot look my invitation', error);
        }
    },

    async fetchMessage() {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
        const response = await fetch(`http://${this.localIp}:3000/api/auth/profile/message`, {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
          },
          credentials: 'include',
        });
          const result =  await response.json();
          // console.log('respone INVIT= ', result);
          if (result === true) {
            this.private = true;
          }
          else {
            console.log('No invit Message');
          }
        }
      } catch(error) {
          console.error('Error cannot look my invitation', error);
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


  mounted () {
    this.fetchState();
    this.bus.on('refreshList', () => {this.fetchState()});
    // this.bus.on('InvitSend', () => {this.fetchInvit()});
  },

};
</script>

<style>
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

