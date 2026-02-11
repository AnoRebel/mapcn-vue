<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, DeckGLOverlay } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { ColumnLayer } from '@deck.gl/layers'

// Building height data
const buildings = [
  { position: [-74.006, 40.7128], height: 500, name: 'Building A', color: [255, 100, 100] },
  { position: [-73.9857, 40.7484], height: 800, name: 'Building B', color: [100, 255, 100] },
  { position: [-73.9772, 40.7527], height: 650, name: 'Building C', color: [100, 100, 255] },
  { position: [-73.9632, 40.7794], height: 400, name: 'Building D', color: [255, 255, 100] },
  { position: [-73.9969, 40.7061], height: 550, name: 'Building E', color: [255, 100, 255] },
  { position: [-74.0445, 40.6892], height: 350, name: 'Building F', color: [100, 255, 255] },
  { position: [-73.9712, 40.7614], height: 700, name: 'Building G', color: [255, 150, 50] },
  { position: [-73.9442, 40.6782], height: 450, name: 'Building H', color: [150, 50, 255] },
]

const pitch = ref(60)
const radius = ref(200)

const layers = computed(() => [
  new ColumnLayer({
    id: 'column-layer',
    data: buildings,
    diskResolution: 12,
    radius: radius.value,
    extruded: true,
    pickable: true,
    elevationScale: 1,
    getPosition: d => d.position,
    getFillColor: d => d.color,
    getElevation: d => d.height,
    getLineColor: [255, 255, 255],
    lineWidthMinPixels: 2,
    stroked: true,
  }),
])
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="space-y-2">
          <span class="text-sm font-medium">Column Radius</span>
          <input
            v-model.number="radius"
            type="range"
            min="100"
            max="500"
            step="10"
            class="w-full"
          />
          <span class="text-xs text-muted-foreground">{{ radius }}m</span>
        </div>
        <div class="space-y-2">
          <span class="text-sm font-medium">Map Pitch</span>
          <input
            v-model.number="pitch"
            type="range"
            min="0"
            max="60"
            step="5"
            class="w-full"
          />
          <span class="text-xs text-muted-foreground">{{ pitch }}°</span>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map
        :center="[-73.98, 40.75]"
        :zoom="12"
        :pitch="pitch"
        class="h-full"
      >
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      ColumnLayer for 3D visualization. Extruded columns with configurable radius and height.
      Adjust pitch to see the 3D effect better. Perfect for showing building heights, population density, or any quantitative data.
    </p>
  </div>
</template>
