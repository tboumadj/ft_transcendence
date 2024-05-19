<!-- Notification.vue -->
<template>
  <div v-if="isVisible" class="notification-container">
    {{ message }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      message: '',
    };
  },
  methods: {
    showNotification(message) {
      this.message = message;
      this.isVisible = true;

      setTimeout(() => {
        this.isVisible = false;
      }, 5000);
    },
  },
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 120px;
  left: 79%;
  transform: translateX(-50%);
  background-color: #e74c3c;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  z-index: 999;
}
</style>
