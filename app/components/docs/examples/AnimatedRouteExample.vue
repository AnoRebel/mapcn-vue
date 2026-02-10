<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { Map, MapMarker, MapRoute, MarkerContent, MarkerPopup } from '~~/registry/map'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Play, Pause, RotateCcw, Car, Footprints, Train } from 'lucide-vue-next'

type TransportMode = 'driving' | 'walking' | 'commute'
type RouteStatus = 'idle' | 'playing' | 'paused' | 'completed'

interface RouteConfig {
  start: { lng: number; lat: number; name: string }
  end: { lng: number; lat: number; name: string }
  speed: number // km/h
}

const transportModes: Record<TransportMode, { icon: any; label: string; speed: number }> = {
  driving: { icon: Car, label: 'Driving', speed: 50 },
  walking: { icon: Footprints, label: 'Walking', speed: 5 },
  commute: { icon: Train, label: 'Commute', speed: 30 },
}

const mode = ref<TransportMode>('driving')
const status = ref<RouteStatus>('idle')
const progress = ref(0) // 0 to 100
const animationFrame = ref<number | null>(null)
const lastTimestamp = ref<number>(0)

const config = ref<RouteConfig>({
  start: { lng: -74.006, lat: 40.7128, name: 'New York' },
  end: { lng: -73.9857, lat: 40.7484, name: 'Empire State' },
  speed: 50,
})

// Calculate route distance (simplified haversine)
const routeDistance = computed(() => {
  const R = 6371 // Earth's radius in km
  const dLat = (config.value.end.lat - config.value.start.lat) * Math.PI / 180
  const dLon = (config.value.end.lng - config.value.start.lng) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(config.value.start.lat * Math.PI / 180) * Math.cos(config.value.end.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
})

const currentSpeed = computed(() => transportModes[mode.value].speed)
const estimatedTime = computed(() => {
  const hours = routeDistance.value / currentSpeed.value
  const minutes = Math.round(hours * 60)
  return minutes
})

// Current position based on progress
const currentPosition = computed(() => {
  const t = progress.value / 100
  return {
    lng: config.value.start.lng + (config.value.end.lng - config.value.start.lng) * t,
    lat: config.value.start.lat + (config.value.end.lat - config.value.start.lat) * t,
  }
})

function startAnimation() {
  if (status.value === 'completed') {
    progress.value = 0
  }
  status.value = 'playing'
  lastTimestamp.value = performance.now()
  animate()
}

function pauseAnimation() {
  status.value = 'paused'
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
}

function resetAnimation() {
  status.value = 'idle'
  progress.value = 0
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
}

function animate() {
  if (status.value !== 'playing') return

  const now = performance.now()
  const deltaTime = (now - lastTimestamp.value) / 1000 // seconds
  lastTimestamp.value = now

  // Calculate progress increment based on speed and distance
  const distanceKm = routeDistance.value
  const speedKmS = currentSpeed.value / 3600 // km/s
  const progressIncrement = (speedKmS * deltaTime / distanceKm) * 100

  progress.value = Math.min(progress.value + progressIncrement, 100)

  if (progress.value >= 100) {
    status.value = 'completed'
    return
  }

  animationFrame.value = requestAnimationFrame(animate)
}

function updateConfig() {
  resetAnimation()
}

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }
})

const TransportIcon = computed(() => transportModes[mode.value].icon)
</script>

