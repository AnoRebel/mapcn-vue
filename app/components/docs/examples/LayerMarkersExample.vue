<script setup lang="ts">
import { Map } from '~~/registry/map'
import LayerMarkersInner from './LayerMarkersInner.vue'
import ExamplePreview from '../ExamplePreview.vue'

function generateRandomPoints(count: number) {
  const center = { lng: -73.98, lat: 40.75 }
  const features = []

  for (let i = 0; i < count; i++) {
    const lng = center.lng + (Math.random() - 0.5) * 0.15
    const lat = center.lat + (Math.random() - 0.5) * 0.1
    features.push({
      type: 'Feature' as const,
      properties: {
        id: i,
        name: `Location ${i + 1}`,
        category: ['Restaurant', 'Cafe', 'Bar', 'Shop'][Math.floor(Math.random() * 4)],
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [lng, lat],
      },
    })
  }

  return {
    type: 'FeatureCollection' as const,
    features,
  }
}

const pointsData = generateRandomPoints(200)

const layerMarkersCode = `<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Map, MapPopup, useMap } from '~~/registry/map'

const pointsData = { /* 200 points */ }
const { map, isLoaded } = useMap()
const selectedPoint = ref(null)

watchEffect(() => {
  if (!map.value || !isLoaded.value) return
  
  map.value.addSource('markers', {
    type: 'geojson',
    data: pointsData,
  })
  
  map.value.addLayer({
    id: 'markers-layer',
    type: 'circle',
    source: 'markers',
    paint: {
      'circle-radius': 6,
      'circle-color': '#3b82f6',
    },
  })
  
  map.value.on('click', 'markers-layer', (e) => {
    if (e.features?.length) {
      selectedPoint.value = e.features[0].properties
    }
  })
})
<\/script>

<template>
  <div class="relative h-[400px]">
    <Map :center="[-73.98, 40.75]" :zoom="11" class="h-full" />
    <MapPopup
      v-if="selectedPoint"
      :longitude="selectedPoint.coordinates[0]"
      :latitude="selectedPoint.coordinates[1]"
      @close="selectedPoint = null"
    >
      <p class="font-medium">{{ selectedPoint.name }}</p>
    </MapPopup>
  </div>
</template>`
</script>

<template>
  <ExamplePreview :code="layerMarkersCode" height="h-[400px]">
    <div class="relative h-full">
      <Map :center="[-73.98, 40.75]" :zoom="11" class="h-full">
        <LayerMarkersInner :points-data="pointsData" />
      </Map>
    </div>
  </ExamplePreview>
</template>
