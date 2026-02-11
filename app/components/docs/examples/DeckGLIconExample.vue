<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, DeckGLOverlay } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import { IconLayer } from '@deck.gl/layers'

// POI data with icons
const pois = [
  { position: [-74.006, 40.7128], icon: 'restaurant', name: 'Restaurant A', color: [255, 100, 100] },
  { position: [-73.9857, 40.7484], icon: 'cafe', name: 'Coffee Shop', color: [100, 255, 100] },
  { position: [-73.9772, 40.7527], icon: 'shopping', name: 'Mall', color: [100, 100, 255] },
  { position: [-73.9632, 40.7794], icon: 'park', name: 'Central Park', color: [255, 255, 100] },
  { position: [-73.9969, 40.7061], icon: 'hospital', name: 'Hospital', color: [255, 100, 255] },
  { position: [-73.9712, 40.7614], icon: 'school', name: 'School', color: [100, 255, 255] },
  { position: [-73.9442, 40.6782], icon: 'bank', name: 'Bank', color: [255, 200, 100] },
  { position: [-74.0445, 40.6892], icon: 'gas', name: 'Gas Station', color: [200, 100, 255] },
]

const iconSize = ref(24)
const billboard = ref(true)

// SVG icons as data URIs
const iconMapping: Record<string, string> = {
  restaurant: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>')}`,
  cafe: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>')}`,
  shopping: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>')}`,
  park: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-8"/><path d="M12 14c-3 0-5-2-5-5 0-3 2-6 5-8 3 2 5 5 5 8 0 3-2 5-5 5Z"/></svg>')}`,
  hospital: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>')}`,
  school: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>')}`,
  bank: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="22" x2="21" y2="22"/><path d="M12 2 2 7h20L12 2z"/><path d="M6 7v15"/><path d="M10 7v15"/><path d="M14 7v15"/><path d="M18 7v15"/></svg>')}`,
  gas: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8"/><path d="M19 11V7a2 2 0 0 0-2-2h-2"/><path d="M19 11h2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1"/><circle cx="8" cy="17" r="2"/></svg>')}`,
}

const layers = computed(() => [
  new IconLayer({
    id: 'icon-layer',
    data: pois,
    getPosition: d => d.position,
    getIcon: d => ({
      url: iconMapping[d.icon] || iconMapping.restaurant,
      width: iconSize.value,
      height: iconSize.value,
      mask: true,
    }),
    getSize: () => iconSize.value,
    getColor: d => d.color,
    sizeScale: 1,
    billboard: billboard.value,
    pickable: true,
    onClick: (info) => {
      if (info.object) {
        console.log('Clicked:', info.object.name)
      }
    },
  }),
])
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="space-y-2">
          <span class="text-sm font-medium">Icon Size</span>
          <input v-model.number="iconSize" type="range" min="16" max="48" step="4" class="w-full" >
          <span class="text-xs text-muted-foreground">{{ iconSize }}px</span>
        </div>
        <label class="flex items-center gap-2">
          <input v-model="billboard" type="checkbox" class="rounded" >
          <span class="text-sm">Billboard (always face camera)</span>
        </label>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map :center="[-73.98, 40.75]" :zoom="12" class="h-full">
        <DeckGLOverlay :layers="layers" :interleaved="true" />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      IconLayer renders custom icons at point locations. Supports SVG icons, 
      billboarding, and interaction. Perfect for POI visualization.
    </p>
  </div>
</template>
