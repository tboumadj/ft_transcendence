<!-- Home.vue -->
<template>
  <div class="page-container">
    <h2>Welcome [ {{ profileData.pseudo }} ]</h2>
  </div>

    <div class="flex-container">
      <q-btn label="My info" color="primary" @click="card = true" />
      <q-dialog v-model="card">
        <q-card class="my-card">
        <!-- <q-img v-bind:src="profileData.avatar" /> -->
        <q-img :src="`${baseUrl}api/uploadAvatar/${profileData.avatar}`" :crossorigin="credentials ? 'use-credentials' : 'anonymous'"/>
        <!-- <q-img :src="`${profileData.avatar}`" /> -->


          <q-card-section>
            <q-btn
              fab
              color="primary"
              icon="build"
              class="absolute"
              style="top: 0; right: 10px; transform: translateY(-90%);"
              @click='promptav = true'/>
           <q-dialog v-model="promptav" >
            <q-card style="min-width: 350px">
              <q-card-section>

                <!-- <form @submit.prevent="submitForm"> -->
                <!--   <div class="q-pa-md"> -->
                <!--     <div class="q-gutter-y-md column" style="max-width: 300px"> -->
                <!--       <q-file color="primary" id="file" ref="fileInput" label="File" accept="image/*"> -->
                <!--   <template v-slot:prepend> -->
                <!--     <q-icon name="cloud_upload" /> -->

                <!--   </template> -->

                <!-- </q-file> -->
                <!-- </div> -->
                <!--   </div> -->

                <form @submit.prevent="submitForm">
                <label for="file">Download Avatar : </label>
                <input type="file" id="file" ref="fileInput" accept="image/*" />
                  -------------------------------------------<br />

                <label for="imageUrl">Url of Avatar : </label>
                  <input type="text" id="imageUrl" v-model="imageUrl" /><br />
                <button type="submit">Submit</button>
            </form>
              </q-card-section>
              </q-card>
            </q-dialog>
          ---------------------------------------------------<br />
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ profileData.pseudo }}
              <q-btn color="primary" icon="build" @click="prompt = true" />

<q-dialog v-model="prompt" >
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your new Pseudo</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="pseudo" autofocus @keyup.enter="updateP" />

        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat @click="updateP" label="Confirm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

            </div>
          </div>
            <div class="text-caption text-grey">
            Username: ( {{ profileData.username }} )
            </div>
            <!-- <div class="col-auto text-gry text-caption q-pt-md row no-wrap items-center"> -->
            <!--   <q-icon name="place" /> -->
            <!--   250ft -->
            <!-- </div> -->

          <!-- <q-rating v-model="stars" :max="5" size="32px" /> -->
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            {{ profileData.email }}
          </div>
        </q-card-section>
        <div class="q-pa-md">
          <q-toggle
            v-model="value"
            color="primary"
            keep-color
            @click="check2FA"
          />
           Activ 2FA
        </div>
        <q-separator />
        <q-card-actions align="right">
        <q-btn label="Change Password" color="primary" @click="prompt2 = true" />
        <!--   <q-btn v-close-popup flat color="primary" label="Reserve" /> -->
        <!--   <q-btn v-close-popup flat color="primary" round icon="event" /> -->
        </q-card-actions>
      </q-card>

<q-dialog v-model="prompt2" >
      <q-card style="min-width: 350px">

        <q-card-section>
          <div class="text-h6">Old Password</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="oldpassword" autofocus @keyup.enter="updateM" />
        </q-card-section>

        <q-card-section>
          <div class="text-h6">New Password</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newpassword" autofocus @keyup.enter="updateM" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat @click="updateM" label="Confirm" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    </q-dialog>


      <div class="button-container">
    <br /><br />
    <Button @click="logOutUser" class="custom-button">Log Out</Button>
  </div>
  </div>
  <div v-if="dataHist.id && dataHist.pseudo">
  <MyHistory :user="dataHist"/>
  </div>

  <Notification ref="notification" />
</template>

<script lang="ts">
import Notification from '../components/MyNotif.vue';
import MyHistory from '../components/MyHistory.vue'
import { ref, inject } from 'vue';

