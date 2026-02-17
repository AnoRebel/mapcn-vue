<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { H3HexagonLayer } from "@deck.gl/geo-layers";

// Sample H3 hexagon data (using hex addresses)
// In production, you would convert lat/lng to H3 addresses
const h3Data = [
  { hex: "85283473fffffff", count: 100 },
  { hex: "85283471fffffff", count: 200 },
  { hex: "85283475fffffff", count: 150 },
  { hex: "85283477fffffff", count: 80 },
  { hex: "8528347bfffffff", count: 300 },
  { hex: "85283479fffffff", count: 120 },
  { hex: "85283463fffffff", count: 180 },
  { hex: "85283461fffffff", count: 90 },
];

const coverage = ref(0.8);
const elevationScale = ref(100);

const layers = computed(() => [
  markRaw(
    new H3HexagonLayer({
      id: "h3-hexagon-layer",
      data: h3Data,
      getHexagon: (d) => d.hex,
      getElevation: (d) => d.count * 10,
      getFillColor: (d) => [255, Math.max(0, 255 - d.count), 0],
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 1,
      elevationScale: elevationScale.value,
      coverage: coverage.value,
      extruded: true,
      pickable: true,
    }),
  ),
]);
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <!-- Controls -->
    <Card class="example-controls shrink-0">
      <CardContent class="p-4 space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Hexagon Coverage</span>
            <span class="text-sm text-muted-foreground"
              >{{ Math.round(coverage * 100) }}%</span
            >
          </div>
          <input
            v-model.number="coverage"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            class="w-full"
          />
        </div>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Elevation Scale</span>
            <span class="text-sm text-muted-foreground">{{
              elevationScale
            }}</span>
          </div>
          <input
            v-model.number="elevationScale"
            type="range"
            min="0"
            max="500"
            step="10"
            class="w-full"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="flex-1 min-h-[200px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-122.4, 37.8]" :zoom="12" :pitch="45" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>
  </div>
</template>
