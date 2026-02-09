<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Map, MapRoute, MapMarker, MarkerContent, useMap } from '~~/registry/map'
import { Clock, Route } from 'lucide-vue-next'
import maplibregl from 'maplibre-gl'

const { map, isLoaded } = useMap()
const selectedRoute = ref(0)

// Amsterdam to Rotterdam - Route 1 (Fastest via A4)
const route1: [number, number][] = [
  [4.9, 52.37],      // Amsterdam
  [4.85, 52.28],     // Between
  [4.75, 52.15],     // Between
  [4.65, 52.05],     // Between
  [4.55, 51.98],     // Between
  [4.48, 51.92],     // Rotterdam
]

// Amsterdam to Rotterdam - Route 2 (Alternative via A2)
const route2: [number, number][] = [
  [4.9, 52.37],      // Amsterdam
  [4.92, 52.25],     // South
  [5.0, 52.15],      // East
  [4.9, 52.05],      // Southeast
  [4.7, 52.0],       // South
  [4.6, 51.95],      // Southwest
  [4.48, 51.92],     // Rotterdam
]

const routes = [
  { 
    duration: 4140, // 69 minutes in seconds
    distance: 80200, // 80.2 km in meters
    geometry: route1,
    isFastest: true 
  },
  { 
    duration: 4560, // 76 minutes
    distance: 81000, // 81 km
    geometry: route2,
    isFastest: false 
  },
]

// Format duration from seconds to hours/minutes
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

// Format distance from meters to km
function formatDistance(meters: number): string {
  return `${(meters / 1000).toFixed(1)} km`
}

// Fit map to show routes when loaded
onMounted(() => {
  // Wait for map to be ready
  if (isLoaded.value && map.value) {
    fitBounds()
  } else {
    const unwatch = watch(() => isLoaded.value, (loaded) => {
      if (loaded && map.value) {
        fitBounds()
        unwatch()
      }
    })
  }
})

function fitBounds() {
  if (!map.value) return
  
  try {
    // Create bounds and extend with origin and destination
    const bounds = new maplibregl.LngLatBounds()
    bounds.extend([4.9, 52.37])    // Amsterdam
    bounds.extend([4.48, 51.92])   // Rotterdam
    map.value.fitBounds(bounds, { padding: 80 })
  } catch (e) {
    console.error('Error fitting bounds:', e)
  }
}
</script>

<template>
  <div class="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur rounded-lg shadow-lg border p-3 space-y-2 min-w-[200px]">
    <div class="space-y-2">
      <button
        v-for="(route, index) in routes"
        :key="index"
        @click="selectedRoute = index"
        class="w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors"
        :class="selectedRoute === index ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50 border border-transparent'"
      >
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <Clock class="size-4 text-muted-foreground" />
            <span class="font-medium">{{ formatDuration(route.duration) }}</span>
            <span v-if="route.isFastest" class="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-600 rounded font-medium">
              Fastest
            </span>
          </div>
          <div class="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
            <Route class="size-4" />
            <span>{{ formatDistance(route.distance) }}</span>
          </div>
        </div>
      </button>
    </div>
  </div>

  <!-- Render routes -->
  <MapRoute
    v-for="(route, index) in routes"
    :key="`route-${index}`"
    :coordinates="route.geometry"
    :color="selectedRoute === index ? '#6366f1' : '#94a3b8'"
    :width="selectedRoute === index ? 5 : 3"
    :opacity="selectedRoute === index ? 0.9 : 0.5"
  />

  <!-- Origin marker -->
  <MapMarker :longitude="4.9" :latitude="52.37">
    <MarkerContent>
      <div class="size-5 rounded-full bg-green-500 border-2 border-white shadow-lg" />
    </MarkerContent>
  </MapMarker>

  <!-- Destination marker -->
  <MapMarker :longitude="4.48" :latitude="51.92">
    <MarkerContent>
      <div class="size-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
    </MarkerContent>
  </MapMarker>
</template>
