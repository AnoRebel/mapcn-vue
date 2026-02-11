<script setup lang="ts">
import { ref, computed } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { Slider } from "~/components/ui/slider";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";

// Generate random crime incident data
const crimeData = Array.from({ length: 1000 }, () => ({
  position: [
    -74.006 + (Math.random() - 0.5) * 0.5,
    40.7128 + (Math.random() - 0.5) * 0.5,
  ],
  weight: Math.random() * 10,
}));

const radius = ref([30]);
const intensity = ref([1]);
const threshold = ref([0.05]);

const layers = computed(() => [
  new HeatmapLayer({
    id: "heatmap-layer",
    data: crimeData,
    getPosition: (d) => d.position,
    getWeight: (d) => d.weight,
    radiusPixels: radius.value[0],
    intensity: intensity.value[0],
    threshold: threshold.value[0],
    colorRange: [
      [255, 255, 178],
      [254, 204, 92],
      [253, 141, 60],
      [240, 59, 32],
      [189, 0, 38],
    ],
  }),
]);
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Radius</span>
            <span class="text-sm text-muted-foreground">{{ radius[0] }}px</span>
          </div>
          <Slider v-model="radius" :min="10" :max="100" :step="5" />
        </div>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Intensity</span>
            <span class="text-sm text-muted-foreground">{{
              intensity[0]
            }}</span>
          </div>
          <Slider v-model="intensity" :min="0.5" :max="5" :step="0.5" />
        </div>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Threshold</span>
            <span class="text-sm text-muted-foreground">{{
              threshold[0]
            }}</span>
          </div>
          <Slider v-model="threshold" :min="0" :max="0.5" :step="0.05" />
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-74.006, 40.7128]" :zoom="11" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      HeatmapLayer showing incident density. 1000 randomly distributed points
      aggregated into a density visualization.
    </p>
  </div>
</template>
