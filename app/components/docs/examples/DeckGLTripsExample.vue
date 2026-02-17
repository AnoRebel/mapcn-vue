<script setup lang="ts">
import { ref, computed, markRaw, onMounted, onUnmounted } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import { TripsLayer } from "@deck.gl/geo-layers";
import { Play, Pause, RotateCcw } from "lucide-vue-next";

// Real NYC taxi trip data from deck.gl
const DATA_URL =
  "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json";

interface Trip {
  path: [number, number][];
  timestamps: number[];
  vendor: number;
}

const tripsData = ref<Trip[]>([]);
const currentTime = ref(0);
const loopLength = 1800;
const animationSpeed = ref([30]);
const isPlaying = ref(false);
let animationFrame: number;
let lastTime = 0;

function animate(timestamp: number) {
  if (!isPlaying.value) return;
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  const speed = animationSpeed.value[0] ?? 30;
  currentTime.value = (currentTime.value + (delta / 1000) * speed) % loopLength;
  animationFrame = requestAnimationFrame(animate);
}

function togglePlay() {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    lastTime = 0;
    animationFrame = requestAnimationFrame(animate);
  }
}

function reset() {
  isPlaying.value = false;
  currentTime.value = 0;
  lastTime = 0;
}

onMounted(async () => {
  try {
    const response = await fetch(DATA_URL);
    const data: Trip[] = await response.json();
    // Sample ~100 trips for performance
    const step = Math.max(1, Math.floor(data.length / 100));
    tripsData.value = data.filter((_, i) => i % step === 0).slice(0, 100);
  } catch (error) {
    console.error("Failed to fetch trips data:", error);
  }

  isPlaying.value = true;
  lastTime = 0;
  animationFrame = requestAnimationFrame(animate);
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
});

const layers = computed(() => {
  if (tripsData.value.length === 0) return [];
  return [
    markRaw(
      new TripsLayer<Trip>({
        id: "trips-layer",
        data: tripsData.value,
        getPath: (d) => d.path,
        getTimestamps: (d) => d.timestamps,
        // Orange for vendor 0, teal for vendor 1
        getColor: (d) =>
          d.vendor === 0
            ? [253, 128, 93]
            : ([23, 184, 190] as [number, number, number]),
        currentTime: currentTime.value,
        trailLength: 180,
        fadeTrail: true,
        widthMinPixels: 3,
        capRounded: true,
        jointRounded: true,
        opacity: 0.8,
      }),
    ),
  ];
});
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <!-- Controls -->
    <div
      class="example-controls flex items-center gap-3 px-3 py-2 rounded-lg border bg-card shrink-0"
    >
      <Button
        v-if="isPlaying"
        variant="outline"
        size="sm"
        class="shrink-0"
        @click="togglePlay"
      >
        <Pause class="size-3.5" />
      </Button>
      <Button v-else size="sm" class="shrink-0" @click="togglePlay">
        <Play class="size-3.5" />
      </Button>
      <Button variant="outline" size="sm" class="shrink-0" @click="reset">
        <RotateCcw class="size-3.5" />
      </Button>

      <span class="text-xs font-medium text-muted-foreground shrink-0"
        >Speed</span
      >
      <Slider
        v-model="animationSpeed"
        :min="5"
        :max="100"
        :step="5"
        class="flex-1"
      />
      <span class="text-xs tabular-nums text-muted-foreground w-8 text-right"
        >{{ animationSpeed[0] }}x</span
      >
    </div>

    <!-- Map -->
    <div class="flex-1 min-h-[200px] w-full rounded-lg overflow-hidden border">
      <Map
        :center="[-74.0, 40.72]"
        :zoom="12"
        :pitch="45"
        theme="dark"
        class="h-full"
      >
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>
  </div>
</template>
