<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Slider } from "~/components/ui/slider";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";

// San Francisco incident data — scattered clusters with organic spread
// Fewer points with varied weights for distinct glowing hotspots
function generateHeatmapData(count: number) {
  const clusters = [
    { center: [-122.41, 37.785] as const, spread: 0.008, weight: 0.25 }, // Tenderloin / Civic Center
    { center: [-122.405, 37.79] as const, spread: 0.006, weight: 0.15 }, // Union Square
    { center: [-122.42, 37.775] as const, spread: 0.012, weight: 0.15 }, // SoMa
    { center: [-122.43, 37.77] as const, spread: 0.008, weight: 0.1 }, // Mission
    { center: [-122.395, 37.795] as const, spread: 0.005, weight: 0.08 }, // Financial District
    { center: [-122.435, 37.795] as const, spread: 0.007, weight: 0.07 }, // Pacific Heights edge
    { center: [-122.415, 37.765] as const, spread: 0.006, weight: 0.05 }, // South of Market
    { center: [-122.445, 37.775] as const, spread: 0.005, weight: 0.05 }, // Haight
    { center: [-122.39, 37.77] as const, spread: 0.005, weight: 0.05 }, // Potrero
    { center: [-122.425, 37.8] as const, spread: 0.004, weight: 0.05 }, // Marina
  ];

  const points: { position: [number, number]; weight: number }[] = [];

  for (let i = 0; i < count; i++) {
    // Pick a cluster based on weight distribution
    let r = Math.random();
    let cluster = clusters[0]!;
    for (const c of clusters) {
      r -= c.weight;
      if (r <= 0) {
        cluster = c;
        break;
      }
    }

    // Gaussian-like distribution around cluster center (Box-Muller)
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 =
      Math.sqrt(-2 * Math.log(u1 || 0.001)) * Math.cos(2 * Math.PI * u2);
    const z1 =
      Math.sqrt(-2 * Math.log(u1 || 0.001)) * Math.sin(2 * Math.PI * u2);

    const lng = cluster.center[0] + z0 * cluster.spread;
    const lat = cluster.center[1] + z1 * cluster.spread;

    points.push({
      position: [lng, lat],
      weight: 0.2 + Math.random() * 2,
    });
  }

  return points;
}

// Plain array — NOT reactive, NOT frozen.
// deck.gl layers manage their own data; Vue proxies break frozen invariants.
const crimeData: { position: [number, number]; weight: number }[] =
  generateHeatmapData(1000);

const radius = ref([20]);
const intensity = ref([1.5]);
const threshold = ref([0.08]);

const layers = computed(() => {
  const currentRadius = radius.value[0] ?? 25;
  const currentIntensity = intensity.value[0] ?? 1;
  const currentThreshold = threshold.value[0] ?? 0.05;
  return [
    markRaw(
      new HeatmapLayer<{ position: [number, number]; weight: number }>({
        id: "heatmap-layer",
        data: crimeData,
        getPosition: (d) => d.position,
        getWeight: (d) => d.weight,
        radiusPixels: currentRadius,
        intensity: currentIntensity,
        threshold: currentThreshold,
        // Warm glow palette: yellow-green → yellow → orange → red-orange
        colorRange: [
          [255, 255, 178],
          [254, 217, 118],
          [254, 178, 76],
          [253, 141, 60],
          [240, 59, 32],
          [189, 0, 38],
        ],
        weightsTextureSize: 2048,
        updateTriggers: {
          radiusPixels: currentRadius,
          intensity: currentIntensity,
          threshold: currentThreshold,
        },
      }),
    ),
  ];
});
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <!-- Controls -->
    <div
      class="example-controls grid grid-cols-1 sm:grid-cols-3 gap-2 px-3 py-2 rounded-lg border bg-card shrink-0"
    >
      <div class="flex items-center gap-3">
        <span class="text-xs font-medium text-muted-foreground shrink-0"
          >Radius</span
        >
        <Slider v-model="radius" :min="5" :max="60" :step="1" class="flex-1" />
        <span class="text-xs tabular-nums text-muted-foreground w-10 text-right"
          >{{ radius[0] }}px</span
        >
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs font-medium text-muted-foreground shrink-0"
          >Intensity</span
        >
        <Slider
          v-model="intensity"
          :min="0.1"
          :max="5"
          :step="0.1"
          class="flex-1"
        />
        <span
          class="text-xs tabular-nums text-muted-foreground w-8 text-right"
          >{{ intensity[0] }}</span
        >
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs font-medium text-muted-foreground shrink-0"
          >Threshold</span
        >
        <Slider
          v-model="threshold"
          :min="0.01"
          :max="0.5"
          :step="0.01"
          class="flex-1"
        />
        <span
          class="text-xs tabular-nums text-muted-foreground w-10 text-right"
          >{{ threshold[0]?.toFixed(2) }}</span
        >
      </div>
    </div>

    <!-- Map -->
    <div class="flex-1 min-h-[200px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-122.415, 37.78]" :zoom="12" theme="dark" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="false" />
      </Map>
    </div>
  </div>
</template>
