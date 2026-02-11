<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { TripsLayer } from "@deck.gl/geo-layers";
import { Play, Pause, RotateCcw } from "lucide-vue-next";

// Animated trip data
const trips = [
  {
    path: [
      [-74.01, 40.71],
      [-74.0, 40.72],
      [-73.99, 40.73],
      [-73.98, 40.74],
      [-73.97, 40.75],
    ],
    timestamps: [0, 50, 100, 150, 200],
    color: [255, 100, 100],
  },
  {
    path: [
      [-73.98, 40.7],
      [-73.97, 40.71],
      [-73.96, 40.72],
      [-73.95, 40.73],
      [-73.94, 40.74],
    ],
    timestamps: [20, 70, 120, 170, 220],
    color: [100, 255, 100],
  },
  {
    path: [
      [-74.02, 40.73],
      [-74.01, 40.74],
      [-74.0, 40.75],
      [-73.99, 40.76],
      [-73.98, 40.77],
    ],
    timestamps: [40, 90, 140, 190, 240],
    color: [100, 100, 255],
  },
];

const isPlaying = ref(false);
const time = ref(0);
const loopLength = 300;
const speed = ref(1);
let animationFrame: number;

function animate() {
  if (!isPlaying.value) return;
  time.value = (time.value + speed.value) % loopLength;
  animationFrame = requestAnimationFrame(animate);
}

function togglePlay() {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) animate();
}

function reset() {
  isPlaying.value = false;
  time.value = 0;
}

onMounted(() => {
  isPlaying.value = true;
  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrame);
});

const layers = computed(() => [
  new TripsLayer({
    id: "trips-layer",
    data: trips,
    getPath: (d) => d.path,
    getTimestamps: (d) => d.timestamps,
    getColor: (d) => d.color,
    opacity: 0.8,
    widthMinPixels: 4,
    widthMaxPixels: 10,
    trailLength: 50,
    currentTime: time.value,
    fadeTrail: true,
    rounded: true,
  }),
]);
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="flex gap-2">
          <Button
            v-if="isPlaying"
            variant="outline"
            size="sm"
            @click="togglePlay"
          >
            <Pause class="w-4 h-4 mr-1" />
            Pause
          </Button>
          <Button v-else size="sm" @click="togglePlay">
            <Play class="w-4 h-4 mr-1" />
            Play
          </Button>
          <Button variant="outline" size="sm" @click="reset">
            <RotateCcw class="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        <div class="space-y-2">
          <span class="text-sm font-medium">Animation Speed</span>
          <input
            v-model.number="speed"
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            class="w-full"
          />
          <span class="text-xs text-muted-foreground">{{ speed }}x</span>
        </div>

        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span>Progress</span>
            <span>{{ Math.round((time / loopLength) * 100) }}%</span>
          </div>
          <div class="h-2 bg-muted rounded-full overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all"
              :style="{ width: `${(time / loopLength) * 100}%` }"
            />
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-73.98, 40.74]" :zoom="12" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      TripsLayer renders animated paths with timestamp-based trails. Perfect for
      visualizing vehicle movements, GPS tracks, or any time-series trajectory
      data.
    </p>
  </div>
</template>
