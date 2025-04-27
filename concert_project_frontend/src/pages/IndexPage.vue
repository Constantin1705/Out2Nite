<template>
  <q-page class="q-pa-none">
    <!-- 🌙 Background section -->
    <div
      class="flex flex-center column"
      style="height: 100vh; background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); color: white; text-align: center;"
    >

      <!-- 🎉 Animated Title -->
      <div class="text-h2 q-mt-xl animate__animated animate__fadeInDown">
        Out2Nite
      </div>

      <!-- 🎵 Animated Description -->
      <div class="text-subtitle1 q-mt-md q-mb-xl animate__animated animate__fadeInUp">
        Discover Groningen's nightlife: concerts, parties, meetups, and hidden gems tonight!
      </div>

      <!-- 🎈 Animated Button -->
      <q-btn
        label="Discover Map"
        color="primary"
        size="lg"
        unelevated
        rounded
        to="/map"
        class="q-mt-md q-px-xl animate__animated animate__fadeInUp animate__delay-1s"
      />

    </div>
  </q-page>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* Import Animate.css properly */
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
</style>
