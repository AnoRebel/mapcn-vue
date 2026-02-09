<script setup lang="ts">
import { Map, MapControls } from '~~/registry/map'
import RoutePlanningInner from './RoutePlanningInner.vue'
import ExamplePreview from '../ExamplePreview.vue'

const routePlanningCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Map, MapRoute, MapMarker, MarkerContent } from '~~/registry/map'

const selectedRoute = ref(0)

const routes = [
  { 
    duration: 4140, // seconds
    distance: 80200, // meters
    geometry: [[4.9, 52.37], [4.48, 51.92]], // coordinates
    isFastest: true 
  },
  { 
    duration: 4560,
    distance: 81000,
    geometry: [[4.9, 52.37], [5.0, 52.15], [4.48, 51.92]],
    isFastest: false 
  },
]
<\/script>

<template>
  <div class="relative h-[500px]">
    <Map :center="[4.7, 52.1]" :zoom="9" class="h-full">
      <MapControls />
      
      <!-- Route selector UI -->
      <div class="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur rounded-lg shadow-lg border p-3">
        <button
          v-for="(route, index) in routes"
          :key="index"
          @click="selectedRoute = index"
          class="w-full flex items-center gap-3 p-2 rounded-lg"
          :class="selectedRoute === index ? 'bg-primary/10' : 'hover:bg-muted/50'"
        >
          <span>{{ Math.floor(route.duration / 60) }}m</span>
          <span v-if="route.isFastest" class="text-green-600 text-xs">Fastest</span>
        </button>
      </div>
      
      <!-- Render routes -->
      <MapRoute
        v-for="(route, index) in routes"
        :key="index"
        :coordinates="route.geometry"
        :color="selectedRoute === index ? '#6366f1' : '#94a3b8'"
        :width="selectedRoute === index ? 5 : 3"
      />
      
      <!-- Markers -->
      <MapMarker :longitude="4.9" :latitude="52.37">
        <div class="size-5 rounded-full bg-green-500 border-2 border-white" />
      </MapMarker>
      <MapMarker :longitude="4.48" :latitude="51.92">
        <div class="size-5 rounded-full bg-red-500 border-2 border-white" />
      </MapMarker>
    </Map>
  </div>
</template>`
</script>

<template>
  <ExamplePreview :code="routePlanningCode" height="h-[500px]">
    <div class="relative h-full">
      <Map :center="[4.7, 52.1]" :zoom="9" class="h-full">
        <MapControls />
        <RoutePlanningInner />
      </Map>
    </div>
  </ExamplePreview>
</template>
