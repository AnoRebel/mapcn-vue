<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Slider } from "~/components/ui/slider";
import { ArcLayer } from "@deck.gl/layers";

// Flight routes data — plain array, not frozen.
// deck.gl manages its own data; Object.freeze + Vue Proxy breaks invariants.
type FlightRoute = {
  source: [number, number];
  target: [number, number];
  passengers: number;
};

const flightRoutes: FlightRoute[] = [
  { source: [-74.006, 40.7128], target: [-0.1276, 51.5074], passengers: 500 },
  { source: [-74.006, 40.7128], target: [139.6917, 35.6895], passengers: 400 },
  {
    source: [-74.006, 40.7128],
    target: [151.2093, -33.8688],
    passengers: 300,
  },
  {
    source: [-74.006, 40.7128],
    target: [-43.1729, -22.9068],
    passengers: 250,
  },
  { source: [-74.006, 40.7128], target: [55.2708, 25.2048], passengers: 350 },
  { source: [-0.1276, 51.5074], target: [139.6917, 35.6895], passengers: 450 },
  {
    source: [-0.1276, 51.5074],
    target: [151.2093, -33.8688],
    passengers: 380,
  },
  {
    source: [-0.1276, 51.5074],
    target: [-43.1729, -22.9068],
    passengers: 320,
  },
  {
    source: [139.6917, 35.6895],
    target: [151.2093, -33.8688],
    passengers: 420,
  },
  { source: [139.6917, 35.6895], target: [55.2708, 25.2048], passengers: 280 },
];

const height = ref([1]);
const width = ref([2]);

const layers = computed(() => {
  const currentHeight = (height.value[0] ?? 1) * 0.5;
  const currentWidth = width.value[0] ?? 2;
  return [
    markRaw(
      new ArcLayer<FlightRoute>({
        id: "arc-layer",
        data: flightRoutes,
        getSourcePosition: (d) => d.source,
        getTargetPosition: (d) => d.target,
        getSourceColor: [255, 200, 0],
        getTargetColor: [0, 128, 255],
        getHeight: currentHeight,
        getWidth: (d) => Math.max(2, (d.passengers / 500) * currentWidth * 5),
        pickable: true,
        greatCircle: true,
        updateTriggers: {
          getHeight: currentHeight,
          getWidth: currentWidth,
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
      class="example-controls grid grid-cols-1 sm:grid-cols-2 gap-2 px-3 py-2 rounded-lg border bg-card shrink-0"
    >
      <div class="flex items-center gap-3">
        <span class="text-xs font-medium text-muted-foreground shrink-0"
          >Height</span
        >
        <Slider v-model="height" :min="0" :max="3" :step="0.1" class="flex-1" />
        <span
          class="text-xs tabular-nums text-muted-foreground w-8 text-right"
          >{{ height[0]?.toFixed(1) }}</span
        >
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs font-medium text-muted-foreground shrink-0"
          >Width</span
        >
        <Slider v-model="width" :min="1" :max="5" :step="0.5" class="flex-1" />
        <span
          class="text-xs tabular-nums text-muted-foreground w-8 text-right"
          >{{ width[0]?.toFixed(1) }}</span
        >
      </div>
    </div>

    <!-- Map -->
    <div class="flex-1 min-h-[200px] w-full rounded-lg overflow-hidden border">
      <Map :center="[0, 20]" :zoom="1.5" :pitch="30" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="false" />
      </Map>
    </div>
  </div>
</template>
