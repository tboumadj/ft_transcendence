- MyChat.vue -->
<template>

<div class='WAL position-relative bg' :style='style'>
    <q-layout view='lHh Lpr lFf' class='WAL__layout shadow-3 bg-grey-2' container>
      <q-header elevated>
        <q-toolbar class='bg-grey-3 text-black'>
          <q-btn
            round
            flat
            icon='keyboard_arrow_left'
            class='WAL__drawer-open q-mr-sm'
            @click='toggleLeftDrawer'
          />
          <template v-if="currentConversation != undefined">
            <q-btn round flat>
              <q-avatar>
                {{ currentConversation.displayName.charAt(0).toUpperCase() }}
              </q-avatar>
            </q-btn>

            <span class='q-subtitle-1 q-pl-md'>
              {{ currentConversation.displayName }}
            </span>
          </template>

          <q-space/>

          <q-btn round flat icon='more_vert'>
            <q-menu auto-close :offset='[110, 0]'>
              <q-list style='min-width: 150px'>
                <q-item clickable>
                  <q-item-section @click="leaveChannel" >Leave Channel</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section @click="channelModify" >Modify Channel</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Block</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Silence</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model='leftDrawerOpen'
        show-if-above
        bordered
        :breakpoint='690'
      >
        <q-toolbar class='bg-grey-3'>
          <q-avatar class='cursor-pointer'>
            <img src='https://cdn.quasar.dev/logo-v2/svg/logo.svg' />
          </q-avatar>

          <q-space />

          <q-btn round flat icon='more_vert'>
            <q-menu auto-close :offset='[110, 8]'>
              <q-list style='min-width: 150px'>
                <q-item clickable>
                  <q-item-section @click="newChannel">New Channel</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section @click="channelSearch">Join Channel</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn
            round
            flat
            icon='close'
            class='WAL__drawer-close'
            @click='toggleLeftDrawer'
          />

        </q-toolbar>


        <q-scroll-area style='height: calc(100% - 100px)'>
          <q-list>
            <q-item
              v-for='(chan, index) in channels'
              :key='chan.id'
              clickable
              v-ripple
              @click='setCurrentConversation(index)'
            >
              <q-item-section avatar>
                <q-avatar>
                  {{ chan.displayName.charAt(0)}}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines='1'>
                  {{ chan.displayName }}
                </q-item-label>
              </q-item-section>

            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class='bg-grey-2'>
          <q-chat-message
            v-for="(message, index) in messages"
            :key="index"
            :name="currentUser(message.sender)!.pseudo"
          :avatar="`${baseUrl}api/uploadAvatar/` + currentUser(message.sender)!.avatar"
            :text="[message.content]"
            :sent="currentUser(message.sender)!.id === user.id"
            @click="toggleMenu(index, currentUser(message.sender)!.id === user.id)"
          />
            <!-- Conditional rendering of menu -->
        </q-page-container>

      <q-footer>
        <q-toolbar class='bg-grey-3 text-black row'>
          <q-input rounded outlined dense class='WAL__field col-grow q-mr-sm' bg-color='white' v-model='message' placeholder='Type a message' @keydown.enter.prevent="postMessage" />
        </q-toolbar>
      </q-footer>

    </q-layout>

  </div>

</template>

<script lang='ts'>
import { useQuasar } from 'quasar'
import { ref, computed, inject } from 'vue'
import io, { Socket } from 'socket.io-client';
import { useRoute } from 'vue-router';
import MyDialog from '../components/MyDialog.vue';
import SelfAvatarDialog from '../components/SelfAvatarDialog.vue'
import AvatarDialog from '../components/AvatarDialog.vue'


interface UserInterface {
  id: number,
  username: string,
  pseudo: string,
  avatar: string,
}