<template>
  <div class="space-y-4">
    <!-- Configuration Panel -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-sm font-medium">Route Configuration</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Start Location -->
          <div class="space-y-2">
            <Label class="text-xs">Start Location</Label>
            <div class="flex gap-2">
              <Input
                v-model="config.start.name"
                placeholder="Name"
                class="h-8 text-sm"
                @blur="updateConfig"
              />
            </div>
            <div class="flex gap-2">
              <Input
                v-model.number="config.start.lng"
                placeholder="Longitude"
                class="h-8 text-sm"
                type="number"
                step="0.0001"
                @blur="updateConfig"
              />
              <Input
                v-model.number="config.start.lat"
                placeholder="Latitude"
                class="h-8 text-sm"
                type="number"
                step="0.0001"
                @blur="updateConfig"
              />
            </div>
          </div>

          <!-- End Location -->
          <div class="space-y-2">
            <Label class="text-xs">End Location</Label>
            <div class="flex gap-2">
              <Input
                v-model="config.end.name"
                placeholder="Name"
                class="h-8 text-sm"
                @blur="updateConfig"
              />
            </div>
            <div class="flex gap-2">
              <Input
                v-model.number="config.end.lng"
                placeholder="Longitude"
                class="h-8 text-sm"
                type="number"
                step="0.0001"
                @blur="updateConfig"
              />
              <Input
                v-model.number="config.end.lat"
                placeholder="Latitude"
                class="h-8 text-sm"
                type="number"
                step="0.0001"
                @blur="updateConfig"
              />
            </div>
          </div>
        </div>

        <!-- Transport Mode -->
        <div class="flex flex-wrap items-center gap-4">
          <div class="space-y-1">
            <Label class="text-xs">Transport Mode</Label>
            <Select v-model="mode" @update:model-value="resetAnimation">
              <SelectTrigger class="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="(info, key) in transportModes" :key="key" :value="key">
                  <div class="flex items-center gap-2">
                    <component :is="info.icon" class="w-4 h-4" />
                    {{ info.label }}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Stats -->
          <div class="text-xs text-muted-foreground space-y-0.5">
            <div>Distance: {{ routeDistance.toFixed(2) }} km</div>
            <div>Est. Time: {{ estimatedTime }} min</div>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-2 ml-auto">
            <Button
              v-if="status === 'playing'"
              variant="outline"
              size="sm"
              class="h-8 gap-1"
              @click="pauseAnimation"
            >
              <Pause class="w-4 h-4" />
              Pause
            </Button>
            <Button
              v-else
              variant="default"
              size="sm"
              class="h-8 gap-1"
              @click="startAnimation"
              :disabled="status === 'completed'"
            >
              <Play class="w-4 h-4" />
              {{ status === 'completed' ? 'Done' : status === 'paused' ? 'Resume' : 'Start' }}
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="h-8 gap-1"
              @click="resetAnimation"
            >
              <RotateCcw class="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-muted-foreground">Progress</span>
            <span class="font-medium">{{ Math.round(progress) }}%</span>
          </div>
          <div class="h-2 bg-muted rounded-full overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-100 ease-linear"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map
        :center="[currentPosition.lng, currentPosition.lat]"
        :zoom="13"
        class="h-full"
      >
        <!-- Route Line -->
        <MapRoute
          :coordinates="[
            [config.start.lng, config.start.lat],
            [config.end.lng, config.end.lat],
          ]"
          color="#3b82f6"
          :width="4"
        />

        <!-- Start Marker -->
        <MapMarker
          :longitude="config.start.lng"
          :latitude="config.start.lat"
        >
          <MarkerContent>
            <div class="w-8 h-8 rounded-full bg-green-500 border-2 border-white shadow-lg flex items-center justify-center">
              <span class="text-white text-xs font-bold">A</span>
            </div>
          </MarkerContent>
          <MarkerPopup>
            <div class="font-medium">{{ config.start.name }}</div>
            <div class="text-xs text-muted-foreground">Start Point</div>
          </MarkerPopup>
        </MapMarker>

        <!-- End Marker -->
        <MapMarker
          :longitude="config.end.lng"
          :latitude="config.end.lat"
        >
          <MarkerContent>
            <div class="w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center">
              <span class="text-white text-xs font-bold">B</span>
            </div>
          </MarkerContent>
          <MarkerPopup>
            <div class="font-medium">{{ config.end.name }}</div>
            <div class="text-xs text-muted-foreground">Destination</div>
          </MarkerPopup>
        </MapMarker>

        <!-- Animated Vehicle/Person Marker -->
        <MapMarker
          v-if="status !== 'idle'"
          :longitude="currentPosition.lng"
          :latitude="currentPosition.lat"
          :rotation="Math.atan2(
            config.end.lat - config.start.lat,
            config.end.lng - config.start.lng
          ) * 180 / Math.PI"
        >
          <MarkerContent>
            <div class="w-8 h-8 rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
              <component :is="TransportIcon" class="w-4 h-4 text-primary-foreground" />
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  </div>
</template>
