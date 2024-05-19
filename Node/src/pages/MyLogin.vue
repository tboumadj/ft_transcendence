<!-- Login.vue -->
<template>
  <div class="page-container">
    <h2>Login</h2>
  </div>
  <br /><br />
    <div class="flex-container">
  <form @submit.prevent="handleLogin" class="form-container">
    <label>Login:</label>
    <input v-model="name" required />
    <label>Password:</label>
    <input v-model="password" type="password" required />
      <div class="button-container">
        <button type="submit" class="custom-button">sign in</button>
      </div>
  </form>
        <button @click="goTo42" class="custom-button">auth42</button>
    </div>
<Notification ref="notification" />
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import Notification from '../components/MyNotif.vue';

interface NotificationComponent {
  showNotification(message: string): void;
}

export default defineComponent({
  name: 'MyLogin',
  data() {
    return {
      name: '',
      password: '',
      bus: inject('bus'),
      localIp: window.location.hostname,
    };
  },
  components: {
    Notification,
  },
  methods: {

    async goToDispatch(data: any) {
      if (data.type === '42auth-success') {
          //console.log(data);
          //localStorage.setItem('user', data.user);
          localStorage.setItem('jwtToken', data.jwt);

          this.$router.push({ path: '/home' });
        }
        else if (data.type === '42auth-false') {
          //console.log('checkELSE: ', data);
          //localStorage.setItem('user', data.user);
          const userId = data.user;
          //console.log('USERID: ', userId);
          this.checkValid2fa(userId, true);
        }
    },

  async goTo42() {
      let windowObjectReference: Window | null = null;

      const width = 600
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      window.addEventListener('message', async event => {
        //if (event.origin !== window.origin) return;
        //console.log('LOGDATA: ', event.data);
        if (event.data) {
          if (windowObjectReference) {
            windowObjectReference.close();
            windowObjectReference = null;
          }
          this.goToDispatch(event.data);
        }
        // if (event.data.type === '42auth-success') {
        //   console.log(event.data);
        //   localStorage.setItem('user', event.data.user);
        //   localStorage.setItem('jwtToken', event.data.jwt);

        //   if (windowObjectReference) {
        //     windowObjectReference.close();
        //     windowObjectReference = null;
        //   }
        //   this.$router.push({ path: '/home' });
        // }
        // else if (event.data.type === '42auth-false') {
        //   console.log('checkELSE: ', event.data);

        //   localStorage.setItem('user', event.data.user);
        //   if (windowObjectReference) {
        //     windowObjectReference.close();
        //     windowObjectReference = null;
        //   }
        //   const userId = event.data.user;
        //   console.log('USERID: ', userId);
        //   this.checkValid2fa(userId, true);
        // }
      });
      windowObjectReference = window.open(
        `http://${this.localIp}:3000/api/auth/42login`,
        '42 auth',
        `width=${width}, height=${height}, left=${left}, top=${top}`
      )!;
    },


    async checkValid2fa(userId: any, user42: boolean) {

          const userProvidedCode = window.prompt('Veuillez entrer le code à vérifier', '');

          if (userProvidedCode !== null) {
            //console.log('Code fourni par l\'utilisateur :', userProvidedCode);
            this.verify2faCode(userId, userProvidedCode, user42);
          } else {
            console.log('L\'utilisateur a annulé la saisie du code');
          }
     // });
    },


    async verify2faCode(userId: any, userProvidedCode: string, user42: boolean) {
      try {
        const response = await fetch(`http://${this.localIp}:3000/api/auth/verify2fa?userId=${userId}&code=${userProvidedCode}`);
        const result = await response.json();

        if (result.success) {
          console.log('Le code 2FA est valide.');
          if (user42 == false) {
            this.handleLogin();
          }
          if (user42 == true) {
            this.loginAfter2fa(userId);
          }
        } else {
          console.log('Le code 2FA est invalide.');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du code 2FA :', error);
      }
    },

    async loginAfter2fa(userId: any) {
      try {
        const response = await fetch(`http://${this.localIp}:3000/api/auth/trustlogin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            userId: userId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          localStorage.setItem('jwtToken', result.token);
          //console.log('response1: ', result.success);
          //console.log('jwtToken1: ', result.token);
          this.$router.push({ path: '/home' });
        } else {
          //console.log('response2: ', result.success);
          //console.log('userId: ', result.userId);
          //console.error('Échec de la connexion:', result.message);
          (this.$refs.notification as NotificationComponent).showNotification('Échec de la connexion : ' + result.message);
          //this.goTo2fa(responseData.userId);
          this.checkValid2fa(result.userId, true);
        }
      } catch (error) {
        console.error('erreur with trust login');
      }
    },

async handleLogin() {
      try {
        const response = await fetch(`http://${this.localIp}:3000/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: this.name,
            password: this.password,
            //requestDetails: {
            //  customeHeader: 'logintest',
            //},
          }),
        });

        const responseData = await response.json();

        if (responseData.success) {
          localStorage.setItem('jwtToken', responseData.token);
          //console.log('response1: ', responseData.success);
          //console.log('jwtToken1: ', responseData.token);
          this.$router.push({ path: '/home' });
        } else {
          //console.log('response2: ', responseData.success);
          //console.log('userId: ', responseData.userId);
          //console.error('Échec de la connexion:', responseData.message);
          if(responseData === false) {
            (this.$refs.notification as NotificationComponent).showNotification('Échec de la connexion : ' + responseData.message);
          //this.goTo2fa(responseData.userId);
          this.checkValid2fa(responseData.userId, false);
        } else {
          (this.$refs.notification as NotificationComponent).showNotification('Échec de la connexion : User not found');
        }
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        (this.$refs.notification as NotificationComponent).showNotification('Échec de la connexion : ' + error);
      }
    },
  },


  mounted () {
    this.bus.emit('logOut');
  },

});
</script>

<style>
body {
  background-color: #229964;
  margin: 0;
}

.form-container {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 5px;
}

.form-container label {
  text-align: right;
  padding-right: 5px;
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
