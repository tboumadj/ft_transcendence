<!-- FriendsList.vue -->
<template>
  <div>
    <!-- <q-btn -->
    <!--   fab -->
    <!--   color="primary" -->
    <!--   icon="sync" -->
    <!--   class="absolute" -->
    <!--   style="top: 10; right: 5px; transform: translateY(-20%);" -->
    <!--   @click='checkFriendList()' /> -->
    <h5 style="margin-bottom: 10px; text-align: center;">Friends List</h5>
    <hr style="border: 1px solid #ccc; margin-bottom: 1px;">
    <ul>
      <!-- <li v-for="friend in friends" :key="friend.id">{{ friend.name }}</li> -->
      <!-- <List v-for="friend in friends" :key="friend.id" :friend="friend" /> -->
      <List v-for="user in userArray" :key="user.id" :user="user" />
    </ul>
    <hr style="border: 1px solid #ccc; margin-bottom: 1px;">


    <q-input standout bottom-slots v-model="text" label="Search User" :dense="dense" @keyup.enter="checkForAdd">
        <template v-slot:before>
        </template>

        <template v-slot:append>
          <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer"></q-icon>
          <q-icon name="search" class="cursor-pointer" @click="checkForAdd"></q-icon>

        </template>

      </q-input>


  </div>

  <div v-if="Object.keys(Search).length !== 0">
  <!-- <div v-if="Search !== null"> -->
    <div>
    <hr style="border: 1px solid #ccc; margin-bottom: 1px;">
    <ul>
      <!-- <li v-for="friend in friends" :key="friend.id">{{ friend.name }}</li> -->
        <Friends :key="Search.id" :search_data="Search"/>
    </ul>
    <hr style="border: 1px solid #ccc; margin-bottom: 1px;">
  </div>
  </div>
  <Notification ref="notificationRef" />
</template>



<script lang="ts">
import Notification from '../components/MyNotif.vue';
import Friends from '../components/MyFriends.vue';
import List from '../components/MyList.vue';
import { ref , onMounted , InjectionKey, provide, inject } from 'vue';

interface NotificationComponent {
  showNotification(message: string): void;
};

interface UserInfo {
  id: number,
  username: string,
  pseudo: string,
  avatar: string,
};

// export const emitFriendListUpdatedKey: InjectionKey<() => void> = Symbol('emitFriendListUpdated');

export default {
  components: {
    Friends,
    List,
    Notification,
  },
  setup() {
    const userArray = ref(<UserInfo[]>[]);
    const text = ref('');
    const dense = ref(true);
    var Search = ref({});
    const notificationRef = ref<NotificationComponent | null>(null);

    const bus = inject('bus');
    // const listenFriendUpdated = () => {
    //   const friendUpdated = inject<() => void>(emitFriendListUpdatedKey);
    //   console.log('testssssss');

    //   if (friendUpdated) {
    //     console.log('tessttt2222');
    //     provide(emitFriendListUpdatedKey, () => {
    //       console.log('ttessstt3333');
    //       friendUpdated();
    //     });
    //   }
    // };

    const checkForAdd = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
          const response = await fetch(`http://${window.location.hostname}:3000/api/update/searchUser` ,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              friend_search: text.value,
            }),
          });
          text.value = '';
          const result = await response.json();
          //console.log('ResultADDING= ', result);
          if (result.success === true) {
            //console.log('Friend is:', result.userFriend);
            Search.value = result.userFriend;
          } else {
            //console.log('notif!');
            notificationRef.value?.showNotification(result.success + ' : ' + result.message);
          }
        }
      } catch (error) {
        console.error('Error crash with fetchData');
      }
    };

    const checkFriendList = async () => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
          const response = await fetch(`http://${window.location.hostname}:3000/api/auth/profile/friendlist`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          credentials: 'include',
        });
        const result = await response.json();
        //console.log('friendlist= ', result);

          userArray.value = result;
        //console.log('userinfolist= ', userArray);
      }
    } catch (error) {
      console.error('error with friendlist');
    }
  };

 //    const deleteFriend = async () => {
 //      try {
 //        const jwtToken = localStorage.getItem('jwtToken');
 //        if (jwtToken) {
 //          const response = await fetch('http://localhost:3000/api/update/deleteFriend', {
 //            method: 'PUT',
 //            headers: {
 //              'Content-Type': 'application/json',
 //              'Authorization': `Bearer ${jwtToken}`,
 //            },
 //            credentials: 'include',
 //            body: JSON.stringify({
 //              friend: friendId.value,
 //            }),
 //          });
 //          const result = await response.json();
 //          //console.log('result = ', result);
 //          if (result.success == true) {
 //            console.log('FRIEND DELETED');
 //          } else {
 //            console.log('FRIEND Not DELETE');
 //          }
 //        }
 //      } catch (error) {
 //        console.error('BUG WITH DELETING FRIEND', error);
 //      }
 //    };


 // const addFriend = async () => {
 //      try {
 //        const jwtToken = localStorage.getItem('jwtToken');
 //        if (jwtToken) {
 //          const response = await fetch('http://localhost:3000/api/update/addFriend', {
 //            method: 'PUT',
 //            headers: {
 //              'Content-Type': 'application/json',
 //              'Authorization': `Bearer ${jwtToken}`,
 //            },
 //            credentials: 'include',
 //            body: JSON.stringify({
 //              friend: friendId.value,
 //            }),
 //          });
 //          const result = await response.json();
 //          //console.log('result = ', result);
 //          if (result.success == true) {
 //            console.log('FRIEND FOR LIFE');
 //          } else {
 //            console.log('NOT FRIEND FOR LIFE');
 //          }
 //        }
 //      } catch (error) {
 //        console.error('BUG WITH ADDING FRIEND', error);
 //      }
 //    };


    onMounted(() => {
    checkFriendList();
      bus.on('freshFriend', () => {
        checkFriendList();
        Search.value = {};
      })
    });


    // const listenFriendUpdated = () => {
    //   const friendUpdated = inject<() => void>(emitFriendListUpdatedKey);
    //   if (friendUpdated) {
    //     provide(emitFriendListUpdatedKey, checkFriendList);
    //   }
    // };

    // listenFriendUpdated();


return {
      text,
      dense,
      Search,
      userArray,
      checkForAdd,
      notificationRef,
      checkFriendList,
      // deleteFriend,
      // addFriend
    };
},
};
</script>
