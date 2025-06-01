<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Activities</h2>

    <!-- Filters -->
    <div class="mb-4">
      <input v-model="filters.city" placeholder="Filter by city" class="border p-2 rounded mr-2" />
      <select v-model="filters.genre" class="border p-2 rounded mr-2">
        <option value="">All Genres</option>
        <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
      </select>
      <select v-model="filters.event_type" class="border p-2 rounded">
        <option value="">All Event Types</option>
        <option v-for="e in eventTypes" :key="e.id" :value="e.id">{{ e.name }}</option>
      </select>
      <button @click="applyFilters" class="ml-2 bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
    </div>

    <!-- Loading and empty states -->
    <div v-if="loading">Loading...</div>
    <div v-else-if="!activities || activities.length === 0">No activities found.</div>

    <!-- Activities List -->
    <div v-else>
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="p-4 border mb-2 rounded shadow-sm"
      >
        <h3 class="text-xl font-semibold">{{ activity.name }}</h3>

        <!-- Image preview -->
        <div v-if="activity.image" class="my-2">
          <img :src="activity.image" alt="Activity Image" class="max-w-xs rounded shadow" />
        </div>

        <p v-if="activity.description">{{ activity.description }}</p>
        <p><strong>City:</strong> {{ activity.city || 'N/A' }}</p>
        <p><strong>Type:</strong> {{ activity.type?.name || 'N/A' }}</p>
        <p><strong>Type Color:</strong> {{ activity.type?.color?.name || 'N/A' }}</p>
        <p><strong>Genre:</strong> {{ activity.genre?.name || 'N/A' }}</p>
        <p><strong>Event Type:</strong> {{ activity.event_type?.name || 'N/A' }}</p>
        <p><strong>Price:</strong> {{ activity.price_category?.name || 'N/A' }}</p>

        <p v-if="activity.website">
          <strong>Website:</strong>
          <a :href="activity.website" target="_blank" class="text-blue-500 underline">
            {{ activity.website }}
          </a>
        </p>
        <p v-if="activity.address"><strong>Address:</strong> {{ activity.address }}</p>
        <p v-if="activity.phone"><strong>Phone:</strong> {{ activity.phone }}</p>
        <p v-if="activity.email"><strong>Email:</strong> {{ activity.email }}</p>
        <p v-if="activity.music">
          <strong>Music:</strong>
          <a :href="activity.music" target="_blank" class="text-blue-500 underline">Listen</a>
        </p>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-between mt-4">
        <button
          :disabled="page === 1"
          @click="prevPage"
          class="bg-gray-200 px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          :disabled="!hasNext"
          @click="nextPage"
          class="bg-gray-200 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Activity {
  id: number
  name: string
  description: string
  city: string | null
  image: string | null
  type: {
    id: number
    name: string
    color: {
      id: number
      name: string
    }
  } | null
  genre: { id: number; name: string } | null
  event_type: { id: number; name: string } | null
  price_category: { id: number; name: string } | null
  website: string | null
  address: string | null
  phone: string | null
  email: string | null
  music: string | null
}

const activities = ref<Activity[]>([])
const genres = ref<{ id: number; name: string }[]>([])
const eventTypes = ref<{ id: number; name: string }[]>([])
const loading = ref(false)

const page = ref(1)
const pageSize = 10
const hasNext = ref(false)

const filters = ref({
  city: '',
  genre: '',
  event_type: '',
})

const fetchFilters = async () => {
  try {
    const [genreRes, eventTypeRes] = await Promise.all([
      axios.get('/api/genres/'),
      axios.get('/api/event-types/')
    ])
    genres.value = genreRes.data
    eventTypes.value = eventTypeRes.data
  } catch (err) {
    console.error('Error loading filters:', err)
  }
}

const fetchActivities = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/api/activities/', {
      params: {
        page: page.value,
        page_size: pageSize,
        ...filters.value,
      },
    })
    activities.value = Array.isArray(data.results) ? data.results : []
    hasNext.value = !!data.next
  } catch (err) {
    console.error('Error fetching activities:', err)
    activities.value = []
  } finally {
    loading.value = false
  }
}

const applyFilters = async () => {
  page.value = 1
  await fetchActivities()
}

const nextPage = async () => {
  page.value++
  await fetchActivities()
}

const prevPage = async () => {
  if (page.value > 1) {
    page.value--
    await fetchActivities()
  }
}

onMounted(async () => {
  await fetchFilters()
  await fetchActivities()
})
</script>
