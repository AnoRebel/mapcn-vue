<script setup lang="ts">
import { ref } from 'vue'
import { Map, MapMarker, MarkerContent } from '~~/registry/map'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Slider } from '~/components/ui/slider'
import { Plane, Navigation, Zap, RotateCcw } from 'lucide-vue-next'

interface CityLocation {
  name: string
  coordinates: [number, number]
  zoom: number
  pitch?: number
  bearing?: number
}

const cities: CityLocation[] = [
  { name: 'New York', coordinates: [-74.006, 40.7128], zoom: 12 },
  { name: 'Paris', coordinates: [2.3522, 48.8566], zoom: 13, pitch: 45, bearing: 30 },
  { name: 'Tokyo', coordinates: [139.6917, 35.6895], zoom: 11 },
  { name: 'Sydney', coordinates: [151.2093, -33.8688], zoom: 12, pitch: 60, bearing: -45 },
  { name: 'Rio de Janeiro', coordinates: [-43.1729, -22.9068], zoom: 11 },
  { name: 'Dubai', coordinates: [55.2708, 25.2048], zoom: 13, pitch: 50, bearing: 120 },
]

type AnimationType = 'flyTo' | 'easeTo' | 'jumpTo'

const currentCity = ref<CityLocation>(cities[0])
const animationType = ref<AnimationType>('flyTo')
const duration = ref(2000)
const mapRef = ref<InstanceType<typeof Map>>()

async function flyToCity(city: CityLocation) {
  if (!mapRef.value) return
  
  currentCity.value = city
  
  // Access the underlying maplibre map instance
  const map = (mapRef.value as any).mapInstance
  if (!map) return

  const options = {
    center: city.coordinates,
    zoom: city.zoom,
    pitch: city.pitch ?? 0,
    bearing: city.bearing ?? 0,
    duration: duration.value,
  }

  switch (animationType.value) {
    case 'flyTo':
      map.flyTo(options)
      break
    case 'easeTo':
      map.easeTo(options)
      break
    case 'jumpTo':
      map.jumpTo({
        center: city.coordinates,
        zoom: city.zoom,
        pitch: city.pitch ?? 0,
        bearing: city.bearing ?? 0,
      })
      break
  }
}

function resetView() {
  if (!mapRef.value) return
  const map = (mapRef.value as any).mapInstance
  if (!map) return
  
  map.flyTo({
    center: [-74.006, 40.7128],
    zoom: 2,
    pitch: 0,
    bearing: 0,
    duration: 1500,
  })
}

const animationIcons: Record<AnimationType, any> = {
  flyTo: Plane,
  easeTo: Navigation,
  jumpTo: Zap,
}
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <!-- Animation Type -->
        <div class="space-y-2">
          <span class="text-sm font-medium">Animation Type</span>
          <div class="flex gap-2">
            <Button
              v-for="(icon, type) in animationIcons"
              :key="type"
              variant="outline"
              size="sm"
              :class="animationType === type ? 'bg-primary text-primary-foreground' : ''"
              @click="animationType = type"
            >
              <component :is="icon" class="w-4 h-4 mr-1" />
              {{ type }}
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">
            <template v-if="animationType === 'flyTo'">
              flyTo: Smooth animated transition with curve
            </template>
            <template v-else-if="animationType === 'easeTo'">
              easeTo: Smooth linear transition
            </template>
            <template v-else>
              jumpTo: Instant jump, no animation
            </template>
          </p>
        </div>

        <!-- Duration Slider -->
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Duration</span>
            <span class="text-sm text-muted-foreground">{{ duration }}ms</span>
          </div>
          <Slider v-model="duration" :min="500" :max="5000" :step="100" />
        </div>

        <!-- City Buttons -->
        <div class="space-y-2">
          <span class="text-sm font-medium">Fly to City</span>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="city in cities"
              :key="city.name"
              variant="outline"
              size="sm"
              :class="currentCity.name === city.name ? 'bg-secondary' : ''"
              @click="flyToCity(city)"
            >
              {{ city.name }}
            </Button>
          </div>
        </div>

        <!-- Reset -->
        <Button variant="ghost" size="sm" class="w-full" @click="resetView">
          <RotateCcw class="w-4 h-4 mr-1" />
          Reset View
        </Button>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map
        ref="mapRef"
        :center="[-74.006, 40.7128]"
        :zoom="2"
        class="h-full"
      >
        <MapMarker
          v-for="city in cities"
          :key="city.name"
          :longitude="city.coordinates[0]"
          :latitude="city.coordinates[1]"
        >
          <MarkerContent>
            <div class="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-lg" />
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  </div>
</template>
