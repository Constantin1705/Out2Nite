<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense no-caps to="/" class="q-mr-sm text-white">
          <q-toolbar-title>
            Out2Nite
          </q-toolbar-title>
        </q-btn>

        <q-space />

        <!-- 🔥 Auth Buttons -->
        <div class="row items-center q-gutter-sm">
          <template v-if="authStore.user">
            <q-btn
              flat
              label="Map"
              to="/map"
            />
            <q-btn
              flat
              label="Logout"
              @click="handleLogout"
            />
          </template>

          <template v-else>
            <q-btn
              flat
              label="Login"
              to="/login"
            />
            <q-btn
              flat
              label="Register"
              to="/register"
            />
          </template>
        </div>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async() => {
  authStore.logout()
  await router.push('/')
}
</script>
