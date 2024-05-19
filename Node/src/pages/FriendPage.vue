<!-- FriendPage.vue -->
<template>
  <div class="page-container">
    <h2>{{ profileData.pseudo }}</h2>
  </div>

  <div class="flex-container">
    <q-btn label="Info" color="primary" @click="card = true" />
    <q-dialog v-model="card">
      <q-card class="my-card">
        <q-img :src="`${baseUrl}api/uploadAvatar/${profileData.avatar}`" :crossorigin="credentials ? 'use-credentials' : 'anonymous'"/>

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            {{ profileData.pseudo }}
          </div>
        </div>
        <div class="text-caption text-grey">
          Username: ( {{ profileData.username }} )
        </div>
        <q-separator />
        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            {{ profileData.email }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- <div class="button-container"> -->
    <!--   <Button class="custom-button" @click="sendMatch" >Invite match</Button> -->
    <!--   <Button class="custom-button">Message Him</Button> -->
    <!-- </div> -->
  </div>

  <div class="flex-container2">
    <div class="button-container">
      <q-btn v-if='friend === true' label="Delete" color="negative" @click="deleteFriend" />
      <q-btn v-else label="Add" color="primary" @click="addFriend" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, inject, provide } from 'vue';
import { useRoute } from 'vue-router';
// import { emitFriendListUpdatedKey } from '../components/MyFriendList.vue';
// import checkFriendList from '../components/MyFriendList.vue';

export default {
  setup() {
    const route = useRoute();
    const friendId = ref(route.params.id);
    const card = ref(false);
    const profileData = ref({});
    const friend = ref(false);
    const bus = inject('bus');


  //   const emitFriendListUpdated = inject(emitFriendListUpdatedKey);


  // const emitFriendUpdated = () => {
  //     provide('friendUpdated', () => {
  //       // Déclencher l'événement personnalisé après avoir ajouté ou supprimé un ami
  //       if (emitFriendListUpdated) {
  //         emitFriendListUpdated();
  //       }
  //     });
  //   };


    const fetchProfilePublic = async () => {
      try {
        // console.log('baseUrl = ', window.location);
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
          const responseData = await fetch(`http://${window.location.hostname}:3000/api/auth/profile/friend?userId=${friendId.value}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
            credentials: 'include',
          });
          const dataP = await responseData.json();
          profileData.value = dataP;

          // if (emitFriendListUpdated) {
          //   emitFriendUpdated();
          // }
          //console.log('ProfileFriend= ', profileData);
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    const addFriend = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
          const response = await fetch(`http://${window.location.hostname}:3000/api/update/addFriend`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              friend: friendId.value,
            }),
          });
          const result = await response.json();
          //console.log('result = ', result);
          if (result.success == true) {
            console.log('FRIEND FOR LIFE');
            friend.value = true;
            bus.emit('freshFriend');
          } else {
            console.log('NOT FRIEND FOR LIFE');
          }
        }
      } catch (error) {
        console.error('BUG WITH ADDING FRIEND', error);
      }
    };

    const deleteFriend = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
          const response = await fetch(`http://${window.location.hostname}:3000/api/update/deleteFriend`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              friend: friendId.value,
            }),
          });
          const result = await response.json();
          //console.log('result = ', result);
          if (result.success == true) {
            console.log('FRIEND DELETED');
            friend.value = false;
            bus.emit('freshFriend');
          } else {
            console.log('FRIEND Not DELETE');
          }
        }
      } catch (error) {
        console.error('BUG WITH DELETING FRIEND', error);
      }
    };

    // const areWeFriend = async () => {
    const areWeFriend = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        //console.log('jwtTest: ', jwtToken);
        if (jwtToken) {
          const responseData = await fetch(`http://${window.location.hostname}:3000/api/auth/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
            credentials: 'include',
          });
          const dataP = await responseData.json();
          //console.log("Myprofile", dataP);

          const result = dataP.friends.includes(+friendId.value);
          if (result === true) {
            //console.log('JESUISLLAAAA');
            friend.value = true;
          }
          console.log('friendvalue', friend.value);
      }
      }
      catch (error) {
        console.log('error');
      }
  };

    onMounted(() => {
      fetchProfilePublic();
      areWeFriend();
      bus.emit('inOnSet');
    });

    return {
      friendId,
      card,
      profileData,
      addFriend,
      deleteFriend,
      areWeFriend,
      friend,
    };
  },
  data() {
    return {
      // route2: useRoute(),
      message: '000000',
      // baseUrl: process.env.NODE_ENV === 'production' ? 'http://localhost:3000/' : 'http://localhost:3000/',
      baseUrl: 'http://' + window.location.hostname + ':3000/',
      localIp: window.location.hostname,
    };
  },
  // methods: {

  //   async sendMatch() {
  //     try {
  //       console.log('Sending invitation');
  //       const owner = 'yes';
  //       const frind_id = this.route2.params.id;
  //       const accept = 'no';
  //       // console.log('query before = ', owner, "friend = ", frind_id, "accept = ", accept);
  //       this.$router.push({path: 'game', query: {owner, frind_id, accept} });
  //       // this.$router.push({name: 'Game', query: {owner, frind_id, accept} });
  //     } catch (error) {
  //       console.error('Cannot send Invitation to match with this friend', error);
  //     }
  //   },
  // },
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
  align-items: center;
  text-align: center;
}

.flex-container2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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
  border-radius: 25px;
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
