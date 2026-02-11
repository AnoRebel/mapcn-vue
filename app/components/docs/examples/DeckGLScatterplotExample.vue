<script setup lang="ts">
import { ref, computed } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { Slider } from "~/components/ui/slider";
import { ScatterplotLayer } from "@deck.gl/layers";

// NYC taxi pickup locations (sample data)
const taxiData = [
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
];

const radius = ref([1000]);
const opacity = ref([0.8]);

const layers = computed(() => [
  new ScatterplotLayer({
    id: "scatterplot-layer",
    data: taxiData,
    getPosition: (d) => d.position,
    getRadius: (d) => Math.sqrt(d.pickups) * 30,
    getFillColor: [255, 99, 71],
    getLineColor: [255, 255, 255],
    lineWidthMinPixels: 2,
    radiusMinPixels: 5,
    radiusMaxPixels: 100,
    stroked: true,
    filled: true,
    opacity: opacity.value[0] ?? 0.8,
    radiusScale: (radius.value[0] ?? 1000) / 1000,
    pickable: true,
    onHover: (info) => {
      if (info.object) {
        console.log("Pickups:", info.object.pickups);
      }
    },
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
            <span class="text-sm font-medium">Radius Scale</span>
            <span class="text-sm text-muted-foreground">{{ radius[0] }}m</span>
          </div>
          <Slider v-model="radius" :min="100" :max="5000" :step="100" />
        </div>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Opacity</span>
            <span class="text-sm text-muted-foreground"
              >{{ Math.round((opacity[0] ?? 0.8) * 100) }}%</span
            >
          </div>
          <Slider v-model="opacity" :min="0.1" :max="1" :step="0.1" />
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-73.98, 40.75]" :zoom="11" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      ScatterplotLayer showing taxi pickup density. Each circle size represents
      the number of pickups at that location.
    </p>
  </div>
</template>
