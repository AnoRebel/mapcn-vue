<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, DeckGLOverlay } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { LineLayer } from '@deck.gl/layers'

// Flight connections data
const flightConnections = [
  { source: [-74.006, 40.7128], target: [-0.1276, 51.5074], passengers: 500 },
  { source: [-74.006, 40.7128], target: [139.6917, 35.6895], passengers: 400 },
  { source: [-0.1276, 51.5074], target: [139.6917, 35.6895], passengers: 450 },
  { source: [-0.1276, 51.5074], target: [151.2093, -33.8688], passengers: 380 },
  { source: [139.6917, 35.6895], target: [151.2093, -33.8688], passengers: 420 },
  { source: [-74.006, 40.7128], target: [-43.1729, -22.9068], passengers: 250 },
  { source: [-0.1276, 51.5074], target: [55.2708, 25.2048], passengers: 350 },
  { source: [139.6917, 35.6895], target: [55.2708, 25.2048], passengers: 300 },
]

const width = ref(3)
const opacity = ref(0.8)

const layers = computed(() => [
  new LineLayer({
    id: 'line-layer',
    data: flightConnections,
    getSourcePosition: d => d.source,
    getTargetPosition: d => d.target,
    getColor: [0, 128, 255],
    getWidth: d => Math.max(1, (d.passengers / 500) * width.value),
    opacity: opacity.value,
    pickable: true,
  }),
])
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Line Width</span>
            <span class="text-sm text-muted-foreground">{{ width }}px</span>
          </div>
          <input
            v-model.number="width"
            type="range"
            min="1"
            max="10"
            step="0.5"
            class="w-full"
          >
        </div>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Opacity</span>
            <span class="text-sm text-muted-foreground">{{ Math.round(opacity * 100) }}%</span>
          </div>
          <input
            v-model.number="opacity"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
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
        class="h-full"
      >
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      LineLayer for rendering straight-line connections between two points. 
      Compare with ArcLayer for curved great-circle paths. Good for simple connections and network graphs.
    </p>
  </div>
</template>
