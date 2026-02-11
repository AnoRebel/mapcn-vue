<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, MapRoute, MapMarker, MarkerContent, MarkerPopup } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Car, Bike, Footprints } from 'lucide-vue-next'

type Profile = 'driving' | 'cycling' | 'walking'

interface RoutePoint {
  lat: number
  lng: number
  name: string
}

const profile = ref<Profile>('driving')
const loading = ref(false)
const route = ref<[number, number][]>([])
const routeInfo = ref<{ distance: number; duration: number } | null>(null)

const start = ref<RoutePoint>({ lat: 40.7128, lng: -74.006, name: 'New York' })
const end = ref<RoutePoint>({ lat: 40.7484, lng: -73.9857, name: 'Empire State' })

const profiles = {
  driving: { icon: Car, label: 'Driving' },
  cycling: { icon: Bike, label: 'Cycling' },
  walking: { icon: Footprints, label: 'Walking' },
}

async function calculateRoute() {
  loading.value = true
  
  // Simulate API call to Valhalla/OSRM
  // In production, this would call your backend or Valhalla API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Generate a simple route (straight line with some points for demo)
  const numPoints = 20
  route.value = Array.from({ length: numPoints }, (_, i) => {
    const t = i / (numPoints - 1)
    return [
      start.value.lng + (end.value.lng - start.value.lng) * t + (Math.random() - 0.5) * 0.01,
      start.value.lat + (end.value.lat - start.value.lat) * t + (Math.random() - 0.5) * 0.01,
    ] as [number, number]
  })
  
  // Calculate approximate distance and duration
  const dist = Math.sqrt(
    Math.pow(end.value.lng - start.value.lng, 2) + 
    Math.pow(end.value.lat - start.value.lat, 2)
  ) * 111 // rough km conversion
  
  const speed = profile.value === 'driving' ? 50 : profile.value === 'cycling' ? 15 : 5
  routeInfo.value = {
    distance: dist,
    duration: (dist / speed) * 60,
  }
  
  loading.value = false
}

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${Math.round(minutes)} min`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return `${hours}h ${mins}m`
}

onMounted(() => {
  calculateRoute()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Route Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <!-- Profile Selection -->
        <div class="flex gap-2">
          <Button
            v-for="(info, key) in profiles"
            :key="key"
            variant="outline"
            size="sm"
            :class="profile === key ? 'bg-primary text-primary-foreground' : ''"
            @click="profile = key; calculateRoute()"
          >
            <component :is="info.icon" class="w-4 h-4 mr-1" />
            {{ info.label }}
          </Button>
        </div>

        <!-- Start/End Points -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <span class="text-xs font-medium">Start</span>
            <div class="flex gap-2">
              <Input v-model.number="start.lng" placeholder="Lng" class="h-8 text-sm" />
              <Input v-model.number="start.lat" placeholder="Lat" class="h-8 text-sm" />
            </div>
          </div>
          <div class="space-y-2">
            <span class="text-xs font-medium">End</span>
            <div class="flex gap-2">
              <Input v-model.number="end.lng" placeholder="Lng" class="h-8 text-sm" />
              <Input v-model.number="end.lat" placeholder="Lat" class="h-8 text-sm" />
            </div>
          </div>
        </div>

        <Button @click="calculateRoute" :disabled="loading" class="w-full">
          {{ loading ? 'Calculating...' : 'Calculate Route' }}
        </Button>

        <!-- Route Info -->
        <div v-if="routeInfo" class="flex justify-between text-sm">
          <span>Distance: {{ routeInfo.distance.toFixed(1) }} km</span>
          <span>Duration: {{ formatDuration(routeInfo.duration) }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map
        :center="[(start.lng + end.lng) / 2, (start.lat + end.lat) / 2]"
        :zoom="12"
        class="h-full"
      >
        <MapRoute
          v-if="route.length > 0"
          :coordinates="route"
          color="#3b82f6"
          :width="4"
          :fit-bounds="true"
        />
        
        <MapMarker :longitude="start.lng" :latitude="start.lat">
          <MarkerContent>
            <div class="w-8 h-8 rounded-full bg-green-500 border-2 border-white shadow-lg flex items-center justify-center">
              <span class="text-white text-xs font-bold">A</span>
            </div>
          </MarkerContent>
          <MarkerPopup>
            <div class="font-medium">{{ start.name }}</div>
            <div class="text-xs text-muted-foreground">Start Point</div>
          </MarkerPopup>
        </MapMarker>

        <MapMarker :longitude="end.lng" :latitude="end.lat">
          <MarkerContent>
            <div class="w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center">
              <span class="text-white text-xs font-bold">B</span>
            </div>
          </MarkerContent>
          <MarkerPopup>
            <div class="font-medium">{{ end.name }}</div>
            <div class="text-xs text-muted-foreground">Destination</div>
          </MarkerPopup>
        </MapMarker>
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      Route planning example using Valhalla-style routing. In production, connect to 
      <a href="https://valhalla.github.io/valhalla/" target="_blank" class="underline">Valhalla API</a> 
      or your own routing service.
    </p>
  </div>
</template>
