<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Slider } from "~/components/ui/slider";
import { ScreenGridLayer } from "@deck.gl/aggregation-layers";

// San Francisco incident data with clustered distribution
function generateScreenGridData(count: number) {
  const clusters = [
    { center: [-122.42, 37.78], spread: 0.015, weight: 0.3 },
    { center: [-122.41, 37.785], spread: 0.01, weight: 0.25 },
    { center: [-122.405, 37.79], spread: 0.008, weight: 0.15 },
    { center: [-122.43, 37.77], spread: 0.012, weight: 0.15 },
    { center: [-122.395, 37.795], spread: 0.006, weight: 0.1 },
    { center: [-122.44, 37.775], spread: 0.008, weight: 0.05 },
  ];

  const points: { position: [number, number]; weight: number }[] = [];

  for (let i = 0; i < count; i++) {
    let r = Math.random();
    let cluster = clusters[0]!;
    for (const c of clusters) {
      r -= c.weight;
      if (r <= 0) {
        cluster = c;
        break;
      }
    }

    const u1 = Math.random();
    const u2 = Math.random();
    const z0 =
      Math.sqrt(-2 * Math.log(u1 || 0.001)) * Math.cos(2 * Math.PI * u2);
    const z1 =
      Math.sqrt(-2 * Math.log(u1 || 0.001)) * Math.sin(2 * Math.PI * u2);

    points.push({
      position: [
        cluster.center[0]! + z0 * cluster.spread,
        cluster.center[1]! + z1 * cluster.spread,
      ] as [number, number],
      weight: 1 + Math.random() * 5,
    });
  }

  return points;
}

const screenGridData = generateScreenGridData(5000);

const cellSizePixels = ref([40]);

const layers = computed(() => [
  markRaw(
    new ScreenGridLayer({
      id: "screen-grid-layer",
      data: screenGridData,
      getPosition: (d: (typeof screenGridData)[0]) => d.position,
      getWeight: (d: (typeof screenGridData)[0]) => d.weight,
      cellSizePixels: cellSizePixels.value[0] ?? 40,
      cellMarginPixels: 2,
      colorRange: [
        [255, 255, 204],
        [254, 217, 118],
        [254, 178, 76],
        [253, 141, 60],
        [252, 78, 42],
        [227, 26, 28],
      ],
      gpuAggregation: false,
      aggregation: "SUM",
      opacity: 0.8,
      updateTriggers: {
        cellSizePixels: cellSizePixels.value[0],
      },
    }),
  ),
]);
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <!-- Controls -->
    <div
      class="example-controls flex items-center gap-3 px-3 py-2 rounded-lg border bg-card shrink-0"
    >
      <span class="text-xs font-medium text-muted-foreground shrink-0"
        >Cell Size</span
      >
      <Slider
        v-model="cellSizePixels"
        :min="10"
        :max="100"
        :step="5"
        class="flex-1"
      />
      <span class="text-xs tabular-nums text-muted-foreground w-10 text-right"
        >{{ cellSizePixels[0] }}px</span
      >
    </div>

    <!-- Map -->
    <div class="flex-1 min-h-[200px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-122.4, 37.78]" :zoom="11" theme="dark" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="false" />
      </Map>
    </div>
  </div>
</template>
