<!-- Home.vue -->
<template>
  <div class="page-container">
    <h2>{{ message }}</h2>
  </div>
  <div class="flex-container">
    <div class="button-container">
      <Button @click="redirectToLogin" class="custom-button">Login</Button>
      <Button @click="redirectToSign" class="custom-button">Sign up</Button>
      </div>
    </div>
</template>

<script>
//import Button from './MyButton.vue';
//import { useRouter } from 'vue-router';
import { inject } from 'vue';

export default {
  components: {
   // Button
  },
  data() {
    return {
      message: 'Welcome to T.R.I.S Pong.',
      bus: inject('bus'),
      localIp: window.location.hostname,
    };
  },
  methods: {
    redirectToLogin() {
      this.$router.push('/login');
    },
    redirectToSign() {
      this.$router.push('/inscription');
    },
    eraseToken() {
      localStorage.removeItem('jwtToken');
    },

    // async fetchLocalIp() {
    //   this.localIp = window.location.hostname;
    //   // console.log('LocalIp: ', this.localIp);
    // },

    async logOutUser() {
      try {
        // console.log('LocalIP: ', window.location);
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
          //localStorage.removeItem('jwtToken');
          this.bus.emit('inOffSet');
          this.eraseToken();
          console.log('User disconnect : Jwt deleted!');
          //this.$router.push('/');
        }
      } catch (error) {
        console.log('error with disconnect User');
      }
    },

  },
  mounted() {
    // this.fetchLocalIp();
    this.logOutUser();
    this.bus.on('logOut', this.logOutUser);
    //this.eraseToken();
  },
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
