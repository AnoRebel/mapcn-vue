<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import { useMap } from "~~/registry/map";

const { map, isLoaded } = useMap();
const pitch = ref(0);
const bearing = ref(0);

let cleanup: (() => void) | null = null;

// Watch for map load and attach listeners
const stopWatch = watch(
  () => isLoaded.value,
  (loaded) => {
    if (!loaded || !map.value) return;

    const updateCamera = () => {
      if (!map.value) return;
      pitch.value = Math.round(map.value.getPitch());
      bearing.value = Math.round(map.value.getBearing());
    };

    // Attach listener
    map.value.on("move", updateCamera);

    // Get initial values
    updateCamera();

    // Store cleanup function
    cleanup = () => {
      map.value?.off("move", updateCamera);
    };
  },
  { immediate: true },
);

onUnmounted(() => {
  stopWatch();
  if (cleanup) {
    cleanup();
  }
});
</script>

<template>
  <div
    class="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur rounded-lg p-3 shadow-lg border"
  >
    <div class="space-y-1 text-xs">
      <p>Pitch: {{ pitch }}°</p>
      <p>Bearing: {{ bearing }}°</p>
    </div>
  </div>
</template>
