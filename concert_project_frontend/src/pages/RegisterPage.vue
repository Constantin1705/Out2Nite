<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="q-pa-lg" style="min-width: 300px;">
      <q-card-section>
        <div class="text-h6">Register</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="username" label="Username" filled />
        <q-input v-model="email" label="Email" filled class="q-mt-sm" />
        <q-input v-model="password" label="Password" type="password" filled class="q-mt-sm" />
      </q-card-section>

      <q-card-actions align="around">
        <q-btn label="Login" flat color="primary" @click="goToLogin" />
        <q-btn label="Register" color="primary" @click="register" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    await api.post('api/auth/register/', {
      username: username.value,
      email: email.value,
      password: password.value
    })
    await router.push('/login')
  } catch (err) {
    console.error('Registration failed', err)
  }
}

const goToLogin = async () => {
  await router.push('/login')
}
</script>