interface NotificationComponent {
  showNotification(message: string):void;
}

export default {
  setup() {
    return{
      card: ref(false),
      prompt: ref(false),
      prompt2: ref(false),
      promptav: ref(false),
      value: ref(false),

      pseudo: ref(''),
      oldpassword: ref(''),
      newpassword: ref(''),
      imageUrl: ref(''),
      bus: inject('bus'),
      //fileInput: ref(null),
    }
  },
  components: {
    Notification,
    MyHistory,
  },
  data() {
    return {
      profileData: {},
      dataHist: {},
      // baseUrl: process.env.NODE_ENV === 'production' ? 'http://localhost:3000/' : 'http://localhost:3000/',
      baseUrl: 'http://' + window.location.hostname + ':3000/',
      localIp: window.location.hostname,
    };
  },
  methods: {
    submitForm() {
      const fileInput = this.$refs.fileInput as HTMLInputElement;
      const file = fileInput.files?.[0];

      if (file) {
        this.uploadImage(file);
      }
      else if (this.imageUrl) {
        this.uploadImageUrl(this.imageUrl);
      }
      else {
        console.error('Pls Select a file or specify Url');
      }
    },

    async uploadImage(file: File):Promise<void> {
      const formData = new FormData();
      formData.append('image', file);
      const jwtToken = localStorage.getItem('jwtToken');
      //console.log('Avatar Path Is: ', file);
      try {
        const response = await fetch(`http://${this.localIp}:3000/api/update/UploadAvatar`, {
          method: 'POST',
          headers: {
            //'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${jwtToken}`,
          },
          //body: JSON.stringify({ formData })
          credentials: 'include',
          body: formData,
        });
        //console.log('response Avatar1: ', response);
        this.fetchProfileData();
        this.bus.emit('refreshProfile');
      } catch (error) {
        console.error('Error with Avatard upload : ', error);
      }
    },

    async uploadImageUrl(url: string):Promise<void> {
      try {
        //console.log('URL IS: ', url);
        const jwtToken = localStorage.getItem('jwtToken');
        const response = await fetch(`http://${this.localIp}:3000/api/update/UploadAvatarUrl`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({ imageUrl: url}),
        });
        //console.log('response AvatarUrl: ', response);
        this.fetchProfileData();
        this.bus.emit('refreshProfile');

      } catch (error) {
        console.error('error With AvatardUrl upload : ', error);
      }
    },

    async updateP() {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (this.pseudo === '') {
          const errorMess = ' : ERROR';
          (this.$refs.notification as NotificationComponent).showNotification('No one in Parameter for Pseudo' + errorMess);
          return ;
        }
        const response = await fetch(`http://${this.localIp}:3000/api/update/Name`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            pseudo: this.pseudo,
          }),
        });
        const resp = await response.json();

        //console.log('Response: ', resp);
        if (resp.pseudo) {
          //console.log('Pseudo has been updated'); //CHECK SI VIDE...
          this.fetchProfileData();
          this.bus.emit('refreshProfile');
        }
        else {
          console.log('Error with change Pseudo');
        }
      }
      catch(error) {
        console.error('Erreur lors du changement de pseudo', error);
      }
    },
    async updateM() {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (this.newpassword === '') {
          const errorMess = ' : ERROR';
          (this.$refs.notification as NotificationComponent).showNotification('No one in Parameter for NewPassword' + errorMess);
          return ;
        }
        const response = await fetch(`http://${this.localIp}:3000/api/update/Pass`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            testpass: this.oldpassword,
            password: this.newpassword,
          }),
        });
        const resp = await response.json();

        //console.log('Response: ', resp);
        if (resp.password) {
          console.log('Password has been updated');//NOTIF !!!!
          this.fetchProfileData();
        }
        else {
          console.log('Error with change Password');
        }
      }
      catch(error) {
        console.error('Erreur lors du changement de password', error);
      }
    },

    async checkToken() {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
        try {
          const response = await fetch(`http://${this.localIp}:3000/api/auth/checkJWT`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`,
            },
            credentials: 'include',
            //body: JSON.stringify({ token: jwtToken }),
          });
          const resp = await response.json();
          //console.log('responsecheck: ', resp);
          if (resp.success) {
            console.log('user validate!');
          }
          else {
            console.log('Unvalidate user!');
            this.logOutUser();
          }
        }
        catch (error) {
          console.log('Error with validating JWT!');
          this.logOutUser();
        }
      }
      else {
        console.log('User not connected!');
        this.$router.push('/');
      }
    },

    async logOutUser() {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
          const response = await fetch(`http://${this.localIp}:3000/api/update/disable2fa`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
              },
              credentials: 'include',
            });
          const result = await response.json();
          //console.log('result= ', result);
          this.bus.emit('inOffSet');
          localStorage.removeItem('jwtToken');
          console.log('User disconnect : Jwt deleted!');
          this.$router.push('/');
        }
      } catch (error) {
        console.log('error with disconnect User');
      }
    },

    async check2FA() {
      let res = false;
      const test = this.value;
      if (this.profileData.twoFactorAuth === true) {
        //console.log('TESTTTTTT;', this.value);
        res = await this.checkValid2fa(this.profileData.id);
        //console.log('res = ',res);
        if (res === false) {
          this.value = true;
          return ;
        }
      }
          const jwtToken = localStorage.getItem('jwtToken');
          //console.log('jwtTest: ', jwtToken);
          if (jwtToken) {
        const responseData = await fetch(`http://${this.localIp}:3000/api/update/checkTwoF`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
              },
              credentials: 'include',
              body: JSON.stringify({
                value: test,
              }),
            });
            const dataP = await responseData.json();
            //console.log('response is: ', dataP);
        this.fetchProfileData();
            if (dataP.value2f === true && dataP.valid2f === false) {
              this.goTo2fa(dataP.userId);
            }
          }
    },


    async checkValid2fa(userId: any) {
      //console.log('checkValid2fa userId: ', userId);
      // let windowObjectReference: Window | null = null;

      // const width = 300;
      // const height = 300;
      // const left = (window.screen.width - width) / 2;
      // const top = (window.screen.height - height) / 2;

     // window.addEventListener('message', async () => {

          const userProvidedCode = window.prompt('Veuillez entrer le code à vérifier', '');

          if (userProvidedCode !== null) {
            //console.log('Code fourni par l\'utilisateur :', userProvidedCode);
            return (await this.verify2faCode(userId, userProvidedCode));
          } else {
            console.log('L\'utilisateur a annulé la saisie du code');
            return false;
          }
     // });
    },


    async verify2faCode(userId: any, userProvidedCode: string) {
      try {
        const response = await fetch(`http://${this.localIp}:3000/api/auth/verify2fa?userId=${userId}&code=${userProvidedCode}`);
        const result = await response.json();

        if (result.success) {
          console.log('Le code 2FA est valide.');
          return true;
        } else {
          console.log('Le code 2FA est invalide.');
          return false;
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du code 2FA :', error);
        return false;
      }
    },

    async goTo2fa(userId: any) {

      const width = 600
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      try {
        //console.log('goto2fa');
        const response = await fetch(`http://${this.localIp}:3000/api/auth/2FAdir?userId=${userId}`);
        const result = await response.json();
        //console.log('result= ', result);
        const uri = result.uri;
        //console.log('uri redir: ', uri);

        const qrWindow = window.open(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(uri)}&size=150x150`, 'QR Window', `width=${width}, height=${height}, left=${left}, top=${top}`);
        if (qrWindow) {
          qrWindow.onload = () => {
            console.log('Generate QrCode');
          };
        }
      } catch (error) {
        console.error('cannot go to 2fa');
      }

    },


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
          this.dataHist = {id: this.profileData.id, pseudo: this.profileData.pseudo};
          //console.log('ProfuleData', this.profileData);
          //console.log('2FA = ', this.profileData.twoFactorAuth);
          //console.log('2FAvalidate = ', this.profileData.twofvalidated);
          this.value = this.profileData.twoFactorAuth;
      }
      }
      catch (error) {
        console.log('error');
      }
  },
  },
  mounted () {

    this.checkToken();
    this.fetchProfileData();
    this.bus.emit('inOnSet');
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

.button-container {
  display: flex;
  margin-top: 20px;
}

.custom-button {
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
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
