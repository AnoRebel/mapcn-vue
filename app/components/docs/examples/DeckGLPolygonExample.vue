<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, DeckGLOverlay } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { PolygonLayer } from '@deck.gl/layers'

// City districts data
const districts = [
  {
    contour: [
      [-74.01, 40.71],
      [-74.00, 40.71],
      [-74.00, 40.72],
      [-74.01, 40.72],
      [-74.01, 40.71],
    ],
    name: 'Financial District',
    population: 60000,
    color: [255, 100, 100],
  },
  {
    contour: [
      [-73.99, 40.73],
      [-73.98, 40.73],
      [-73.98, 40.74],
      [-73.99, 40.74],
      [-73.99, 40.73],
    ],
    name: 'Midtown',
    population: 150000,
    color: [100, 255, 100],
  },
  {
    contour: [
      [-73.97, 40.75],
      [-73.96, 40.75],
      [-73.96, 40.76],
      [-73.97, 40.76],
      [-73.97, 40.75],
    ],
    name: 'Upper East Side',
    population: 220000,
    color: [100, 100, 255],
  },
  {
    contour: [
      [-74.01, 40.73],
      [-74.00, 40.73],
      [-74.00, 40.74],
      [-74.01, 40.74],
      [-74.01, 40.73],
    ],
    name: 'Chelsea',
    population: 50000,
    color: [255, 255, 100],
  },
]

const filled = ref(true)
const stroked = ref(true)
const extruded = ref(false)
const elevationScale = ref(100)

const layers = computed(() => [
  new PolygonLayer({
    id: 'polygon-layer',
    data: districts,
    getPolygon: d => d.contour,
    getFillColor: d => d.color,
    getLineColor: [255, 255, 255],
    getLineWidth: 20,
    getElevation: d => d.population / 1000,
    filled: filled.value,
    stroked: stroked.value,
    extruded: extruded.value,
    elevationScale: elevationScale.value,
    lineWidthMinPixels: 1,
    pickable: true,
  }),
])
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="flex flex-wrap gap-4">
          <label class="flex items-center gap-2">
            <input v-model="filled" type="checkbox" class="rounded" >
            <span class="text-sm">Filled</span>
          </label>
          <label class="flex items-center gap-2">
            <input v-model="stroked" type="checkbox" class="rounded" >
            <span class="text-sm">Stroked</span>
          </label>
          <label class="flex items-center gap-2">
            <input v-model="extruded" type="checkbox" class="rounded" >
            <span class="text-sm">3D Extruded</span>
          </label>
        </div>
        
        <div v-if="extruded" class="space-y-2">
          <span class="text-sm font-medium">Elevation Scale</span>
          <input
            v-model.number="elevationScale"
            type="range"
            min="0"
            max="500"
            step="10"
            class="w-full"
          >
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map
        :center="[-73.99, 40.735]"
        :zoom="12"
        :pitch="extruded ? 45 : 0"
        class="h-full"
      >
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      PolygonLayer for rendering filled and stroked polygons. Supports 3D extrusion based on data values.
      Perfect for zoning maps, district boundaries, or building footprints.
    </p>
  </div>
</template>
