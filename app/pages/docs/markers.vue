<script setup lang="ts">
import { ref } from 'vue'
import { Map, MapMarker, MarkerContent, MarkerTooltip, MarkerPopup } from '~~/registry/map'
import DocsLayout from '~/components/docs/DocsLayout.vue'
import DocsSection from '~/components/docs/DocsSection.vue'
import DocsCode from '~/components/docs/DocsCode.vue'
import DocsNote from '~/components/docs/DocsNote.vue'
import DocsLink from '~/components/docs/DocsLink.vue'
import ExamplePreview from '~/components/docs/ExamplePreview.vue'

definePageMeta({ layout: 'docs' })
useSeoMeta({ title: 'Markers - mapcn-vue' })

const locations = [
  { id: 1, name: 'Empire State Building', lng: -73.9857, lat: 40.7484 },
  { id: 2, name: 'Central Park', lng: -73.9654, lat: 40.7829 },
  { id: 3, name: 'Times Square', lng: -73.9855, lat: 40.758 },
]

const basicMarkersCode = `<script setup lang="ts">
const locations = [
  { id: 1, name: 'Empire State Building', lng: -73.9857, lat: 40.7484 },
  { id: 2, name: 'Central Park', lng: -73.9654, lat: 40.7829 },
  { id: 3, name: 'Times Square', lng: -73.9855, lat: 40.758 },
]
<\/script>

<template>
  <Map :center="[-73.98, 40.76]" :zoom="12">
    <MapMarker
      v-for="location in locations"
      :key="location.id"
      :longitude="location.lng"
      :latitude="location.lat"
    >
      <MarkerContent>
        <div class="size-4 rounded-full bg-primary border-2 border-white shadow-lg" />
      </MarkerContent>
    </MapMarker>
  </Map>
</template>`

const markersWithTooltipsCode = `<script setup lang="ts">
const locations = [
  { id: 1, name: 'Empire State Building', lng: -73.9857, lat: 40.7484 },
  { id: 2, name: 'Central Park', lng: -73.9654, lat: 40.7829 },
  { id: 3, name: 'Times Square', lng: -73.9855, lat: 40.758 },
]
<\/script>

<template>
  <Map :center="[-73.98, 40.76]" :zoom="12">
    <MapMarker
      v-for="location in locations"
      :key="location.id"
      :longitude="location.lng"
      :latitude="location.lat"
    >
      <MarkerContent>
        <div class="size-4 rounded-full bg-primary border-2 border-white shadow-lg" />
      </MarkerContent>
      <MarkerTooltip>{{ location.name }}</MarkerTooltip>
    </MapMarker>
  </Map>
</template>`

const markersWithPopupsCode = `<script setup lang="ts">
const locations = [
  { id: 1, name: 'Empire State Building', lng: -73.9857, lat: 40.7484 },
  { id: 2, name: 'Central Park', lng: -73.9654, lat: 40.7829 },
  { id: 3, name: 'Times Square', lng: -73.9855, lat: 40.758 },
]
<\/script>

<template>
  <Map :center="[-73.98, 40.76]" :zoom="12">
    <MapMarker
      v-for="location in locations"
      :key="location.id"
      :longitude="location.lng"
      :latitude="location.lat"
    >
      <MarkerContent>
        <div class="size-4 rounded-full bg-primary border-2 border-white shadow-lg" />
      </MarkerContent>
      <MarkerPopup>
        <div class="space-y-1">
          <p class="font-medium text-foreground">{{ location.name }}</p>
          <p class="text-xs text-muted-foreground">
            {{ location.lat.toFixed(4) }}, {{ location.lng.toFixed(4) }}
          </p>
        </div>
      </MarkerPopup>
    </MapMarker>
  </Map>
</template>`

const draggablePosition = ref({ lng: -73.9857, lat: 40.7484 })

const draggableMarkerCode = `<script setup lang="ts">
import { ref } from 'vue'

const position = ref({ lng: -73.9857, lat: 40.7484 })
<\/script>

<template>
  <Map :center="[-73.98, 40.76]" :zoom="12">
    <MapMarker
      :longitude="position.lng"
      :latitude="position.lat"
      :draggable="true"
      :on-drag-end="(lngLat) => { position.lng = lngLat.lng; position.lat = lngLat.lat }"
    >
      <MarkerContent>
        <div class="size-6 rounded-full bg-destructive border-2 border-white shadow-lg flex items-center justify-center">
          <span class="text-white text-[8px] font-bold">D</span>
        </div>
      </MarkerContent>
      <MarkerTooltip>
        Drag me! {{ position.lat.toFixed(4) }}, {{ position.lng.toFixed(4) }}
      </MarkerTooltip>
    </MapMarker>
  </Map>
</template>`
</script>

