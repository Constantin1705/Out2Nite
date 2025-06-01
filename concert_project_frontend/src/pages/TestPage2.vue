<template>
  <q-page class="q-pa-md">
    <q-form @submit.prevent="onRegister">
      <q-input v-model="form.email" label="Email" type="email" />
      <q-input v-model="form.password" label="Password" type="password" />

      <q-btn label="Register" type="submit" color="primary" />
    </q-form>

    <!-- Mood Dialog -->
    <q-dialog v-model="showMoodDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">How are you feeling today?</div>
          <q-option-group
            v-model="mood"
            :options="moodOptions"
            type="radio"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Continue" @click="submitMood" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const form = ref({
  email: '',
  password: '',
})

const showMoodDialog = ref(false)
const mood = ref<string | null>(null)

const moodOptions = [
  { label: 'Happy 😊', value: 'happy' },
  { label: 'Sad 😢', value: 'sad' },
  { label: 'Excited 🎉', value: 'excited' },
  { label: 'Angry 😡', value: 'angry' },
]

function onRegister() {
  // You can validate the form here before showing mood pop-up
  showMoodDialog.value = true
}

function submitMood() {
  console.log('User mood:', mood.value)
  showMoodDialog.value = false

  // You could now submit full form + mood to backend
}
</script>
