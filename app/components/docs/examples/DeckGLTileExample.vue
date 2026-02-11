<script setup lang="ts">
import { ref, computed } from "vue";
import { Map, DeckGLOverlay } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { TileLayer } from "@deck.gl/geo-layers";

const opacity = ref(0.8);
const _showLabels = ref(true);

// Example using satellite tiles
const layers = computed(() => [
  new TileLayer({
    id: "tile-layer",
    data: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{x}/{y}.jpg",
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: (props) => {
      const { west, south, east, north } = props.tile.bbox as {
        west: number;
        south: number;
        east: number;
        north: number;
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new (props.constructor as any)({
        ...props,
        bounds: [west, south, east, north],
        opacity: opacity.value,
      });
    },
  }),
]);

const _exampleCode = `<TileLayer
  id='satellite-tiles'
  data='https://example.com/tiles/{z}/{x}/{y}.png'
  tileSize={256}
  minZoom={0}
  maxZoom={19}
  opacity={0.8}
/>`;
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm font-medium">Layer Opacity</span>
            <span class="text-sm text-muted-foreground"
              >{{ Math.round(opacity * 100) }}%</span
            >
          </div>
          <input
            v-model.number="opacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            class="w-full"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[0, 0]" :zoom="2" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      TileLayer for rendering raster tile layers. Perfect for satellite imagery,
      weather data, or any tiled raster source. Supports XYZ, TMS, and WMTS tile
      schemes.
    </p>
  </div>
</template>
