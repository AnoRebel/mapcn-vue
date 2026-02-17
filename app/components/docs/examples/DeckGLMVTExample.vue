<script setup lang="ts">
import { ref, computed, markRaw } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { MVTLayer } from "@deck.gl/geo-layers";

// Example using Mapbox Vector Tiles
// In production, use your own MVT endpoint or Mapbox token
const tileUrl =
  "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf";

const layerProps = ref({
  minZoom: 0,
  maxZoom: 14,
  lineWidth: 1,
  getLineColor: [100, 100, 100] as [number, number, number],
  getFillColor: [200, 200, 200] as [number, number, number],
});

const layers = computed(() => [
  markRaw(
    new MVTLayer({
      id: "mvt-layer",
      data: tileUrl,
      minZoom: layerProps.value.minZoom,
      maxZoom: layerProps.value.maxZoom,
      getLineColor: layerProps.value.getLineColor,
      getFillColor: layerProps.value.getFillColor,
      getLineWidth: layerProps.value.lineWidth,
      lineWidthMinPixels: 1,
      pickable: true,
    }),
  ),
]);
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <!-- Info Card -->
    <Card class="shrink-0">
      <CardContent class="p-3">
        <p class="text-xs text-muted-foreground">
          MVTLayer renders Mapbox Vector Tiles. Requires a Mapbox access token
          or your own MVT server in production.
        </p>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="flex-1 min-h-[200px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-74.006, 40.7128]" :zoom="12" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>
  </div>
</template>
