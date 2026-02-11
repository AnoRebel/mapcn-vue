<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Map, MapMarker, MarkerContent, MapRoute } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Play, Pause, RotateCcw, Package } from 'lucide-vue-next'

// Delivery route stops
const stops = [
  { position: [-74.006, 40.7128], name: 'Warehouse', completed: true },
  { position: [-73.985, 40.748], name: 'Stop #1', completed: true },
  { position: [-73.975, 40.758], name: 'Stop #2', completed: false },
  { position: [-73.965, 40.768], name: 'Stop #3', completed: false },
  { position: [-73.955, 40.778], name: 'Final Delivery', completed: false },
]

// Generate route path
const routePath = computed(() => stops.map(s => s.position as [number, number]))

// Animation state
const isPlaying = ref(false)
const currentStopIndex = ref(0)
const vehiclePosition = ref<[number, number]>(stops[0].position as [number, number])
let animationInterval: ReturnType<typeof setInterval> | null = null

// Delivery stats
const totalStops = stops.length
const completedStops = computed(() => stops.filter(s => s.completed).length)
const progress = computed(() => (completedStops.value / totalStops) * 100)

function interpolatePosition(start: [number, number], end: [number, number], t: number): [number, number] {
  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
  ]
}

function startAnimation() {
  if (currentStopIndex.value >= stops.length - 1) {
    resetAnimation()
  }
  
  isPlaying.value = true
  let step = 0
  const stepsPerSegment = 50
  
  animationInterval = setInterval(() => {
    if (currentStopIndex.value >= stops.length - 1) {
      stopAnimation()
      return
    }
    
    const start = stops[currentStopIndex.value].position as [number, number]
    const end = stops[currentStopIndex.value + 1].position as [number, number]
    
    step++
    const t = step / stepsPerSegment
    vehiclePosition.value = interpolatePosition(start, end, t)
    
    if (step >= stepsPerSegment) {
      step = 0
      currentStopIndex.value++
      if (currentStopIndex.value < stops.length) {
        stops[currentStopIndex.value].completed = true
      }
    }
  }, 50)
}

function stopAnimation() {
  isPlaying.value = false
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}

function resetAnimation() {
  stopAnimation()
  currentStopIndex.value = 0
  vehiclePosition.value = stops[0].position as [number, number]
  stops.forEach((s, i) => s.completed = i === 0)
}

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Delivery Status -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Package class="w-5 h-5 text-primary" />
            <span class="font-medium">Delivery Progress</span>
          </div>
          <span class="text-sm text-muted-foreground">
            {{ completedStops }} / {{ totalStops }} stops
          </span>
        </div>
        
        <!-- Progress bar -->
        <div class="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>
        
        <!-- Current location -->
        <div class="text-sm">
          <span class="text-muted-foreground">Current: </span>
          <span class="font-medium">{{ stops[currentStopIndex]?.name || 'Complete' }}</span>
        </div>
        
        <!-- Controls -->
        <div class="flex gap-2">
          <Button
            v-if="isPlaying"
            variant="outline"
            size="sm"
            @click="stopAnimation"
          >
            <Pause class="w-4 h-4 mr-1" />
            Pause
          </Button>
          <Button
            v-else
            size="sm"
            @click="startAnimation"
            :disabled="currentStopIndex >= stops.length - 1"
          >
            <Play class="w-4 h-4 mr-1" />
            {{ currentStopIndex >= stops.length - 1 ? 'Complete' : 'Start' }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="resetAnimation"
          >
            <RotateCcw class="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map
        :center="vehiclePosition"
        :zoom="13"
        class="h-full"
      >
        <MapRoute
          :coordinates="routePath"
          color="#3b82f6"
          :width="3"
          :opacity="0.6"
        />
        
        <!-- Stop markers -->
        <MapMarker
          v-for="(stop, index) in stops"
          :key="stop.name"
          :longitude="stop.position[0]"
          :latitude="stop.position[1]"
        >
          <MarkerContent>
            <div 
              class="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold"
              :class="stop.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'"
            >
              {{ index + 1 }}
            </div>
          </MarkerContent>
        </MapMarker>
        
        <!-- Vehicle marker -->
        <MapMarker
          :longitude="vehiclePosition[0]"
          :latitude="vehiclePosition[1]"
        >
          <MarkerContent>
            <div class="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
              <Package class="w-4 h-4 text-white" />
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      Delivery tracking simulation showing vehicle movement along a route with multiple stops.
      Progress tracking, ETA updates, and real-time position visualization.
    </p>
  </div>
</template>
