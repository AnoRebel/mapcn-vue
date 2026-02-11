<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, DeckGLOverlay } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { TextLayer } from '@deck.gl/layers'

// City labels data
const cities = [
  { position: [-74.006, 40.7128], name: 'New York', population: 8.4 },
  { position: [-118.2437, 34.0522], name: 'Los Angeles', population: 3.9 },
  { position: [-87.6298, 41.8781], name: 'Chicago', population: 2.7 },
  { position: [-95.3698, 29.7604], name: 'Houston', population: 2.3 },
  { position: [-112.074, 33.4484], name: 'Phoenix', population: 1.6 },
  { position: [-75.1652, 39.9526], name: 'Philadelphia', population: 1.5 },
  { position: [-98.4936, 29.4241], name: 'San Antonio', population: 1.4 },
  { position: [-117.1611, 32.7157], name: 'San Diego', population: 1.4 },
  { position: [-96.797, 32.7767], name: 'Dallas', population: 1.3 },
  { position: [-121.8947, 37.3382], name: 'San Jose', population: 1.0 },
]

const fontSize = ref(14)
const showPopulation = ref(true)
const textAlign = ref<'start' | 'middle' | 'end'>('middle')

const layers = computed(() => [
  new TextLayer({
    id: 'text-layer',
    data: cities,
    getPosition: d => d.position,
    getText: d => showPopulation.value ? `${d.name}\n(${d.population}M)` : d.name,
    getSize: () => fontSize.value,
    getColor: [0, 0, 0],
    getAngle: 0,
    getTextAnchor: textAlign.value,
    getAlignmentBaseline: 'center',
    fontFamily: 'system-ui, sans-serif',
    fontWeight: 'bold',
    pickable: true,
    billboard: true,
    background: true,
    getBackgroundColor: [255, 255, 255, 200],
    getBorderColor: [0, 0, 0],
    getBorderWidth: 1,
    backgroundPadding: [4, 4],
  }),
])
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="space-y-2">
          <span class="text-sm font-medium">Font Size</span>
          <input v-model.number="fontSize" type="range" min="10" max="24" step="2" class="w-full" />
          <span class="text-xs text-muted-foreground">{{ fontSize }}px</span>
        </div>
        <label class="flex items-center gap-2">
          <input v-model="showPopulation" type="checkbox" class="rounded" />
          <span class="text-sm">Show Population</span>
        </label>
        <div class="space-y-2">
          <span class="text-sm font-medium">Text Alignment</span>
          <select v-model="textAlign" class="w-full p-2 rounded border bg-background">
            <option value="start">Start</option>
            <option value="middle">Middle</option>
            <option value="end">End</option>
          </select>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-98, 39]" :zoom="3.5" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      TextLayer renders labels and text at point locations. Supports multi-line text, 
      backgrounds, borders, and collision detection. Perfect for city labels and annotations.
    </p>
  </div>
</template>
