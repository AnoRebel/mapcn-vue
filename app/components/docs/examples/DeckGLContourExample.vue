<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { ContourLayer } from "@deck.gl/aggregation-layers";

// Elevation data points
const elevationData = Array.from({ length: 1000 }, (_, i) => {
  const angle = (i / 1000) * Math.PI * 2;
  const radius = 0.05 + Math.random() * 0.05;
  return {
    position: [
      -74.006 + Math.cos(angle) * radius,
      40.7128 + Math.sin(angle) * radius,
    ],
    elevation: Math.random() * 100,
  };
});

const cellSize = ref(100);
const contours = ref([
  { threshold: 10, color: [0, 100, 0], strokeWidth: 2 },
  { threshold: 25, color: [50, 150, 50], strokeWidth: 2 },
  { threshold: 50, color: [100, 200, 100], strokeWidth: 2 },
  { threshold: 75, color: [150, 220, 150], strokeWidth: 2 },
]);

const layers = computed(() => [
  markRaw(
    new ContourLayer({
      id: "contour-layer",
      data: elevationData,
      getPosition: (d) => d.position,
      getWeight: (d) => d.elevation,
      cellSize: cellSize.value,
      // @ts-expect-error deck.gl Contour color type mismatch
      contours: contours.value,
      pickable: true,
    }),
  ),
]);
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <!-- Controls -->
    <Card class="example-controls py-1 shrink-0">
      <CardContent class="p-4 space-y-1">
        <div class="space-y-1">
          <span class="text-sm font-medium">Cell Size</span>
          <input
            v-model.number="cellSize"
            type="range"
            min="50"
            max="200"
            step="10"
            class="w-full"
          />
          <span class="text-xs text-muted-foreground">{{ cellSize }}m</span>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="flex-1 min-h-[200px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-74.006, 40.7128]" :zoom="14" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="false" />
      </Map>
    </div>
  </div>
</template>
