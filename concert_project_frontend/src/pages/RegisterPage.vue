<template>
  <q-page class="q-pa-md">
    <q-stepper v-model="step" flat animated color="primary">

      <!-- Step 1: Email & Password -->
      <q-step :name="1" title="Account Info" icon="email">
        <q-form @submit.prevent="goToNextStep">
          <q-input v-model="form.email" label="Email" type="email" @blur="checkEmail" :error="emailChecked && !emailAvailable" error-message="Email already in use" />
          <q-input
            v-model="form.password"
            :type="isPasswordVisible ? 'text' : 'password'"
            label="Password"
            class="q-mt-md"
            filled
            lazy-rules
            :rules="passwordRules"
          >
            <template #append>
              <q-icon
                :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </q-input>
          <div class="text-right q-mt-md">
            <q-btn label="Next" type="submit" color="primary" :disable="!form.email || !form.password || (emailChecked && !emailAvailable)" />
          </div>
        </q-form>
      </q-step>

      <!-- Step 2: Username & Personal Info -->
      <q-step :name="2" title="Profile Info" icon="person">
        <q-form @submit.prevent="goToNextStep">
          <q-input v-model="form.username" label="Username" @blur="checkUsername" :error="usernameChecked && !usernameAvailable" error-message="Username already taken" />
          <q-input v-model="form.nickname" label="Display Name (Optional)" />
          <q-input v-model="form.birth_date" label="Birth Date" mask="####-##-##" hint="YYYY-MM-DD" @blur="validateAge" :error="underage" error-message="Must be 18+" />
          <div class="text-right q-mt-md">
            <q-btn label="Back" flat @click="step--" />
            <q-btn label="Next" type="submit" color="primary" class="q-ml-sm" :disable="!form.username || (usernameChecked && !usernameAvailable) || underage" />
          </div>
        </q-form>
      </q-step>

      <!-- Step 3: Mood & Favorite Genres -->
      <q-step :name="3" title="Preferences" icon="mood">
        <q-form @submit.prevent="goToNextStep">
          <q-select v-model="form.mood_for_tonight" :options="moods" label="Your Mood Tonight" option-label="name" option-value="id" />
          <q-select v-model="form.favorite_genres" :options="genres" label="Favorite Genres" multiple option-label="name" option-value="id" class="q-mt-md" />
          <div class="text-right q-mt-md">
            <q-btn label="Back" flat @click="step--" />
            <q-btn label="Next" type="submit" color="primary" class="q-ml-sm" />
          </div>
        </q-form>
      </q-step>

      <!-- Step 4: Profile Picture -->
      <q-step :name="4" title="Profile Picture" icon="image">
        <q-form @submit.prevent="checkBeforeSubmit">
          <div class="row q-col-gutter-md q-mb-md">
            <q-img
              v-for="(avatar, index) in defaultAvatars"
              :key="index"
              :src="avatar.src"
              :alt="avatar.alt"
              :class="['cursor-pointer', 'avatar-option', form.profile_picture === avatar.src ? 'selected-avatar' : '']"
              style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid transparent"
              @click="selectDefaultAvatar(avatar.src)"
            />
          </div>
          <div class="q-mt-md">
            <q-uploader label="Or upload your own" :auto-upload="false" @added="onFileSelected" />
          </div>
          <div class="text-right q-mt-md">
            <q-btn label="Back" flat @click="step--" />
            <q-btn label="Register" type="submit" color="primary" class="q-ml-sm" :loading="loading" :disable="loading" />
          </div>
        </q-form>
      </q-step>

    </q-stepper>
  </q-page>
</template>

<style scoped>
.selected-avatar {
  border-color: #1976d2 !important;
  box-shadow: 0 0 8px #1976d2;
}
.avatar-option:hover {
  transform: scale(1.05);
  transition: transform 0.2s;
}
</style>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()
const step = ref(1)
const loading = ref(false)

const emailAvailable = ref(true)
const usernameAvailable = ref(true)
const emailChecked = ref(false)
const usernameChecked = ref(false)
const underage = ref(false)
const isUsingDefaultAvatar = ref(false)
const isPasswordVisible = ref(false)
const moods = ref([])
const genres = ref([])

const form = ref<{
  email: string
  password: string
  username: string
  nickname: string
  birth_date: string
  mood_for_tonight: number | null
  favorite_genres: number[]
  profile_picture: File | string | null
}>({
  email: '',
  password: '',
  username: '',
  nickname: '',
  birth_date: '',
  mood_for_tonight: null,
  favorite_genres: [],
  profile_picture: null
})

const defaultAvatars = [
  { src: 'https://cdn.quasar.dev/img/avatar2.jpg', alt: 'Boy Avatar' },
  { src: 'https://cdn.quasar.dev/img/avatar4.jpg', alt: 'Girl Avatar' }
]

function checkEmail(): Promise<void> {
  return api.post('/api/auth/check-email/', { email: form.value.email })
    .then(res => {
      emailAvailable.value = res.data.available
      emailChecked.value = true
    })
    .catch(() => {
      emailAvailable.value = false
      emailChecked.value = true
    })
}

function checkUsername(): Promise<void> {
  return api.post('/api/auth/check-username/', { username: form.value.username })
    .then(res => {
      usernameAvailable.value = res.data.available
      usernameChecked.value = true
    })
    .catch(() => {
      usernameAvailable.value = false
      usernameChecked.value = true
    })
}

function validateAge() {
  const birth = new Date(form.value.birth_date)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  underage.value = age < 18
}

function onFileSelected(files: readonly File[]) {
  if (files.length && files[0] !== undefined) {
    form.value.profile_picture = files[0]
    isUsingDefaultAvatar.value = false
  }
}

function selectDefaultAvatar(url: string) {
  form.value.profile_picture = url
  isUsingDefaultAvatar.value = true
}

function goToNextStep() {
  step.value++
}

async function checkBeforeSubmit() {
  if (loading.value) return
  loading.value = true
  await checkEmail()
  await checkUsername()
  if (!emailAvailable.value) {
    alert('Email is already in use')
    loading.value = false
    return
  }
  if (!usernameAvailable.value) {
    alert('Username is already in use')
    loading.value = false
    return
  }
  await submitForm()
}

async function submitForm() {
  const payload = new FormData()

  payload.append('email', form.value.email)
  payload.append('username', form.value.username)
  payload.append('password', form.value.password)
  payload.append('nickname', form.value.nickname)
  payload.append('birth_date', form.value.birth_date)

  if (form.value.mood_for_tonight) {
    payload.append('mood_for_tonight', form.value.mood_for_tonight.toString())
  }

  form.value.favorite_genres.forEach((genreId: number) => {
    payload.append('favorite_genres', genreId.toString())
  })

  if (form.value.profile_picture) {
    if (isUsingDefaultAvatar.value) {
      payload.append('profile_picture_url', form.value.profile_picture)
    } else {
      payload.append('profile_picture', form.value.profile_picture)
    }
  }

  try {
    await api.post('/api/auth/register/', payload)
    await router.push({ path: '/map' })
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 8 || 'Minimum 8 characters',
  (val: string) => /[A-Z]/.test(val) || 'At least one uppercase letter',
  (val: string) => /[0-9]/.test(val) || 'At least one number',
  (val: string) => /[^A-Za-z0-9]/.test(val) || 'At least one special character'
]

onMounted(async () => {
  moods.value = (await api.get('/api/moods/')).data
  genres.value = (await api.get('/api/genres/')).data
})
</script>
