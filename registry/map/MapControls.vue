<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { Plus, Minus, Locate, Maximize, Loader2 } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useMap } from './composables/useMap'

const props = withDefaults(defineProps<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showZoom?: boolean
  showCompass?: boolean
  showLocate?: boolean
  showFullscreen?: boolean
  class?: string
  onLocate?: (coords: { longitude: number; latitude: number }) => void
}>(), {
  position: 'bottom-right',
  showZoom: true,
  showCompass: false,
  showLocate: false,
  showFullscreen: false,
})

const { map, isLoaded } = useMap()
const waitingForLocation = ref(false)

// Compass rotation state
const bearing = ref(0)
const pitch = ref(0)

let cleanupCompass: (() => void) | null = null

// Update compass rotation when map moves
const stopWatch = watch(() => isLoaded.value, (loaded) => {
  if (!loaded || !map.value) return
  
  const updateRotation = () => {
    if (!map.value) return
    bearing.value = map.value.getBearing()
    pitch.value = map.value.getPitch()
  }
  
  map.value.on('move', updateRotation)
  updateRotation() // Initial value
  
  cleanupCompass = () => {
    map.value?.off('move', updateRotation)
  }
}, { immediate: true })

onUnmounted(() => {
  stopWatch()
  if (cleanupCompass) {
    cleanupCompass()
  }
})

const positionClasses = {
  'top-left': 'top-2 left-2',
  'top-right': 'top-2 right-2',
  'bottom-left': 'bottom-2 left-2',
  'bottom-right': 'bottom-10 right-2',
}

function handleZoomIn() {
  map.value?.zoomTo(map.value.getZoom() + 1, { duration: 300 })
}

function handleZoomOut() {
  map.value?.zoomTo(map.value.getZoom() - 1, { duration: 300 })
}

function handleResetBearing() {
  map.value?.resetNorthPitch({ duration: 300 })
}

const locationError = ref<string | null>(null)

function handleLocate() {
  waitingForLocation.value = true
  locationError.value = null
  
  if (!('geolocation' in navigator)) {
    locationError.value = 'Geolocation not supported'
    waitingForLocation.value = false
    console.error('Geolocation is not supported by this browser')
    return
  }
  
  let attempts = 0
  const maxAttempts = 2
  
  // Try to get position with fallback strategy
  const tryGetPosition = (highAccuracy: boolean) => {
    attempts++
    console.log(`Geolocation attempt ${attempts}/${maxAttempts} (highAccuracy: ${highAccuracy})`)
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log('Geolocation success:', pos.coords.latitude, pos.coords.longitude)
        const coords = {
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        }
        map.value?.flyTo({
          center: [coords.longitude, coords.latitude],
          zoom: 14,
          duration: 1500,
        })
        props.onLocate?.(coords)
        waitingForLocation.value = false
      },
      (error) => {
        console.log(`Geolocation attempt ${attempts} failed:`, error.code, error.message)
        
        // Try fallback if we haven't exceeded max attempts
        if (attempts < maxAttempts) {
          console.log('Trying fallback geolocation without high accuracy...')
          // Don't wait, try immediately
          tryGetPosition(false)
          return
        }
        
        // All attempts failed
        waitingForLocation.value = false
        let errorMsg = 'Unable to retrieve your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location access denied. Please enable location permissions in your browser.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location unavailable. Try using a mobile device with GPS.'
            break
          case error.TIMEOUT:
            errorMsg = 'Location timed out. Try again or check your device settings.'
            break
          default:
            errorMsg = `Location error: ${error.message || 'Unknown error'}`
        }
        
        locationError.value = errorMsg
        console.error('Geolocation error:', errorMsg, error)
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: 5000, // Short 5s timeout for both attempts
        maximumAge: Infinity, // Accept any cached position
      }
    )
  }
  
  // Start with high accuracy
  tryGetPosition(true)
}

function handleFullscreen() {
  const container = map.value?.getContainer()
  if (!container) return
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    container.requestFullscreen()
  }
}
</script>

<template>
  <div
    :class="cn(
      'absolute z-10 flex flex-col gap-1.5',
      positionClasses[props.position],
      props.class
    )"
  >
    <!-- Zoom Controls -->
    <div v-if="showZoom" class="flex flex-col rounded-md border border-border bg-background shadow-sm overflow-hidden">
      <button
        @click="handleZoomIn"
        class="flex items-center justify-center size-8 hover:bg-accent dark:hover:bg-accent/40 transition-colors"
        aria-label="Zoom in"
      >
        <Plus class="size-4" />
      </button>
      <button
        @click="handleZoomOut"
        class="flex items-center justify-center size-8 hover:bg-accent dark:hover:bg-accent/40 transition-colors border-t border-border"
        aria-label="Zoom out"
      >
        <Minus class="size-4" />
      </button>
    </div>

    <!-- Compass -->
    <div v-if="showCompass" class="flex flex-col rounded-md border border-border bg-background shadow-sm overflow-hidden">
      <button
        @click="handleResetBearing"
        class="flex items-center justify-center size-8 hover:bg-accent dark:hover:bg-accent/40 transition-colors"
        aria-label="Reset bearing to north"
      >
        <svg
          viewBox="0 0 24 24"
          class="size-5 transition-transform duration-200"
          :style="{ transform: `rotateX(${pitch}deg) rotateZ(${-bearing}deg)` }"
        >
          <path d="M12 2L16 12H12V2Z" class="fill-red-500" />
          <path d="M12 2L8 12H12V2Z" class="fill-red-300" />
          <path d="M12 22L16 12H12V22Z" class="fill-muted-foreground/60" />
          <path d="M12 22L8 12H12V22Z" class="fill-muted-foreground/30" />
        </svg>
      </button>
    </div>

    <!-- Locate -->
    <div v-if="showLocate" class="flex flex-col rounded-md border border-border bg-background shadow-sm overflow-hidden">
      <button
        @click="handleLocate"
        :disabled="waitingForLocation"
        class="flex items-center justify-center size-8 hover:bg-accent dark:hover:bg-accent/40 transition-colors disabled:opacity-50"
        aria-label="Find my location"
      >
        <Loader2 v-if="waitingForLocation" class="size-4 animate-spin" />
        <Locate v-else class="size-4" />
      </button>
    </div>

    <!-- Fullscreen -->
    <div v-if="showFullscreen" class="flex flex-col rounded-md border border-border bg-background shadow-sm overflow-hidden">
      <button
        @click="handleFullscreen"
        class="flex items-center justify-center size-8 hover:bg-accent dark:hover:bg-accent/40 transition-colors"
        aria-label="Toggle fullscreen"
      >
        <Maximize class="size-4" />
      </button>
    </div>
  </div>
</template>
