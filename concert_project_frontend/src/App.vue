<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { api } from 'boot/axios'

const authStore = useAuthStore()

// ✅ Check if token exists on page load
onMounted(async () => {
  const token = localStorage.getItem('access_token')
  if (token) {
    authStore.accessToken = token
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    await authStore.fetchUser()  // ✅ Await properly
  }
})

</script>
