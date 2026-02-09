<script setup lang="ts">
import { Map, MapMarker, MarkerContent, MarkerTooltip } from '~~/registry/map'
import { Flame, TrendingUp } from 'lucide-vue-next'
import ExampleCard from './ExampleCard.vue'

const trendingSpots = [
  { lng: -73.9857, lat: 40.7484, name: 'Times Square', visitors: '2.4k', size: 18 },
  { lng: -73.9654, lat: 40.7829, name: 'Central Park', visitors: '1.8k', size: 14 },
  { lng: -74.0445, lat: 40.6892, name: 'Statue of Liberty', visitors: '890', size: 12 },
]
</script>

<template>
  <ExampleCard label="Trending" class="aspect-square" delay="delay-800">
    <ClientOnly>
      <Map :center="[-73.99, 40.735]" :zoom="10" class="h-full">
        <MapMarker
          v-for="(spot, i) in trendingSpots"
          :key="spot.name"
          :longitude="spot.lng"
          :latitude="spot.lat"
        >
          <MarkerContent>
            <div class="relative flex items-center justify-center">
              <div
                class="absolute rounded-full pointer-events-none"
                :class="i === 0 ? 'bg-orange-500/30 size-18' : i === 1 ? 'bg-rose-500/30 size-14' : 'bg-amber-500/30 size-12'"
              />
              <div
                :class="[
                  'rounded-full p-1.5 shadow-lg',
                  i === 0 ? 'bg-linear-to-br from-orange-500 to-red-500 shadow-orange-500/50' :
                  i === 1 ? 'bg-linear-to-br from-rose-500 to-pink-500 shadow-rose-500/50' :
                  'bg-linear-to-br from-amber-500 to-yellow-500 shadow-amber-500/50',
                  i === 0 ? 'p-1.5' : i === 1 ? 'p-1.5' : 'p-1'
                ]"
              >
                <Flame :class="i === 0 ? 'size-3.5' : i === 1 ? 'size-3' : 'size-2.5'" class="text-white" />
              </div>
            </div>
          </MarkerContent>
          <MarkerTooltip>
            <div class="text-center">
              <div class="font-medium">{{ spot.name }}</div>
              <div class="flex items-center justify-center gap-1 text-muted-foreground">
                <TrendingUp class="size-3 text-green-500" />
                <span class="text-xs text-green-500">{{ spot.visitors }} visitors</span>
              </div>
            </div>
          </MarkerTooltip>
        </MapMarker>
      </Map>
    </ClientOnly>
  </ExampleCard>
</template>
