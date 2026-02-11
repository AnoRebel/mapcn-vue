<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, DeckGLOverlay } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { ScatterplotLayer } from '@deck.gl/layers'

// Earthquake data from USGS (sample)
interface Earthquake {
  position: [number, number]
  magnitude: number
  depth: number
  location: string
  time: string
}

const earthquakes: Earthquake[] = [
  { position: [-122.42, 37.77], magnitude: 3.2, depth: 8, location: 'San Francisco, CA', time: '2 min ago' },
  { position: [139.69, 35.68], magnitude: 4.5, depth: 42, location: 'Near Tokyo, Japan', time: '15 min ago' },
  { position: [-71.35, -29.95], magnitude: 5.1, depth: 25, location: 'Offshore Chile', time: '32 min ago' },
  { position: [23.72, 37.98], magnitude: 3.8, depth: 12, location: 'Near Athens, Greece', time: '45 min ago' },
  { position: [-155.28, 19.41], magnitude: 2.9, depth: 6, location: 'Kilauea, Hawaii', time: '1 hour ago' },
  { position: [100.5, 3.2], magnitude: 4.2, depth: 35, location: 'Sumatra, Indonesia', time: '1.5 hours ago' },
  { position: [37.2, 37.1], magnitude: 3.5, depth: 18, location: 'Turkey', time: '2 hours ago' },
  { position: [-116.8, 33.5], magnitude: 2.5, depth: 7, location: 'Southern California', time: '2.5 hours ago' },
  { position: [178.4, -18.2], magnitude: 4.8, depth: 520, location: 'Fiji Region', time: '3 hours ago' },
  { position: [29.0, 41.0], magnitude: 3.1, depth: 10, location: 'Istanbul, Turkey', time: '3.5 hours ago' },
  { position: [-104.2, 19.5], magnitude: 3.9, depth: 65, location: 'Colima, Mexico', time: '4 hours ago' },
  { position: [142.3, 38.3], magnitude: 5.5, depth: 45, location: 'Tohoku, Japan', time: '5 hours ago' },
]

const selectedQuake = ref<Earthquake | null>(null)
const mapStyle = ref<'satellite' | 'dark'>('satellite')

function getQuakeColor(magnitude: number): [number, number, number] {
  if (magnitude < 3) return [255, 255, 0] // Yellow
  if (magnitude < 4) return [255, 165, 0] // Orange
  if (magnitude < 5) return [255, 69, 0] // Red-orange
  return [255, 0, 0] // Red
}

function getQuakeRadius(magnitude: number): number {
  return Math.pow(2, magnitude) * 1000
}

const layers = computed(() => [
  new ScatterplotLayer({
    id: 'earthquakes',
    data: earthquakes,
    getPosition: d => d.position,
    getRadius: d => getQuakeRadius(d.magnitude),
    getFillColor: d => getQuakeColor(d.magnitude),
    getLineColor: [255, 255, 255],
    lineWidthMinPixels: 2,
    stroked: true,
    filled: true,
    opacity: 0.8,
    pickable: true,
    onClick: (info) => {
      if (info.object) {
        selectedQuake.value = info.object as Earthquake
      }
    },
  }),
])

const magnitudeBarWidth = computed(() => 
  selectedQuake.value ? `${Math.min((selectedQuake.value.magnitude / 10) * 100, 100)}%` : '0%'
)

const depthBarWidth = computed(() =>
  selectedQuake.value ? `${Math.min((selectedQuake.value.depth / 700) * 100, 100)}%` : '0%'
)
</script>

<template>
  <div class="space-y-4">
    <!-- Selected Earthquake Info -->
    <Card v-if="selectedQuake">
      <CardContent class="p-4 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">{{ selectedQuake.location }}</h3>
          <span class="text-2xl font-bold" :style="{ color: 'rgb(' + getQuakeColor(selectedQuake.magnitude).join(',') + ')' }">
            M{{ selectedQuake.magnitude }}
          </span>
        </div>
        <p class="text-sm text-muted-foreground">{{ selectedQuake.time }}</p>
        
        <!-- Magnitude bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span>Magnitude</span>
            <span>{{ selectedQuake.magnitude }}</span>
          </div>
          <div class="h-2 bg-muted rounded-full overflow-hidden">
            <div class="h-full bg-red-500 rounded-full transition-all" :style="{ width: magnitudeBarWidth }" />
          </div>
        </div>
        
        <!-- Depth bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span>Depth</span>
            <span>{{ selectedQuake.depth }} km</span>
          </div>
          <div class="h-2 bg-muted rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full transition-all" :style="{ width: depthBarWidth }" />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[500px] w-full rounded-lg overflow-hidden border relative">
      <Map
        :center="[0, 20]"
        :zoom="1.5"
        :pitch="0"
        :styles="mapStyle === 'satellite' ? {
          light: {
            version: 8,
            sources: {
              satellite: {
                type: 'raster',
                tiles: ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg'],
                tileSize: 256,
              },
            },
            layers: [
              { id: 'satellite', type: 'raster', source: 'satellite' },
            ],
          },
          dark: {
            version: 8,
            sources: {
              satellite: {
                type: 'raster',
                tiles: ['https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg'],
                tileSize: 256,
              },
            },
            layers: [
              { id: 'satellite', type: 'raster', source: 'satellite' },
            ],
          },
        } : undefined"
        class="h-full"
      >
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>

      <!-- Legend -->
      <div class="absolute bottom-4 left-4 bg-background/90 backdrop-blur p-3 rounded-lg shadow-lg border">
        <p class="text-xs font-medium mb-2">Magnitude</p>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" style="background: rgb(255, 0, 0)" />
            <span class="text-xs">5.0+ Major</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" style="background: rgb(255, 69, 0)" />
            <span class="text-xs">4.0-5.0 Moderate</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" style="background: rgb(255, 165, 0)" />
            <span class="text-xs">3.0-4.0 Light</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" style="background: rgb(255, 255, 0)" />
            <span class="text-xs">&lt;3.0 Minor</span>
          </div>
        </div>
        <p class="text-xs text-muted-foreground mt-2">Click a point for details</p>
      </div>

      <!-- Style Toggle -->
      <div class="absolute top-4 right-4 flex gap-2">
        <button
          :class="mapStyle === 'satellite' ? 'bg-primary text-primary-foreground' : 'bg-background'"
          class="px-3 py-1 text-sm rounded-md border shadow-sm"
          @click="mapStyle = 'satellite'"
        >
          Satellite
        </button>
        <button
          :class="mapStyle === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-background'"
          class="px-3 py-1 text-sm rounded-md border shadow-sm"
          @click="mapStyle = 'dark'"
        >
          Dark
        </button>
      </div>
    </div>
  </div>
</template>
