<template>
  <q-layout view="hHh lpR fFf">
    <!-- Top Navigation Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>

        <!-- App Title -->
        <q-btn flat dense no-caps to="/" class="q-mr-sm text-white">
          <q-toolbar-title>Out2Nite</q-toolbar-title>
        </q-btn>

        <q-space />

        <!-- Authenticated / Guest Actions -->
        <div class="row items-center q-gutter-sm">
          <template v-if="authStore.user">
            <q-btn flat label="Map" to="/map" />
            <q-btn flat label="Logout" @click="handleLogout" />
            <!-- 🔥 This is your hamburger/drawer trigger -->
            <q-btn flat round dense icon="menu" show-if-above :disable="drawerTransitioning" @click="showDrawer = !showDrawer" />
          </template>

          <template v-else>
            <q-btn flat label="Login" to="/login" />
            <q-btn flat label="Register" to="/register" />
          </template>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Router View -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Profile Drawer (Right) -->
    <q-drawer
      v-model="showDrawer"
      side="right"
      overlay
      behavior="mobile"
      :width="280"
    >
      <q-scroll-area class="fit q-pa-md">
        <q-card flat>

          <!-- Profile Avatar and Info -->
          <q-card-section class="q-pa-none q-mb-md">
            <q-avatar size="80px" class="q-mx-auto q-mb-sm">
              <img :src="authStore.user?.profile_picture_url || 'https://cdn.quasar.dev/img/avatar.png'" />
            </q-avatar>
            <div class="text-center text-h6">
              {{ authStore.user?.nickname || authStore.user?.username }}
            </div>
            <div class="text-center text-subtitle2 text-grey">
              {{ authStore.user?.email }}
            </div>
          </q-card-section>

          <q-separator />

          <!-- Genres and Mood -->
          <q-card-section>
            <div class="text-bold q-mb-xs">Favorite Genres</div>
            <q-chip
              v-for="genre in authStore.user?.favorite_genres || []"
              :key="genre.id"
              class="q-mr-xs q-mb-xs"
            >
              {{ genre.name }}
            </q-chip>

            <div class="text-bold q-mt-md">Mood for Tonight</div>
            <q-badge outline class="q-mt-xs">
              {{ authStore.user?.mood_for_tonight?.name || 'None' }}
            </q-badge>
          </q-card-section>
        </q-card>
      </q-scroll-area>
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const showDrawer = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  await router.push('/')
  showDrawer.value = false
}
const drawerTransitioning = ref(false)
watch(showDrawer, () => {
  drawerTransitioning.value = true
  setTimeout(() => (drawerTransitioning.value = false), 300) // adjust to match Quasar's transition
})
</script>