interface channelInterface {
  id: number,
  channel_name: string,
  displayName: string,
  password: string,
  private_groupe: boolean,
  private_message: boolean,
  members: number[],
  users: UserInterface[],
  admin: number[]

}
interface msg {
  id: number;
  content: string,
  sender: number,
  receiver: number,
  when: Date,
}
interface userDto {
  username: string,
  id: number,
}

    let private_frind_id = ref();
    let private_owner = ref();
    let user = ref(<userDto>{});
    let channels = ref(<channelInterface[]>[]);
    let selectedChannel : channelInterface;
    let messages = ref(<msg[]>[]);
    let message = ref('');
    let selectMessageContent: msg;
    let socket: Socket;

    async function receiveChannel(dto: channelInterface, status: string ) {
      switch (status) {
        case 'CREATE':
          getMsg(dto);
          channels.value.push(dto);
          channels.value = channels.value;
          break;
        case 'PRIVATE':
          dto.users =[];
          const users = dto.channel_name.split('$');
          if (users[1] == user.value.username)
          dto.displayName = users[2];
          else
          dto.displayName = users[1];
          getMsg(dto);
          channels.value.push(dto);
          channels.value = channels.value;
          socket.emit('message', JSON.stringify({
            channel_name: dto.channel_name
          }));
          break;
        case 'MODIFY':
          let mychannel : channelInterface = channels.value[0];
          channels.value.forEach(element => {
            if (element.id == dto.id)
            mychannel = element;
          })
          channels.value[channels.value.indexOf(mychannel)] = dto;
          break;
        case 'DELETE':
          channels.value.forEach(element => {
            if (element.id == dto.id) {
              channels.value.splice(channels.value.indexOf(element), 1);
              channels.value = channels.value;
              messages.value = [];
              return ;
            }
          })
          break;
        default:
          break;
      }
    }

    async function createChannel(nameChannel: string, passChannel: string) {
        if (!nameChannel) {
          alert('BadInput');
          return ;
        }
        socket.emit('channel', JSON.stringify({
          event: 'CREATE',
          channel_name: nameChannel,
          password: passChannel,
          private_groupe: passChannel ? true : false,
          private_message: false,
        }))
        socket.emit('channel', JSON.stringify({event: 'GET'}));
    }

    async function joinChannel(nameChannel: string, passChannel: string) {
        if (!nameChannel) {
          alert("BadInput");
          return ;
        }
        socket.emit("event", JSON.stringify({
          channel_name: nameChannel,
          event: "JOIN",
          password: passChannel,
        }));
      }


    function receiveMessage(dto: msg, status: string) {
      const id = selectedChannel.id;
      if (dto.receiver == id) {
        switch (status) {
          case 'MODIFY':
            messages.value.forEach(element => {
              if (element.id == dto.id) {
                messages.value.splice(messages.value.indexOf(element), 1);
                return ;
              }
            });
            messages.value = [...messages.value, dto];
            break ;
          case 'CREATE':
            messages.value = [...messages.value, dto];
            break ;
          case 'DELETE':
            messages.value.forEach(element => {
              if (element.id == dto.id) {
                messages.value.splice(messages.value.indexOf(element), 1);
              }
            });
            break ;
          default:
            alert(dto);
            return ;
        }
        messages.value = messages.value;
      }
    }

    async function ft_get(link : string) {
      const response = await fetch(link, {
        method: 'GET',
        headers: {
          //'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        //body: JSON.stringify({ formData })
        credentials: 'include',
      })
      return response.json();
    }


    async function ft_fetch(link : string, method: string, body: any) {
      let response = await fetch(link, {
        method: method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: body ? body: "",
      })
      if ( +response.headers.get("content-length")! > 0){
            return response.json();
      }
    }

    async function getInfo() {
      const localN = window.location.hostname;
      user.value = await ft_get(`http://${localN}:3000/api/auth/profile`);
      // console.log("USER", user.value);
      socket.emit('channel', JSON.stringify({event: 'GET'}));

    //PRIVATE FONC
      if (private_frind_id.value) {
        if(private_owner.value === 'yes') {
        // console.log("TESTCREATE");
        createChannel('private'+private_frind_id.value, 'private');

        //Fetch For Invit for friend
        const body = JSON.stringify({frind_id: private_frind_id.value});
        await ft_fetch(`http://${localN}:3000/api/update/InvMess`, 'POST', body);
        await ft_get(`http://${localN}:3000/api/update/ResMess`);
    } else if (private_owner.value === 'no') {

        // console.log("TESTJOIN");
        // createChannel(private_frind_id.value, private_owner.value);

        //Fetch For Invit for friend
        let res = await ft_get(`http://${localN}:3000/api/update/ResMess`);
        joinChannel('private'+res.id, 'private');
    }
    //reset For double
        private_frind_id = ref(null);
        private_owner = ref(null);
      }
    //END Private
    }


    async function getMsg(channel : channelInterface) {
      if (!channel) {
        return;
      }
      const localN = window.location.hostname;
      const body = JSON.stringify({channel_name: channel.channel_name});
  let groupeUsers = await ft_fetch(`http://${localN}:3000/api/chat/users`, 'POST', body);
      selectedChannel.users = groupeUsers;
  messages.value = await ft_fetch(`http://${localN}:3000/api/chat/messages`, 'POST', body);
    }

    async function receiveEvent(dto: channelInterface, status: string ) {
        switch (status) {
          case 'JOIN':
            for (let i = 0; i < channels.value.length; i++) {
              if (channels.value[i].id == dto.id) {
                channels.value[i].members = dto.members;
                getMsg(dto);
                return ;
              }
            }
            channels.value.push(dto);
            getMsg(dto);
            break;
          case 'LEFT':
            for (let i = 0; i < channels.value.length; i++) {
              if (channels.value[i].id == dto.id) {
                if (!dto.members.includes(user.value.id)) {
                  channels.value.splice(i , 1);
                  messages.value = [];
                }
                else
                 channels.value[i].members = dto.members;
              }
            }
            break;
          case 'KICK':
            for (let i = 0; i < channels.value.length; i++) {
              if (channels.value[i].id == dto.id) {
                if (!dto.members.includes(user.value.id)) {
                  channels.value.splice(i , 1);
                  messages.value = [];
                }
                else
                  channels.value[i].members = dto.members;
              }
            }
            break;
          case 'BAN':
            for (let i = 0; i < channels.value.length; i++) {
              if (channels.value[i].id == dto.id) {
                if (!dto.members.includes(user.value.id)) {
                  channels.value.splice(i , 1);
                  messages.value = [];
                }
                else
                  channels.value[i].members = dto.members;
              }
            }
            break;
          case 'PROMOTE':
            for (let i = 0; i < channels.value.length; i++) {
              if (channels.value[i].id == dto.id) {
                channels.value[i].admin = dto.admin;
              }
            }
            break;
          case 'UNPROMOTE':
            for (let i = 0; i < channels.value.length; i++) {
              if (channels.value[i].id == dto.id) {
                channels.value[i].admin = dto.admin;
              }
            }
            break;
          default:
            break;
        }
        channels.value = channels.value;
      }
    function currentUser(id: number) {
      // console.log("chan", selectedChannel);
      return selectedChannel.users.find( x => x.id === id)
    }


export default {
  name: 'WhatsappLayout',
  setup () {

    const route = useRoute();
    let frind_id = route.query.frind_id;
    let owner = route.query.owner;
    const $q = useQuasar()

    const leftDrawerOpen = ref(false)
    const search = ref('')
    const message = ref('')
    const currentConversationIndex = ref(0)
    const showMenu = ref(Array(messages.value.length).fill(false));

    function toggleMenu(index:number, state:boolean) {
      showMenu.value[index] = !showMenu.value[index];
      selectMessageContent = messages.value[index];
      if (state) {
        selfAvatar();
      } else {
        Avatar();
      }
    }


    const currentConversation = computed(() => {
      selectedChannel = channels.value[currentConversationIndex.value]
      getMsg(selectedChannel);

      if (frind_id) {
        if (owner === 'yes') {
          // console.log("TEST-> CREATECHANEL");
          private_frind_id.value = frind_id;
          private_owner.value = owner;
          // console.log("TEST-> frind_id= ", private_frind_id.value);
          // console.log("TEST-> owner= ", private_owner.value);

          //reset pour pas double appel
          frind_id = null;
          owner = null;
        } else if(owner === 'no') {
          // console.log("TEST-> JOINCHANEL");
          private_frind_id.value = frind_id;
          private_owner.value = owner;
          // console.log("TEST-> frind_id= ", private_frind_id.value);
          // console.log("TEST-> owner= ", private_owner.value);

          //reset pour pas double appel
          frind_id = null;
          owner = null;
        }
      }

      return channels.value[ currentConversationIndex.value ]
    })

    async function ban() {
        socket.emit("event", JSON.stringify({
          username: currentUser(selectMessageContent.sender)!.pseudo.slice(0, -2),
          channel_name: selectedChannel.channel_name,
          event: "BAN",
        }));
      }
      async function unban() {
        socket.emit("event", JSON.stringify({
          username: currentUser(selectMessageContent.sender)!.pseudo.slice(0, -2),
          channel_name: selectedChannel.channel_name,
          event: "UNBAN",
        }));
      }
      async function promote() {
        socket.emit("event", JSON.stringify({
          username: currentUser(selectMessageContent.sender)!.pseudo.slice(0, -2),
          channel_name: selectedChannel.channel_name,
          event: "PROMOTE",
        }));
      }
      async function unpromote() {
        socket.emit("event", JSON.stringify({
          username: currentUser(selectMessageContent.sender)!.pseudo.slice(0, -2),
          channel_name: selectedChannel.channel_name,
          event: "UNPROMOTE",
        }));
      }
    async function modifyMessage(messageContent: string) {
        if (!messageContent ) {
          alert("BadInput");
          return ;
        }
        console.log("modifyMessage");
        socket.emit("message", JSON.stringify({
          content: messageContent,
          channel_name: selectedChannel.channel_name,
          id: selectMessageContent.id,
        }));
      }
    async function deleteMessage() {
        console.log("deleteMessage");
        socket.emit("message", JSON.stringify({
          content: "",
          channel_name: selectedChannel.channel_name,
          id: selectMessageContent.id,
        }));
      }

    const style = computed(() => ({
      height: $q.screen.height - 123 + 'px'
    }))

    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    function setCurrentConversation (index: number) {
      currentConversationIndex.value = index
      selectedChannel = channels.value[currentConversationIndex.value]
    }

    async function postMessage() {
        if (!message.value) {
          return ;
        }
        socket.emit("message", JSON.stringify({
          content: message.value,
          channel_name: channels.value[currentConversationIndex.value].channel_name,
          id: "",
        }));

        message.value = '';
    }

    function newChannel() {
          $q.dialog({
        component: MyDialog,
        componentProps: {
          title: 'New Channel',
          message: 'Title',
          channel: '',
          password: '',
          prompt: {
            model: '',
            isValid: (val:string) => val.length > 2, // << here is the magic
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
      }
        }).onOk(data => {
          createChannel(data.nameChannel, data.passChannel);
        })
    }

    function selfAvatar() {
          $q.dialog({
        component: SelfAvatarDialog,
        componentProps: {
          title: 'Message Option',
          message: 'Title',
          prompt: {
            model: '',
            isValid: (val:string) => val.length > 2, // << here is the magic
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
      }
        }).onOk(data => {
          // createChannel(data.nameChannel, data.passChannel);
          if (data.delete) {
            deleteMessage();
          } else if (data.modifyMessage != '') {
            modifyMessage(data.modifyMessage);
          }

        })
    }

    function Avatar() {
          $q.dialog({
        component: AvatarDialog,
        componentProps: {
          title: 'Message Option',
          message: 'Title',
          prompt: {
            model: '',
            isValid: (val:string) => val.length > 2, // << here is the magic
            type: 'text' // optional
          },
          cancel: true,
          persistent: true,
          selectedChannel,
          user,
          selectMessageContent,

      }
      }).onOk(data => {
          if (data.value == 'promote') {
            promote();
          } else if ( data.value == 'unpromote') {
            unpromote();
          } else if ( data.value == 'ban') {
            console.log('ban')
            ban();
          }
        })
    }

    function leaveChannel() {
      if (user.value.id == channels.value[currentConversationIndex.value].admin[0]) {
        socket.emit("channel", JSON.stringify({
              event: "DELETE",
              id: channels.value[currentConversationIndex.value].id,
		}))
      } else {
      socket.emit("event", JSON.stringify({
          channel_name: selectedChannel.channel_name,
          event: "LEFT",
        }));
      }

    }

    async function modifyChannel(nameChannel: string, passChannel: string) {
        if (!nameChannel) {
          alert("BadInput");
          return ;
        }
        const id = channels.value[currentConversationIndex.value].id;
        socket.emit("channel", JSON.stringify({
          id: id,
          event: "MODIFY",
          channel_name: nameChannel,
          password: passChannel,
        }))
      }

    function channelModify() {
          $q.dialog({
        component: MyDialog,
        componentProps: {
          title: 'Modify Channel',
          message: 'Title',
          channel: '',
          password: '',
          prompt: {
            model: '',
            isValid: (val:string) => val.length > 2, // << here is the magic
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
      }
        }).onOk(data => {
          modifyChannel(data.nameChannel, data.passChannel);
        })
    }
    function channelSearch() {
          $q.dialog({
        component: MyDialog,
        componentProps: {
          title: 'Join Channel',
          message: 'Title',
          channel: '',
          password: '',
          prompt: {
            model: '',
            isValid: (val:string) => val.length > 2, // << here is the magic
            type: 'text' // optional
          },
          cancel: true,
          persistent: true
      }
        }).onOk(data => {
          joinChannel(data.nameChannel, data.passChannel);
        })
    }

    function currentUser(id: number) {
      let user = selectedChannel?.users.find( x => x.id === id)
      if (!user) { return {avatar:'avatardefault.jpg', pseudo:'banned', id: 0}}
      else
        return user;
    }

    return {
      leftDrawerOpen,
      search,
      message,
      messages,
      currentConversationIndex,
      selectedChannel,

      channels,

      newChannel,

      channelSearch,
      channelModify,
      leaveChannel,
      // openDialog,

      postMessage,

      currentConversation,
      currentUser,
      setCurrentConversation,
      style,
      user,

      route,
      // queryParams,
      frind_id,
      owner,
      private_frind_id,
      private_owner,

      toggleLeftDrawer,
      showMenu,
      toggleMenu,

      ban,
      promote,
      unpromote,
    }
  },

  components: {
  },
 data() {
    return {
    bus: inject('bus'),
    baseUrl: 'http://' + window.location.hostname + ':3000/',
    localIp: window.location.hostname,
    };
  },
  methods: {
    // dialogCustom() {
    //   this.openDialog();
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
          // console.log('responsecheck: ', resp);
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

    async WsConnect() {
      socket = io( `http://${this.localIp}:3000/chat`, {
        extraHeaders: {
          'cookies': localStorage.getItem('jwtToken')!,
        }

      });

    },


  },
  mounted() {
    this.checkToken();
    this.WsConnect();
    this.bus.emit('inChatSet');
    getMsg(channels.value[0]);

    socket.on('message', (response) => {
		console.log('Message reçu du serveur:', response);
      if (!response.data || response.status == 'ok'){
			return ;
      }
		if (response.status == 'ERROR')
			alert(response.data);
		else
			receiveMessage(response.data, response.status);
	});

    socket.on('channel', (response) => {
		console.log('Channel reçu du serveur:', response);
		if (!response.data)
			return ;
		if (response.status == 'ERROR')
			alert(response.data)
		else if (response.status == 'GET') {
			const grps: channelInterface[] = response.data;
			for (let i = 0; i < grps.length; i++) {
				socket.emit('message', JSON.stringify({
					channel_name: grps[i].channel_name
				}));
			}
			channels.value = grps;
      selectedChannel = channels.value[0];
		}
		else
			receiveChannel(response.data, response.status);
	})

  socket.on('event', (response) => {
		console.log('Event reçu du serveur:', response);
		if (!response.data)
			return ;
		if (response.status == 'ERROR')
			alert(response.data)
		else
			receiveEvent(response.data, response.status);
	})

    getInfo();

  },
  beforeUnmount() {
  socket.disconnect();
  },
};
</script>


<style lang='sass'>
.WAL
  width: 90%
  height: 100%
  padding-top: 20px
  padding-bottom: 20px


  &__layout
    margin: 0 auto
    height: 100%
    width: 90%
    max-width: 70%
    border-radius: 5px

  &__field.q-field--outlined .q-field__control:before
    border: none

.q-drawer--standard
.WAL__drawer-close
  display: none

@media (max-width: 850px)
.WAL
  padding: 0
  &__layout
  width: 100%
  border-radius: 0

@media (min-width: 691px)
.WAL
  &__drawer-open
    display: none

.conversation__summary
  margin-top: 4px

.conversation__more
  margin-top: 0!important
  font-size: 1.4rem
  body
  background-color: #229964
  margin: 0

.page-container
  border: 5px solid #000
  border-left-width: 0px
  border-right-width: 0px
  padding: 5px
  background-color: #fff
  text-align: center

.flex-container
  display: flex
  flex-direction: column
  align-items: center
  text-align: center


.button-container
  display: flex
  margin-top: 20px


.custom-button
  padding: 10px 20px
  background-color: #000
  color: #fff
  border: none
  border-radius: 5px
  cursor: pointer
  transition: background-color 0.3s ease


.custom-button:hover
  background-color: #2980b9


.button-container Button:first-child
  margin-right: 50px

.bg
  background-color: #229964
  height: 90vh

</style>
