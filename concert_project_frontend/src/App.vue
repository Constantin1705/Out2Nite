<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
// import { api } from 'boot/axios'

const authStore = useAuthStore()

// ✅ Check if token exists on page load
onMounted(async () => {
  await authStore.fetchUser()
})

</script>
