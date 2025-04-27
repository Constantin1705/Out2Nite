<template>
  <q-page class="q-pa-none">
    <div id="map" style="height: 100vh; position: relative;">

      <!-- Search Bar -->
      <div class="search-bar animated-fade-in">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            placeholder="What are you looking for tonight?"
            class="search-input"
            @keyup.enter="searchActivity"
          />
        </div>

        <div class="suggestions">
          <button @click="selectSuggestion('Concert')">🎵 Concerts</button>
          <button @click="selectSuggestion('Bars')">🍻 Bars</button>
          <button @click="selectSuggestion('Events')">🎉 Events</button>
          <button @click="selectSuggestion('Meetups')">🤝 Meetups</button>
        </div>
      </div>

      <!-- Bottom Panel -->
      <div v-if="activeEvent" class="bottom-panel animated-slide-up">
        <h3>{{ activeEvent.name }}</h3>
        <p>🎶 {{ activeEvent.event_type_name || 'Event' }} | 🔥 {{ activeEvent.live ? 'Live' : 'Offline' }} | 🎉 {{ activeEvent.mood }}</p>
        <p>📍 {{ activeEvent.address }}, {{ activeEvent.city }}</p>
      </div>

      <!-- Recenter Button -->
      <q-btn
        icon="my_location"
        class="recenter-button"
        @click="recenterToUser"
      >
        <div class="pulse-dot"></div>
      </q-btn>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { api } from 'boot/axios'

type Activity = {
  id: number
  name: string
  latitude: number
  longitude: number
  description: string
  live: boolean
  broadcasted_live: string
  event: string
  mood: string
  type_name: string
  type_color: string
  type_color_description: string
  genre_name: string
  event_type_name: string
  price_category_name: string
  website: string
  address: string
  city: string
  phone: string
  email: string
  music: string
}

const activities = ref<Activity[]>([])
const activeEvent = ref<Activity | null>(null)
const searchQuery = ref('')
const mapInstance = ref<L.Map | null>(null)

const selectSuggestion = (value: string) => {
  searchQuery.value = value
  searchActivity()
}

const searchActivity = () => {
  if (!searchQuery.value.trim()) {
    return
  }

  const found = activities.value.find(a =>
    a.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  if (found && mapInstance.value) {
    const latLng = L.latLng(found.latitude, found.longitude)

  const popup = L.popup({
  className: 'animated-popup'
})
  .setLatLng(latLng)
  .setContent(`<strong>${found.name}</strong>`)

  // ✅ Now safe
  popup.addTo(mapInstance.value as L.Map)
  mapInstance.value.setView(latLng, 16)
  } else {
    alert('No results found.')
  }
}

const loadActivities = async () => {
  try {
    const response = await api.get('/api/activities/')
    activities.value = response.data
  } catch (error) {
    console.error('Error loading activities:', error)
  }
}

// Recenter to user location
const recenterToUser = () => {
  if (mapInstance.value) {
    mapInstance.value.locate({ setView: true, maxZoom: 16 })
  }
}

onMounted(async () => {
  const map = L.map('map').setView([53.2194, 6.5665], 13)
  mapInstance.value = map

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map)

  await loadActivities()

  activities.value.forEach((activity: Activity) => {
    if (activity.latitude && activity.longitude) {
      const marker = L.marker(
        [activity.latitude, activity.longitude],
        {
          icon: activity.type_color_description
            ? L.icon({
                iconUrl: activity.type_color_description,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
                shadowSize: [41, 41]
              })
            : L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-blue.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
                shadowSize: [41, 41]
              })
        }
      ).addTo(map)

      marker.on('click', (e) => {
        e.originalEvent.stopPropagation()
        activeEvent.value = activity
      })
    }
  })

  map.locate({ setView: true, maxZoom: 16 })

  map.on('locationfound', (e) => {
    const pulsatingIcon = L.divIcon({
      className: 'pulsating-marker',
      iconSize: [20, 20]
    })

    L.marker(e.latlng, { icon: pulsatingIcon })
      .addTo(map)
      .bindPopup('📍 You are here!')
      .openPopup()

    L.circle(e.latlng, {
      radius: e.accuracy,
      color: '#3388ff',
      weight: 2,
      fillOpacity: 0.1
    }).addTo(map)
  })

  map.on('click', () => {
    activeEvent.value = null
  })
})
</script>

<style scoped>
/* Search Bar */
.search-bar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
  text-align: center;
}
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}
.search-icon {
  position: absolute;
  left: 15px;
  font-size: 18px;
}
.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border-radius: 25px;
  border: none;
  background: transparent;
  font-size: 16px;
  outline: none;
}
.suggestions {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}
.suggestions button {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}
.suggestions button:hover {
  background: rgba(255, 255, 255, 1);
}
.animated-fade-in {
  animation: fadeIn 0.8s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.bottom-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #222;
  color: white;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  text-align: center;
  animation: slideUp 0.4s ease;
  z-index: 999;
}
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Pulsating marker (for user location) */
.pulsating-marker {
  width: 20px;
  height: 20px;
  background: rgba(0, 136, 255, 0.7);
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(0, 136, 255, 0.7);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 1; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(0.8); opacity: 0; }
}

/* Popup small animation */
.animated-popup {
  animation: popupFade 0.5s ease;
}
@keyframes popupFade {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Recenter Button Style */
.recenter-button {
  position: absolute;
  bottom: 80px;
  right: 20px;
  z-index: 1000;
  background: white;
  color: #1976D2;
  border-radius: 50%;
  padding: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

/* Dot inside recenter button */
.pulse-dot {
  width: 10px;
  height: 10px;
  background: #1976D2;
  border-radius: 50%;
  animation: pulseDot 1.5s infinite;
  margin: auto;
}
@keyframes pulseDot {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
