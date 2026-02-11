<script setup lang="ts">
import { ref, computed } from 'vue'
import { Map, MapGeoJson } from '~~/registry/map'
import { Card, CardContent } from '~/components/ui/card'
import type { FeatureCollection } from 'geojson'

// Proximity analysis data
const facilities: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'Hospital A', type: 'hospital' }, geometry: { type: 'Point', coordinates: [-74.006, 40.7128] } },
    { type: 'Feature', properties: { name: 'Hospital B', type: 'hospital' }, geometry: { type: 'Point', coordinates: [-73.985, 40.748] } },
    { type: 'Feature', properties: { name: 'School A', type: 'school' }, geometry: { type: 'Point', coordinates: [-73.975, 40.758] } },
    { type: 'Feature', properties: { name: 'School B', type: 'school' }, geometry: { type: 'Point', coordinates: [-73.995, 40.735] } },
    { type: 'Feature', properties: { name: 'Park A', type: 'park' }, geometry: { type: 'Point', coordinates: [-73.965, 40.768] } },
    { type: 'Feature', properties: { name: 'Park B', type: 'park' }, geometry: { type: 'Point', coordinates: [-74.015, 40.705] } },
  ],
}

// Isochrone rings (simplified as polygons)
const isochrones = {
  '5min': { color: '#22c55e', opacity: 0.3 },
  '10min': { color: '#eab308', opacity: 0.25 },
  '15min': { color: '#ef4444', opacity: 0.2 },
}

const selectedFacility = ref<string | null>(null)
const showProximity = ref(true)
const proximityRadius = ref(0.01) // roughly 1km

const facilityTypes = {
  hospital: { color: '#ef4444', label: 'Hospital' },
  school: { color: '#3b82f6', label: 'School' },
  park: { color: '#22c55e', label: 'Park' },
}
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <label class="flex items-center gap-2">
          <input v-model="showProximity" type="checkbox" class="rounded" />
          <span class="text-sm">Show Proximity Zones</span>
        </label>
        
        <div v-if="showProximity" class="space-y-2">
          <span class="text-sm font-medium">Walkable Distance</span>
          <input v-model.number="proximityRadius" type="range" min="0.005" max="0.02" step="0.001" class="w-full" />
          <span class="text-xs text-muted-foreground">{{ (proximityRadius * 111).toFixed(1) }} km radius</span>
        </div>

        <!-- Legend -->
        <div class="space-y-1 pt-2 border-t">
          <span class="text-xs font-medium">Facility Types</span>
          <div v-for="(info, type) in facilityTypes" :key="type" class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: info.color }" />
            <span class="text-xs">{{ info.label }}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border relative">
      <Map :center="[-73.99, 40.74]" :zoom="12" class="h-full">
        <!-- Isochrone circles -->
        <MapGeoJson
          v-if="showProximity"
          v-for="(ring, time) in isochrones"
          :key="time"
          :data="{
            type: 'FeatureCollection',
            features: facilities.features.map(f => ({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [f.geometry.coordinates[0] - proximityRadius * (parseInt(time) / 5), f.geometry.coordinates[1]],
                  [f.geometry.coordinates[0], f.geometry.coordinates[1] + proximityRadius * (parseInt(time) / 5)],
                  [f.geometry.coordinates[0] + proximityRadius * (parseInt(time) / 5), f.geometry.coordinates[1]],
                  [f.geometry.coordinates[0], f.geometry.coordinates[1] - proximityRadius * (parseInt(time) / 5)],
                  [f.geometry.coordinates[0] - proximityRadius * (parseInt(time) / 5), f.geometry.coordinates[1]],
                ]],
              },
            })),
          } as FeatureCollection"
          layer-type="fill"
          :style="{ fillColor: ring.color, fillOpacity: ring.opacity }"
        />
        
        <MapGeoJson
          :data="facilities"
          layer-type="circle"
          :style="{ 
            circleRadius: 8,
            circleColor: ['match', ['get', 'type'], 
              'hospital', facilityTypes.hospital.color,
              'school', facilityTypes.school.color,
              'park', facilityTypes.park.color,
              '#999'
            ],
            circleOpacity: 0.9,
            strokeColor: '#fff',
            strokeWidth: 2 
          }"
          :interactive="true"
          @click="(f) => selectedFacility = f.properties?.name"
        />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      Proximity map showing facility locations with walkable distance zones.
      Visualize service coverage and accessibility for urban planning.
    </p>
  </div>
</template>
