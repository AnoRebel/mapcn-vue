<script setup lang="ts">
import { ref, computed } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Slider } from "~/components/ui/slider";
import { ScatterplotLayer } from "@deck.gl/layers";

// NYC taxi pickup locations (sample data) - plain object, not reactive
const taxiData = Object.freeze([
  { position: [-74.006, 40.7128], pickups: 500 },
  { position: [-73.9857, 40.7484], pickups: 800 },
  { position: [-73.9654, 40.7829], pickups: 600 },
  { position: [-73.9442, 40.6782], pickups: 400 },
  { position: [-74.0445, 40.6892], pickups: 350 },
  { position: [-73.9772, 40.7527], pickups: 900 },
  { position: [-73.9632, 40.7794], pickups: 550 },
  { position: [-73.9969, 40.7061], pickups: 450 },
  { position: [-74.0092, 40.7251], pickups: 300 },
  { position: [-73.9712, 40.7614], pickups: 700 },
]);

const radius = ref([1000]);
const opacity = ref([0.8]);
const hoverInfo = ref("");

const layers = computed(() => {
  const currentOpacity = opacity.value[0] ?? 0.8;
  const currentRadius = radius.value[0] ?? 1000;
  return [
    new ScatterplotLayer({
      id: "scatterplot-layer",
      data: taxiData as unknown as Array<{
        position: number[];
        pickups: number;
      }>,
      getPosition: (d: { position: number[]; pickups: number }) =>
        d.position as [number, number],
      getRadius: (d: { position: number[]; pickups: number }) =>
        Math.sqrt(d.pickups) * 30,
      getFillColor: [255, 99, 71],
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 2,
      radiusMinPixels: 5,
      radiusMaxPixels: 100,
      stroked: true,
      filled: true,
      opacity: currentOpacity,
      radiusScale: currentRadius / 1000,
      pickable: true,
      onHover: (info: { object?: { pickups: number } }) => {
        if (info.object) {
          hoverInfo.value = `Pickups: ${info.object.pickups}`;
        } else {
          hoverInfo.value = "";
        }
      },
      updateTriggers: {
        opacity: currentOpacity,
        radiusScale: currentRadius,
      },
    }),
  ];
});
</script>

<template>
  <div class="flex flex-col gap-3 h-full">
    <!-- Controls -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg border bg-card shrink-0"
    >
      <div class="flex items-center gap-3">
        <span class="text-xs font-medium text-muted-foreground shrink-0"
          >Radius</span
        >
        <Slider
          v-model="radius"
          :min="100"
          :max="5000"
          :step="100"
          class="flex-1"
        />
        <span class="text-xs tabular-nums text-muted-foreground w-12 text-right"
          >{{ radius[0] }}m</span
        >
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs font-medium text-muted-foreground shrink-0"
          >Opacity</span
        >
        <Slider
          v-model="opacity"
          :min="0.1"
          :max="1"
          :step="0.1"
          class="flex-1"
        />
        <span class="text-xs tabular-nums text-muted-foreground w-10 text-right"
          >{{ Math.round((opacity[0] ?? 0.8) * 100) }}%</span
        >
      </div>
    </div>

    <!-- Map -->
    <div
      class="relative flex-1 min-h-[200px] w-full rounded-lg overflow-hidden border"
    >
      <Map :center="[-73.98, 40.75]" :zoom="11" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
      <!-- Hover tooltip -->
      <div
        v-if="hoverInfo"
        class="absolute top-2 left-2 text-xs bg-background/90 backdrop-blur border rounded px-2 py-1 shadow-sm"
      >
        {{ hoverInfo }}
      </div>
    </div>
  </div>
</template>
