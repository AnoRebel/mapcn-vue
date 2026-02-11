<script setup lang="ts">
import { ref, computed } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { PathLayer } from "@deck.gl/layers";

// GPS trail data
const trailData = [
  {
    path: [
      [-122.45, 37.78],
      [-122.44, 37.79],
      [-122.42, 37.8],
      [-122.4, 37.79],
      [-122.38, 37.78],
      [-122.36, 37.77],
      [-122.35, 37.76],
    ],
    name: "Golden Gate Trail",
    color: [255, 99, 71],
    width: 5,
  },
  {
    path: [
      [-122.5, 37.75],
      [-122.48, 37.76],
      [-122.46, 37.77],
      [-122.44, 37.76],
      [-122.42, 37.75],
      [-122.4, 37.74],
    ],
    name: "Coastal Route",
    color: [71, 168, 255],
    width: 3,
  },
  {
    path: [
      [-122.3, 37.8],
      [-122.32, 37.79],
      [-122.34, 37.78],
      [-122.36, 37.77],
      [-122.38, 37.76],
      [-122.4, 37.75],
    ],
    name: "Bay Trail",
    color: [50, 205, 50],
    width: 4,
  },
];

const widthScale = ref(1);
const selectedTrail = ref<string | null>(null);

const layers = computed(() => [
  new PathLayer({
    id: "path-layer",
    data: trailData,
    getPath: (d) => d.path,
    getColor: (d) => d.color,
    getWidth: (d) => d.width * widthScale.value,
    widthMinPixels: 2,
    widthMaxPixels: 20,
    capRounded: true,
    jointRounded: true,
    pickable: true,
    onClick: (info) => {
      if (info.object) {
        selectedTrail.value = info.object.name;
      }
    },
  }),
]);
</script>

<template>
  <div class="space-y-4">
    <!-- Selected Trail -->
    <Card v-if="selectedTrail">
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">{{ selectedTrail }}</h3>
            <p class="text-sm text-muted-foreground">Trail selected</p>
          </div>
          <button
            class="text-sm text-muted-foreground hover:text-foreground"
            @click="selectedTrail = null"
          >
            Clear
          </button>
        </div>
      </CardContent>
    </Card>

    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Line Width</span>
            <span class="text-sm text-muted-foreground"
              >{{ widthScale.toFixed(1) }}x</span
            >
          </div>
          <input
            v-model.number="widthScale"
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            class="w-full"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-122.42, 37.77]" :zoom="11" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      PathLayer for rendering GPS trails, routes, and paths with customizable
      width and colors. Click on any trail to select it.
    </p>
  </div>
</template>
