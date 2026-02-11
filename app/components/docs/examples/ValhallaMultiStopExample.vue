<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, MapRoute, MapMarker, MarkerContent } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Route, Plus, Trash2, Calculator } from 'lucide-vue-next'

interface Stop {
  id: number
  lat: number
  lng: number
  name: string
}

const stops = ref<Stop[]>([
  { id: 1, lat: 40.7128, lng: -74.006, name: 'Start' },
  { id: 2, lat: 40.7484, lng: -73.9857, name: 'Stop 1' },
  { id: 3, lat: 40.7589, lng: -73.9851, name: 'Stop 2' },
  { id: 4, lat: 40.7614, lng: -73.9776, name: 'End' },
])

const loading = ref(false)
const optimizedRoute = ref<[number, number][]>([])
const routeInfo = ref<{ distance: number; duration: number } | null>(null)

function addStop() {
  const newId = Math.max(...stops.value.map(s => s.id)) + 1
  stops.value.push({
    id: newId,
    lat: 40.75 + Math.random() * 0.02,
    lng: -73.99 + Math.random() * 0.02,
    name: `Stop ${newId}`,
  })
}

function removeStop(id: number) {
  if (stops.value.length > 2) {
    stops.value = stops.value.filter(s => s.id !== id)
  }
}

async function optimizeRoute() {
  loading.value = true
  
  // Simulate route optimization (traveling salesman)
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Simple nearest-neighbor optimization for demo
  const route: [number, number][] = []
  const visited = new Set<number>()
  let current = 0
  
  while (visited.size < stops.value.length) {
    route.push([stops.value[current].lng, stops.value[current].lat])
    visited.add(current)
    
    // Find nearest unvisited
    let nearest = -1
    let minDist = Infinity
    
    for (let i = 0; i < stops.value.length; i++) {
      if (!visited.has(i)) {
        const dist = Math.sqrt(
          Math.pow(stops.value[i].lng - stops.value[current].lng, 2) +
          Math.pow(stops.value[i].lat - stops.value[current].lat, 2)
        )
        if (dist < minDist) {
          minDist = dist
          nearest = i
        }
      }
    }
    
    if (nearest !== -1) current = nearest
  }
  
  optimizedRoute.value = route
  
  // Calculate stats
  let totalDist = 0
  for (let i = 0; i < route.length - 1; i++) {
    totalDist += Math.sqrt(
      Math.pow(route[i + 1][0] - route[i][0], 2) +
      Math.pow(route[i + 1][1] - route[i][1], 2)
    )
  }
  
  routeInfo.value = {
    distance: totalDist * 111,
    duration: (totalDist * 111 / 30) * 60,
  }
  
  loading.value = false
}

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${Math.round(minutes)} min`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return `${hours}h ${mins}m`
}
</script>

<template>
  <div class="space-y-4">
    <!-- Route Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold flex items-center gap-2">
            <Route class="w-4 h-4" />
            Stops
          </h3>
          <Button variant="outline" size="sm" @click="addStop">
            <Plus class="w-4 h-4 mr-1" />
            Add Stop
          </Button>
        </div>

        <!-- Stops List -->
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div
            v-for="(stop, index) in stops"
            :key="stop.id"
            class="flex items-center gap-2 p-2 bg-muted rounded-lg"
          >
            <span class="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {{ index + 1 }}
            </span>
            <div class="flex-1 grid grid-cols-2 gap-2">
              <Input v-model.number="stop.lat" placeholder="Lat" class="h-7 text-xs" />
              <Input v-model.number="stop.lng" placeholder="Lng" class="h-7 text-xs" />
            </div>
            <Input v-model="stop.name" placeholder="Name" class="h-7 text-xs w-24" />
            <Button
              v-if="stops.length > 2"
              variant="ghost"
              size="sm"
              class="h-7 w-7 p-0"
              @click="removeStop(stop.id)"
            >
              <Trash2 class="w-3 h-3" />
            </Button>
          </div>
        </div>

        <Button @click="optimizeRoute" :disabled="loading" class="w-full">
          <Calculator class="w-4 h-4 mr-1" />
          {{ loading ? 'Optimizing...' : 'Optimize Route' }}
        </Button>

        <!-- Route Info -->
        <div v-if="routeInfo" class="flex justify-between text-sm pt-2 border-t">
          <span>Distance: {{ routeInfo.distance.toFixed(1) }} km</span>
          <span>Est. Time: {{ formatDuration(routeInfo.duration) }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map
        :center="[-74.0, 40.75]"
        :zoom="12"
        class="h-full"
      >
        <MapRoute
          v-if="optimizedRoute.length > 0"
          :coordinates="optimizedRoute"
          color="#10b981"
          :width="4"
          :fit-bounds="true"
        />
        
        <MapMarker
          v-for="(stop, index) in stops"
          :key="stop.id"
          :longitude="stop.lng"
          :latitude="stop.lat"
        >
          <MarkerContent>
            <div 
              class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              :class="index === 0 ? 'bg-green-500' : index === stops.length - 1 ? 'bg-red-500' : 'bg-blue-500'"
            >
              <span class="text-white text-xs font-bold">{{ index + 1 }}</span>
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      Multi-stop route optimization using a traveling salesman algorithm.
      Add stops, reorder them, and calculate the most efficient route.
    </p>
  </div>
</template>
