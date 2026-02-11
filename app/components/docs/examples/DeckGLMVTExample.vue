<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, DeckGLOverlay } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { MVTLayer } from '@deck.gl/geo-layers'

// Example using Mapbox Vector Tiles
// In production, use your own MVT endpoint or Mapbox token
const tileUrl = 'https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf'

const layerProps = ref({
  minZoom: 0,
  maxZoom: 14,
  lineWidth: 1,
  getLineColor: [100, 100, 100],
  getFillColor: [200, 200, 200],
})

const layers = computed(() => [
  new MVTLayer({
    id: 'mvt-layer',
    data: tileUrl,
    minZoom: layerProps.value.minZoom,
    maxZoom: layerProps.value.maxZoom,
    getLineColor: layerProps.value.getLineColor,
    getFillColor: layerProps.value.getFillColor,
    getLineWidth: layerProps.value.lineWidth,
    lineWidthMinPixels: 1,
    pickable: true,
  }),
])
</script>

<template>
  <div class="space-y-4">
    <!-- Info Card -->
    <Card>
      <CardContent class="p-4">
        <h3 class="font-semibold mb-2">Mapbox Vector Tiles (MVT)</h3>
        <p class="text-sm text-muted-foreground">
          This example shows how to render Mapbox Vector Tiles using deck.gl's MVTLayer.
          In production, you'll need a Mapbox access token or your own MVT server.
        </p>
        <pre class="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto"><code>// Requires Mapbox token
const tileUrl = 
  'https://api.mapbox.com/v4/{tileset}/{z}/{x}/{y}.vector.pbf?access_token={token}'</code></pre>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-74.006, 40.7128]" :zoom="12" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      MVTLayer renders vector tiles in Mapbox Vector Tile format. Supports styling, 
      interactivity, and works with any MVT-compliant tile server. Much smaller 
      file sizes compared to raster tiles.
    </p>
  </div>
</template>
