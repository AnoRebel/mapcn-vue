<script setup lang="ts">
import { ref, computed } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Slider } from "~/components/ui/slider";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";

// Generate random crime incident data - frozen to avoid Vue proxy issues
const crimeData = Object.freeze(
  Array.from({ length: 1000 }, () => ({
    position: [
      -74.006 + (Math.random() - 0.5) * 0.5,
      40.7128 + (Math.random() - 0.5) * 0.5,
    ] as [number, number],
    weight: Math.random() * 10,
  })),
);

type CrimePoint = { position: readonly [number, number]; weight: number };

const radius = ref([30]);
const intensity = ref([1]);
const threshold = ref([0.05]);

const layers = computed(() => {
  const currentRadius = radius.value[0] ?? 30;
  const currentIntensity = intensity.value[0] ?? 1;
  const currentThreshold = threshold.value[0] ?? 0.05;
  return [
    new HeatmapLayer({
      id: "heatmap-layer",
      data: crimeData as unknown as CrimePoint[],
      getPosition: (d: CrimePoint) => d.position as [number, number],
      getWeight: (d: CrimePoint) => d.weight,
      radiusPixels: currentRadius,
      intensity: currentIntensity,
      threshold: currentThreshold,
      colorRange: [
        [255, 255, 178],
        [254, 204, 92],
        [253, 141, 60],
        [240, 59, 32],
        [189, 0, 38],
      ],
      updateTriggers: {
        radiusPixels: currentRadius,
        intensity: currentIntensity,
        threshold: currentThreshold,
      },
    }),
  ];
});
</script>

<template>
  <div class="flex flex-col gap-3 h-full">
    <!-- Controls -->
    <div
      class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg border bg-card shrink-0"
    >
      <div class="flex items-center gap-3">
        <span class="text-xs font-medium text-muted-foreground shrink-0"
          >Radius</span
        >
        <Slider
          v-model="radius"
          :min="10"
          :max="100"
          :step="5"
          class="flex-1"
        />
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
          :min="0.5"
          :max="5"
          :step="0.5"
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
          :min="0"
          :max="0.5"
          :step="0.05"
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
      <Map :center="[-74.006, 40.7128]" :zoom="11" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>
  </div>
</template>
