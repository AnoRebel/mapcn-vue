<script setup lang="ts">
import { Map, MapControls } from '~~/registry/map'
import CustomLayerInner from './CustomLayerInner.vue'
import ExamplePreview from '../ExamplePreview.vue'

const geojsonData = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { name: 'Central Park', type: 'park' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-73.9731, 40.7644],
            [-73.9819, 40.7681],
            [-73.958, 40.8006],
            [-73.9493, 40.7969],
            [-73.9731, 40.7644],
          ],
        ],
      },
    },
    {
      type: 'Feature' as const,
      properties: { name: 'Bryant Park', type: 'park' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [-73.9837, 40.7536],
            [-73.9854, 40.7542],
            [-73.984, 40.7559],
            [-73.9823, 40.7553],
            [-73.9837, 40.7536],
          ],
        ],
      },
    },
  ],
}

const customLayerCode = `<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Map, MapControls, useMap } from '~~/registry/map'
import { Button } from '~/components/ui/button'

const geojsonData = { /* GeoJSON data */ }
const { map, isLoaded } = useMap()
const isVisible = ref(false)

watchEffect(() => {
  if (!map.value || !isLoaded.value) return
  
  if (!map.value.getSource('parks')) {
    map.value.addSource('parks', {
      type: 'geojson',
      data: geojsonData,
    })
  }
  
  map.value.addLayer({
    id: 'parks-fill',
    type: 'fill',
    source: 'parks',
    paint: {
      'fill-color': '#22c55e',
      'fill-opacity': 0.4,
    },
  })
})
<\/script>

<template>
  <div class="relative h-[400px]">
    <Map :center="[-73.97, 40.78]" :zoom="11.8" class="h-full">
      <MapControls />
    </Map>
    <Button class="absolute top-3 left-3 z-10">
      Toggle Parks
    </Button>
  </div>
</template>`
</script>

<template>
  <ExamplePreview :code="customLayerCode" height="h-[400px]">
    <div class="relative h-full">
      <Map :center="[-73.97, 40.78]" :zoom="11.8" class="h-full">
        <MapControls />
        <CustomLayerInner :geojson-data="geojsonData" />
      </Map>
    </div>
  </ExamplePreview>
</template>
