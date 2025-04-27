<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg" style="min-width: 300px;">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="username" label="Username" filled />
        <q-input v-model="password" label="Password" type="password" filled class="q-mt-sm" />
      </q-card-section>
      <q-card-actions align="between">
        <q-btn label="Register" flat color="primary" @click="router.push('/register')" />
        <q-btn label="Login" color="primary" @click="login" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  await authStore.login(username.value, password.value)
  if (authStore.accessToken) {
    await router.push('/map')
  }
}


// onMounted(() => {
//   if (authStore.accessToken) {
//     router.push('/map')
//   }
// })
</script>
