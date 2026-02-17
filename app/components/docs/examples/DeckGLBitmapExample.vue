<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { BitmapLayer } from "@deck.gl/layers";

// Georeferenced image example
// In production, use your own image URLs
const imageBounds = {
  left: -74.02,
  right: -73.98,
  top: 40.73,
  bottom: 40.7,
};

const opacity = ref(0.8);
const transparentColor = ref(false);

const layers = computed(() => [
  markRaw(
    new BitmapLayer({
      id: "bitmap-layer",
      bounds: [
        imageBounds.left,
        imageBounds.bottom,
        imageBounds.right,
        imageBounds.top,
      ],
      image:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-districts.png",
      opacity: opacity.value,
      transparentColor: transparentColor.value ? [0, 0, 0, 0] : undefined,
      tintColor: [255, 255, 255],
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
          <span class="text-sm font-medium">Opacity</span>
          <input
            v-model.number="opacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            class="w-full"
          />
          <span class="text-xs text-muted-foreground"
            >{{ Math.round(opacity * 100) }}%</span
          >
        </div>
        <label class="flex items-center gap-2">
          <input v-model="transparentColor" type="checkbox" class="rounded" />
          <span class="text-sm">Transparent Background</span>
        </label>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="flex-1 min-h-[200px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-74.0, 40.715]" :zoom="13" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>
  </div>
</template>
