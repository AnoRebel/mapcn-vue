<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { MapboxOverlay } from '@deck.gl/mapbox'
import type { Layer } from '@deck.gl/core'
import { useMap } from './composables/useMap'

const props = withDefaults(defineProps<{
  layers: Layer[]
  interleaved?: boolean
}>(), {
  interleaved: true,
})

const { map, isLoaded } = useMap()
const overlayRef = ref<MapboxOverlay | null>(null)
const isSetup = ref(false)

function setupOverlay() {
  if (!map.value || isSetup.value) return

  const overlay = new MapboxOverlay({
    interleaved: props.interleaved,
    layers: props.layers,
  })

  map.value.addControl(overlay)
  overlayRef.value = overlay
  isSetup.value = true
}

function cleanupOverlay() {
  if (!map.value || !isSetup.value || !overlayRef.value) return

  try {
    map.value.removeControl(overlayRef.value)
  } catch {
    // ignore
  }

  overlayRef.value = null
  isSetup.value = false
}

function updateLayers() {
  if (!overlayRef.value) return
  overlayRef.value.setProps({ layers: props.layers })
}

onMounted(() => {
  if (isLoaded.value) {
    setupOverlay()
  } else {
    const unwatch = watch(isLoaded, (loaded) => {
      if (loaded) {
        setupOverlay()
        unwatch()
      }
    })
  }
})

onUnmounted(cleanupOverlay)

// Watch for layer changes
watch(() => props.layers, updateLayers, { deep: true })
</script>


