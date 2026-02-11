<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, DeckGLOverlay } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { ArcLayer } from '@deck.gl/layers'

// Flight routes data
const flightRoutes = [
  { source: [-74.006, 40.7128], target: [-0.1276, 51.5074], passengers: 500 },
  { source: [-74.006, 40.7128], target: [139.6917, 35.6895], passengers: 400 },
  { source: [-74.006, 40.7128], target: [151.2093, -33.8688], passengers: 300 },
  { source: [-74.006, 40.7128], target: [-43.1729, -22.9068], passengers: 250 },
  { source: [-74.006, 40.7128], target: [55.2708, 25.2048], passengers: 350 },
  { source: [-0.1276, 51.5074], target: [139.6917, 35.6895], passengers: 450 },
  { source: [-0.1276, 51.5074], target: [151.2093, -33.8688], passengers: 380 },
  { source: [-0.1276, 51.5074], target: [-43.1729, -22.9068], passengers: 320 },
  { source: [139.6917, 35.6895], target: [151.2093, -33.8688], passengers: 420 },
  { source: [139.6917, 35.6895], target: [-33.8688, 151.2093], passengers: 280 },
]

const height = ref(1)
const width = ref(2)

const layers = computed(() => [
  new ArcLayer({
    id: 'arc-layer',
    data: flightRoutes,
    getSourcePosition: d => d.source,
    getTargetPosition: d => d.target,
    getSourceColor: [255, 200, 0],
    getTargetColor: [0, 128, 255],
    getHeight: () => height.value * 0.5,
    getWidth: d => Math.max(2, (d.passengers / 500) * width.value * 5),
    pickable: true,
    greatCircle: true,
  }),
])
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="space-y-2">
          <span class="text-sm font-medium">Arc Height</span>
          <input
            v-model.number="height"
            type="range"
            min="0"
            max="3"
            step="0.1"
            class="w-full"
          >
        </div>
        <div class="space-y-2">
          <span class="text-sm font-medium">Arc Width</span>
          <input
            v-model.number="width"
            type="range"
            min="1"
            max="5"
            step="0.5"
            class="w-full"
          >
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map
        :center="[0, 20]"
        :zoom="1.5"
        :pitch="30"
        class="h-full"
      >
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      ArcLayer showing international flight routes. Gold lines show origin, blue lines show destination.
      Uses great circle arcs to follow Earth's curvature.
    </p>
  </div>
</template>