<template>
  <DocsLayout
    title="Markers"
    description="Add interactive markers with customizable content, tooltips, and popups."
    :prev="{ title: 'Controls', href: '/docs/controls' }"
    :next="{ title: 'Popups', href: '/docs/popups' }"
    :toc="[
      { title: 'Basic Markers', slug: 'basic-markers' },
      { title: 'With Tooltips', slug: 'with-tooltips' },
      { title: 'With Popups', slug: 'with-popups' },
      { title: 'Draggable Markers', slug: 'draggable-markers' },
    ]"
  >
    <DocsSection id="basic-markers" title="Basic Markers">
      <p>
        Use <DocsCode>MapMarker</DocsCode> to add markers to your map. Markers can contain
        any custom content via the <DocsCode>MarkerContent</DocsCode> slot.
      </p>
      <ExamplePreview :code="basicMarkersCode" class="mt-4">
        <Map :center="[-73.98, 40.76]" :zoom="12" class="h-full">
          <MapMarker
            v-for="location in locations"
            :key="location.id"
            :longitude="location.lng"
            :latitude="location.lat"
          >
            <MarkerContent>
              <div class="size-4 rounded-full bg-primary border-2 border-white shadow-lg" />
            </MarkerContent>
          </MapMarker>
        </Map>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="with-tooltips" title="With Tooltips">
      <p>
        Add tooltips that appear on hover using the <DocsCode>MarkerTooltip</DocsCode> component.
      </p>
      <ExamplePreview :code="markersWithTooltipsCode" class="mt-4">
        <Map :center="[-73.98, 40.76]" :zoom="12" class="h-full">
          <MapMarker
            v-for="location in locations"
            :key="location.id"
            :longitude="location.lng"
            :latitude="location.lat"
          >
            <MarkerContent>
              <div class="size-4 rounded-full bg-primary border-2 border-white shadow-lg" />
            </MarkerContent>
            <MarkerTooltip>{{ location.name }}</MarkerTooltip>
          </MapMarker>
        </Map>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="with-popups" title="With Popups">
      <p>
        Add popups that open on click using the <DocsCode>MarkerPopup</DocsCode> component.
      </p>
      <ExamplePreview :code="markersWithPopupsCode" class="mt-4">
        <Map :center="[-73.98, 40.76]" :zoom="12" class="h-full">
          <MapMarker
            v-for="location in locations"
            :key="location.id"
            :longitude="location.lng"
            :latitude="location.lat"
          >
            <MarkerContent>
              <div class="size-4 rounded-full bg-primary border-2 border-white shadow-lg" />
            </MarkerContent>
            <MarkerPopup>
              <div class="space-y-1">
                <p class="font-medium text-foreground">{{ location.name }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ location.lat.toFixed(4) }}, {{ location.lng.toFixed(4) }}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>
        </Map>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="draggable-markers" title="Draggable Markers">
      <p>
        Enable marker dragging with the <DocsCode>draggable</DocsCode> prop. Use
        <DocsCode>onDragEnd</DocsCode> to capture the new position.
      </p>
      <ExamplePreview :code="draggableMarkerCode" class="mt-4">
        <Map :center="[-73.98, 40.76]" :zoom="12" class="h-full">
          <MapMarker
            :longitude="draggablePosition.lng"
            :latitude="draggablePosition.lat"
            :draggable="true"
            :on-drag-end="(lngLat: { lng: number; lat: number }) => { draggablePosition.lng = lngLat.lng; draggablePosition.lat = lngLat.lat }"
          >
            <MarkerContent>
              <div class="size-6 rounded-full bg-destructive border-2 border-white shadow-lg flex items-center justify-center">
                <span class="text-white text-[8px] font-bold">D</span>
              </div>
            </MarkerContent>
            <MarkerTooltip>
              Drag me! {{ draggablePosition.lat.toFixed(4) }}, {{ draggablePosition.lng.toFixed(4) }}
            </MarkerTooltip>
          </MapMarker>
        </Map>
      </ExamplePreview>
    </DocsSection>

    <DocsNote class="mt-8">
      <strong>Performance tip:</strong> For displaying many points (100+), consider using
      <DocsLink href="/docs/clusters">MapClusterLayer</DocsLink> instead of individual markers.
      MapClusterLayer uses WebGL-rendered circles managed entirely by MapLibre, avoiding DOM overhead.
    </DocsNote>
  </DocsLayout>
</template>
