<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import maplibregl from 'maplibre-gl';
import type { MapOptions } from 'maplibre-gl';

const mapContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!mapContainer.value) return;

  const mapOptions: MapOptions = {
    container: mapContainer.value,
    style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=8uUaM9x3BwGHN9bhSEbz',
    center: [6.5665, 53.2194], // Groningen
    zoom: 17.5,
    pitch: 60,
    bearing: -45
  };

  const map = new maplibregl.Map(mapOptions);
  map.addControl(new maplibregl.NavigationControl());

  map.on('load', () => {
    map.addLayer({
      id: '3d-buildings',
      source: 'buildings',
      'source-layer': 'building',
      filter: ['==', 'class', 'building'],
      type: 'fill-extrusion',
      minzoom: 15,
      paint: {
        'fill-extrusion-color': '#FFD700', // warm light color
        'fill-extrusion-height': ['get', 'render_height'],
        'fill-extrusion-base': ['get', 'render_min_height'],
        'fill-extrusion-opacity': 0.9
      }
    });

    map.addLayer({
      id: 'clubs',
      type: 'circle',
      source: 'openmaptiles',
      'source-layer': 'poi',
      filter: ['==', 'class', 'nightclub'],
      paint: {
        'circle-radius': 6,
        'circle-color': '#ff69b4'
      }
    });
  });
});
</script>

<template>
  <q-page class="q-pa-md">
    <div ref="mapContainer" style="width: 100%; height: 100vh;" />
  </q-page>
</template>

<style scoped>
@import 'https://unpkg.com/maplibre-gl@3.3.1/dist/maplibre-gl.css';
</style>
