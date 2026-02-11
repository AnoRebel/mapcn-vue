<script setup lang="ts">
import { ref } from 'vue'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { Map, MapMarker, MarkerContent, MarkerTooltip, type MapViewport } from '~~/registry/map'
import { Navigation } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import ExampleCard from './ExampleCard.vue'

const destination = {
  name: 'New York',
  description: 'United States',
  center: [-74.006, 40.7128] as [number, number],
  startCenter: [10, 50] as [number, number],
}

const mapRef = ref<{ getMap: () => MapLibreMap | null } | null>(null)

function flyTo() {
  const map = mapRef.value?.getMap?.()
  if (map) {
    map.flyTo({
      center: destination.center,
      zoom: 14,
      duration: 2500,
    })
  }
}
</script>

<template>
  <ExampleCard label="Fly To" class="aspect-square" delay="delay-600">
    <ClientOnly>
      <Map
        ref="mapRef"
        :center="destination.startCenter"
        :zoom="0.5"
        :projection="{ type: 'globe' }"
        class="h-full"
      >
        <MapMarker
          :longitude="destination.center[0]"
          :latitude="destination.center[1]"
        >
          <MarkerContent>
            <div class="relative flex items-center justify-center">
              <div class="absolute size-6 rounded-full bg-cyan-500/20 animate-ping" />
              <div class="size-4 rounded-full bg-cyan-500 border-2 border-white shadow-lg" />
            </div>
          </MarkerContent>
          <MarkerTooltip>
            <div class="text-center">
              <div class="font-medium">{{ destination.name }}</div>
              <div class="text-[10px] text-muted-foreground">{{ destination.description }}</div>
            </div>
          </MarkerTooltip>
        </MapMarker>
      </Map>
    </ClientOnly>
    <Button
      size="icon"
      variant="secondary"
      class="absolute top-2 right-2 z-10"
      @click="flyTo"
    >
      <Navigation class="size-4" />
    </Button>
  </ExampleCard>
</template>
