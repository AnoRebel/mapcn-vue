<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Map, MapMarker, MarkerContent, MarkerLabel, MarkerTooltip, MapRoute } from '~~/registry/map'
import { Truck } from 'lucide-vue-next'
import ExampleCard from './ExampleCard.vue'

const store = { lng: -0.14, lat: 51.5154 }
const home = { lng: -0.07, lat: 51.51 }

const route = ref<[number, number][]>([])
const truckPosition = ref<[number, number] | null>(null)

onMounted(async () => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${store.lng},${store.lat};${home.lng},${home.lat}?overview=full&geometries=geojson`
    )
    const data = await response.json()

    if (data.routes?.[0]?.geometry?.coordinates) {
      route.value = data.routes[0].geometry.coordinates
      const truckIdx = Math.floor(route.value.length * 0.6)
      const position = route.value[truckIdx]
      if (position) {
        truckPosition.value = position
      }
    }
  } catch (error) {
    console.error('Failed to fetch route:', error)
  }
})
</script>

<template>
  <ExampleCard
    label="Delivery"
    class="aspect-square sm:col-span-2 sm:aspect-video lg:aspect-auto"
    delay="delay-900"
  >
    <ClientOnly>
      <Map :center="[-0.105, 51.511]" :zoom="12.4" class="h-full">
        <MapRoute
          v-if="route.length > 0"
          :coordinates="route"
          :width="4"
          color="#4285F4"
        />
        <MapMarker :longitude="store.lng" :latitude="store.lat">
          <MarkerContent>
            <div class="size-3.5 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            <MarkerLabel>Store</MarkerLabel>
          </MarkerContent>
        </MapMarker>
        <MapMarker
          v-if="truckPosition"
          :longitude="truckPosition[0]"
          :latitude="truckPosition[1]"
        >
          <MarkerContent>
            <div class="bg-blue-500 rounded-full p-1.5 shadow-lg">
              <Truck class="size-3 text-white" />
            </div>
          </MarkerContent>
          <MarkerTooltip>On the way</MarkerTooltip>
        </MapMarker>
        <MapMarker :longitude="home.lng" :latitude="home.lat">
          <MarkerContent>
            <div class="size-3.5 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            <MarkerLabel>Home</MarkerLabel>
          </MarkerContent>
        </MapMarker>
      </Map>
    </ClientOnly>
  </ExampleCard>
</template>
