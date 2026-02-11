<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, MapGeoJson } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import type { FeatureCollection } from 'geojson'

// Sample data - city population
const citiesData: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'New York', population: 8400000, category: 'mega' }, geometry: { type: 'Point', coordinates: [-74.006, 40.7128] } },
    { type: 'Feature', properties: { name: 'Los Angeles', population: 3900000, category: 'mega' }, geometry: { type: 'Point', coordinates: [-118.2437, 34.0522] } },
    { type: 'Feature', properties: { name: 'Chicago', population: 2700000, category: 'large' }, geometry: { type: 'Point', coordinates: [-87.6298, 41.8781] } },
    { type: 'Feature', properties: { name: 'Houston', population: 2300000, category: 'large' }, geometry: { type: 'Point', coordinates: [-95.3698, 29.7604] } },
    { type: 'Feature', properties: { name: 'Phoenix', population: 1600000, category: 'medium' }, geometry: { type: 'Point', coordinates: [-112.074, 33.4484] } },
    { type: 'Feature', properties: { name: 'Philadelphia', population: 1500000, category: 'medium' }, geometry: { type: 'Point', coordinates: [-75.1652, 39.9526] } },
    { type: 'Feature', properties: { name: 'San Antonio', population: 1400000, category: 'medium' }, geometry: { type: 'Point', coordinates: [-98.4936, 29.4241] } },
    { type: 'Feature', properties: { name: 'San Diego', population: 1400000, category: 'medium' }, geometry: { type: 'Point', coordinates: [-117.1611, 32.7157] } },
    { type: 'Feature', properties: { name: 'Dallas', population: 1300000, category: 'medium' }, geometry: { type: 'Point', coordinates: [-96.797, 32.7767] } },
    { type: 'Feature', properties: { name: 'San Jose', population: 1000000, category: 'small' }, geometry: { type: 'Point', coordinates: [-121.8947, 37.3382] } },
  ]
}

const categories = {
  mega: { label: 'Mega Cities (3M+)', color: '#dc2626', visible: ref(true) },
  large: { label: 'Large Cities (1.5M-3M)', color: '#ea580c', visible: ref(true) },
  medium: { label: 'Medium Cities (1M-1.5M)', color: '#f59e0b', visible: ref(true) },
  small: { label: 'Small Cities (<1M)', color: '#22c55e', visible: ref(true) },
}

const selectedCity = ref<string | null>(null)

const filteredData = computed(() => {
  return {
    type: 'FeatureCollection',
    features: citiesData.features.filter(f => {
      const cat = f.properties?.category as keyof typeof categories
      return categories[cat]?.visible.value
    })
  } as FeatureCollection
})

function handleFeatureClick(feature: any) {
  selectedCity.value = feature.properties?.name
}

function getCityRadius(population: number): number {
  return Math.sqrt(population) / 100
}

const selectedCityData = computed(() => {
  if (!selectedCity.value) return null
  return citiesData.features.find(f => f.properties?.name === selectedCity.value)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Selected City -->
    <Card v-if="selectedCityData">
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">{{ selectedCityData.properties?.name }}</h3>
            <p class="text-sm text-muted-foreground">
              Population: {{ selectedCityData.properties?.population?.toLocaleString() }}
            </p>
          </div>
          <button @click="selectedCity = null" class="text-sm text-muted-foreground hover:text-foreground">
            Clear
          </button>
        </div>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Legend -->
      <Card class="lg:col-span-1">
        <CardContent class="p-4">
          <h3 class="font-semibold text-sm mb-3">Filter by Category</h3>
          <p class="text-xs text-muted-foreground mb-4">Click to toggle visibility</p>
          <div class="space-y-2">
            <button
              v-for="(cat, key) in categories"
              :key="key"
              @click="cat.visible.value = !cat.visible.value"
              class="w-full flex items-center gap-3 p-2 rounded-lg transition-colors"
              :class="cat.visible.value ? 'bg-muted' : 'opacity-50'"
            >
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: cat.color }"
              />
              <span class="text-sm">{{ cat.label }}</span>
              <span class="ml-auto text-xs text-muted-foreground">
                {{ cat.visible.value ? 'On' : 'Off' }}
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      <!-- Map -->
      <div class="lg:col-span-2 h-[400px] rounded-lg overflow-hidden border">
        <Map
          :center="[-98, 39]"
          :zoom="3.5"
          class="h-full"
        >
          <MapGeoJson
            :data="filteredData"
            layer-type="circle"
            :style="{ 
              circleRadius: 8,
              circleColor: ['match', ['get', 'category'],
                'mega', categories.mega.color,
                'large', categories.large.color,
                'medium', categories.medium.color,
                'small', categories.small.color,
                '#999'
              ],
              circleOpacity: 0.8,
              strokeColor: '#fff',
              strokeWidth: 2 
            }"
            :interactive="true"
            @click="handleFeatureClick"
          />
        </Map>
      </div>
    </div>

    <p class="text-sm text-muted-foreground">
      Interactive legend demonstrating category filtering. Click legend items to toggle
      visibility of different city categories. Click map markers to see city details.
    </p>
  </div>
</template>
