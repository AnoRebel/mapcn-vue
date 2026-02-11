<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, DeckGLOverlay } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { HexagonLayer } from '@deck.gl/aggregation-layers'

// Generate sample crash data
const crashData = Array.from({ length: 2000 }, () => ({
  position: [
    -74.006 + (Math.random() - 0.5) * 0.3,
    40.7128 + (Math.random() - 0.5) * 0.3,
  ],
}))

const radius = ref(100)
const coverage = ref(0.9)
const elevationScale = ref(50)
const upperPercentile = ref(100)

const layers = computed(() => [
  new HexagonLayer({
    id: 'hexagon-layer',
    data: crashData,
    getPosition: d => d.position,
    radius: radius.value,
    coverage: coverage.value,
    elevationScale: elevationScale.value,
    upperPercentile: upperPercentile.value,
    extruded: true,
    colorRange: [
      [255, 255, 178],
      [254, 204, 92],
      [253, 141, 60],
      [240, 59, 32],
      [189, 0, 38],
    ],
    pickable: true,
  }),
])
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <span class="text-sm font-medium">Hexagon Radius</span>
          <input v-model.number="radius" type="range" min="50" max="500" step="10" class="w-full" />
          <span class="text-xs text-muted-foreground">{{ radius }}m</span>
        </div>
        <div class="space-y-2">
          <span class="text-sm font-medium">Coverage</span>
          <input v-model.number="coverage" type="range" min="0.1" max="1" step="0.1" class="w-full" />
          <span class="text-xs text-muted-foreground">{{ Math.round(coverage * 100) }}%</span>
        </div>
        <div class="space-y-2">
          <span class="text-sm font-medium">Elevation Scale</span>
          <input v-model.number="elevationScale" type="range" min="0" max="200" step="10" class="w-full" />
          <span class="text-xs text-muted-foreground">{{ elevationScale }}</span>
        </div>
        <div class="space-y-2">
          <span class="text-sm font-medium">Upper Percentile</span>
          <input v-model.number="upperPercentile" type="range" min="50" max="100" step="5" class="w-full" />
          <span class="text-xs text-muted-foreground">{{ upperPercentile }}%</span>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-74.006, 40.7128]" :zoom="11" :pitch="45" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      HexagonLayer aggregates points into hexagonal bins. Perfect for visualizing density patterns
      like crime incidents, traffic accidents, or POI distributions. 3D extrusion shows concentration.
    </p>
  </div>
</template>
