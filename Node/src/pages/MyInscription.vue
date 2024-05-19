!-- MyUser.vue -->
<template>
  <div class="page-container">
    <h2>Register</h2>
  </div>
  <br /><br />
    <div class="flex-container">
    <form @submit.prevent="handleSubmit" class="form-container">
      <label>Login:</label>
      <input v-model="name" required />
      <label>Password:</label>
      <input v-model="password" type="password" required />
      <label>Email:</label>
      <input v-model="email" required />
    <div class="button-container">
      <button type="submit" class="custom-button">Sign up</button>
    </div>
    </form>
  </div>
<Notification ref="notification" />
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import Notification from '../components//MyNotif.vue';

interface NotificationComponent {
  showNotification(message: string): void;
}

export default defineComponent({
  name: 'MyInscription',
  data() {
    return {
      name: '',
      password: '',
      email: '',
      bus: inject('bus'),
      localIp: window.location.hostname,
    };
  },
  components: {
    Notification,
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await fetch(`http://${this.localIp}:3000/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.name,
            password: this.password,
            email: this.email,
          }),
        });

        const responseData = await response.json();

        //console.log('Réponse du backend:', responseData);
        if (responseData.statusCode != 500) {
          const responseauth = await fetch(`http://${this.localIp}:3000/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              name: this.name,
              password: this.password,
            }),
          });

          const responseDataAuth = await responseauth.json();

          if (responseDataAuth.success){
            localStorage.setItem('jwtToken', responseDataAuth.token);
            //console.log('Reponse du backendAuth:', responseDataAuth);
            //console.log('Reponse du backendAuth:', responseDataAuth.success);
            //console.log('Reponse du backendAuth:', responseDataAuth.token);
            this.$router.push({ path: '/home' });
          } else {
            //console.log('response error: ', responseDataAuth);
            //console.log('response error: ', responseDataAuth.success);
            //console.log('response error: ', responseDataAuth.token);
            (this.$refs.notification as NotificationComponent).showNotification('Error : ' + responseDataAuth.message);
          }
        }
        else {
          (this.$refs.notification as NotificationComponent).showNotification('User already Use : ' + responseData.message);
        }
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        (this.$refs.notification as NotificationComponent).showNotification('Error : ' + error);
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
