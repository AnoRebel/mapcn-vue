<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, DeckGLOverlay } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { ScreenGridLayer } from '@deck.gl/aggregation-layers'

// Generate dense urban data
const urbanData = Array.from({ length: 10000 }, () => ({
  position: [
    -74.006 + (Math.random() - 0.5) * 0.1,
    40.7128 + (Math.random() - 0.5) * 0.1,
  ],
}))

const cellSize = ref(20)
const colorRange = ref([
  [255, 255, 204],
  [255, 237, 160],
  [254, 217, 118],
  [254, 178, 76],
  [253, 141, 60],
  [252, 78, 42],
])

const layers = computed(() => [
  new ScreenGridLayer({
    id: 'screen-grid-layer',
    data: urbanData,
    getPosition: d => d.position,
    cellSize: cellSize.value,
    colorRange: colorRange.value,
    gpuAggregation: true,
    aggregation: 'SUM',
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
          <span class="text-sm font-medium">Cell Size (pixels)</span>
          <input v-model.number="cellSize" type="range" min="10" max="50" step="5" class="w-full" />
          <span class="text-xs text-muted-foreground">{{ cellSize }}px</span>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-74.006, 40.7128]" :zoom="13" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      ScreenGridLayer aggregates points into screen-space grid cells. GPU-accelerated 
      for handling millions of points. Best for dense urban datasets at city scale.
    </p>
  </div>
</template>
