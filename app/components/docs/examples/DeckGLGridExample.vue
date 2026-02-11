<script setup lang="ts">
import { ref, computed } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { GridLayer } from "@deck.gl/aggregation-layers";

// Generate crime incident data
const incidents = Array.from({ length: 5000 }, () => ({
  position: [
    -74.006 + (Math.random() - 0.5) * 0.2,
    40.7128 + (Math.random() - 0.5) * 0.2,
  ],
}));

const cellSize = ref(100);
const elevationScale = ref(10);
const coverage = ref(0.9);

const layers = computed(() => [
  new GridLayer({
    id: "grid-layer",
    data: incidents,
    getPosition: (d) => d.position,
    cellSize: cellSize.value,
    elevationScale: elevationScale.value,
    coverage: coverage.value,
    extruded: true,
    colorRange: [
      [255, 255, 204],
      [255, 237, 160],
      [254, 217, 118],
      [254, 178, 76],
      [253, 141, 60],
      [252, 78, 42],
      [227, 26, 28],
      [177, 0, 38],
    ],
    pickable: true,
  }),
]);
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 grid grid-cols-3 gap-4">
        <div class="space-y-2">
          <span class="text-sm font-medium">Cell Size</span>
          <input
            v-model.number="cellSize"
            type="range"
            min="50"
            max="500"
            step="25"
            class="w-full"
          />
          <span class="text-xs text-muted-foreground">{{ cellSize }}m</span>
        </div>
        <div class="space-y-2">
          <span class="text-sm font-medium">Elevation</span>
          <input
            v-model.number="elevationScale"
            type="range"
            min="0"
            max="50"
            step="5"
            class="w-full"
          />
          <span class="text-xs text-muted-foreground"
            >{{ elevationScale }}x</span
          >
        </div>
        <div class="space-y-2">
          <span class="text-sm font-medium">Coverage</span>
          <input
            v-model.number="coverage"
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            class="w-full"
          />
          <span class="text-xs text-muted-foreground"
            >{{ Math.round(coverage * 100) }}%</span
          >
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-74.006, 40.7128]" :zoom="13" :pitch="45" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      GridLayer aggregates points into square grid cells. Similar to
      HexagonLayer but uses square bins instead. Great for urban planning and
      hotspot analysis with 3D elevation.
    </p>
  </div>
</template>
