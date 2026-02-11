<script setup lang="ts">
import { ref } from 'vue'
import { Map, MapControls } from '~~/registry/map'
import { Button } from '~/components/ui/button'
import DocsLayout from '~/components/docs/DocsLayout.vue'
import DocsSection from '~/components/docs/DocsSection.vue'
import DocsCode from '~/components/docs/DocsCode.vue'
import DocsLink from '~/components/docs/DocsLink.vue'
import DocsNote from '~/components/docs/DocsNote.vue'
import ExamplePreview from '~/components/docs/ExamplePreview.vue'
import CameraInfo from '~/components/docs/examples/CameraInfo.vue'
import CustomLayerExample from '~/components/docs/examples/CustomLayerExample.vue'
import LayerMarkersExample from '~/components/docs/examples/LayerMarkersExample.vue'

definePageMeta({ layout: 'docs' })
useSeoMeta({
  title: 'Advanced Usage',
  description: 'Access the raw MapLibre instance, build custom controls, add GeoJSON layers, and render markers via map layers.',
})

const mapRef = ref<{ getMap: () => any } | null>(null)
const mapRef2 = ref<{ getMap: () => any } | null>(null)
const mapReady = ref(false)

function handleFlyTo() {
  const map = mapRef.value?.getMap()
  if (map) {
    map.flyTo({ center: [-74.006, 40.7128], zoom: 14, duration: 2000 })
  }
}

function onMapLoad() {
  mapReady.value = true
}

function toggle3D() {
  const map = mapRef2.value?.getMap()
  if (map) {
    const currentPitch = map.getPitch()
    map.easeTo({
      pitch: currentPitch > 0 ? 0 : 60,
      duration: 1000
    })
  }
}

function resetView() {
  const map = mapRef2.value?.getMap()
  if (map) {
    map.easeTo({
      center: [-73.9857, 40.7484],
      zoom: 14,
      pitch: 0,
      bearing: 0,
      duration: 1500
    })
  }
}



const refCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Map } from '~~/registry/map'

const mapRef = ref<{ getMap: () => any } | null>(null)

function handleFlyTo() {
  // Access the MapLibre GL map instance via ref
  mapRef.value?.getMap()?.flyTo({ 
    center: [-74, 40.7], 
    zoom: 12,
    duration: 2000 
  })
}
<\/script>

<template>
  <button @click="handleFlyTo">Fly to NYC</button>
  <Map ref="mapRef" :center="[-74, 40.7]" :zoom="10" />
</template>`

const useMapCode = `<script setup lang="ts">
import { Map, useMap } from '~~/registry/map'
import { watchEffect } from 'vue'

// For child components inside Map, use the useMap composable
function MapEventListener() {
  const { map, isLoaded } = useMap()
  
  watchEffect(() => {
    if (!map.value || !isLoaded.value) return
    
    const handleClick = (e: any) => {
      console.log("Clicked at:", e.lngLat)
    }

    map.value.on("click", handleClick)
    return () => map.value?.off("click", handleClick)
  })
}
<\/script>

<template>
  <Map :center="[-74, 40.7]" :zoom="10">
    <MapEventListener />
  </Map>
</template>`

const customControlsCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Map, MapControls } from '~~/registry/map'
import { Button } from '~/components/ui/button'

const mapRef = ref<{ getMap: () => any } | null>(null)

function toggle3D() {
  const map = mapRef.value?.getMap()
  if (map) {
    const currentPitch = map.getPitch()
    map.easeTo({
      pitch: currentPitch > 0 ? 0 : 60,
      duration: 1000
    })
  }
}

function resetView() {
  const map = mapRef.value?.getMap()
  if (map) {
    map.easeTo({
      center: [-73.9857, 40.7484],
      zoom: 14,
      pitch: 0,
      bearing: 0,
      duration: 1500
    })
  }
}
<\/script>

<template>
  <div class="relative h-[400px]">
    <Map ref="mapRef" :center="[-73.9857, 40.7484]" :zoom="14" class="h-full">
      <MapControls />
    </Map>
    
    <!-- Custom controls overlay -->
    <div class="absolute top-4 left-4 z-10 flex gap-2">
      <Button @click="toggle3D" size="sm">
        3D View
      </Button>
      <Button @click="resetView" size="sm" variant="outline">
        Reset
      </Button>
    </div>
  </div>
</template>`
</script>

<template>
  <DocsLayout
    title="Advanced"
    description="Access the underlying MapLibre GL instance for advanced customization."
    :prev="{ title: 'Clusters', href: '/docs/clusters' }"
    :toc="[
      { title: 'Using a Ref', slug: 'using-a-ref' },
      { title: 'Using the Composable', slug: 'using-the-composable' },
      { title: 'Example: Custom Controls', slug: 'example-custom-controls' },
      { title: 'Example: Custom GeoJSON Layer', slug: 'example-custom-geojson-layer' },
      { title: 'Example: Markers via Layers', slug: 'example-markers-via-layers' },
      { title: 'Extend to Build', slug: 'extend-to-build' },
    ]"
  >
    <DocsSection>
      <p>
        Access the underlying MapLibre GL map instance to use any feature from
        the MapLibre GL JS API. You can use either a <DocsCode>ref</DocsCode>
        or the <DocsCode>useMap</DocsCode> composable.
      </p>
    </DocsSection>

    <DocsNote>
      <strong>Tip:</strong> Check the
      <DocsLink
        href="https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/"
        external
      >
        MapLibre GL JS documentation
      </DocsLink>
      for the full list of available methods and events.
    </DocsNote>

    <DocsSection id="using-a-ref" title="Using a Ref">
      <p>
        The simplest way to access the map instance. Use a
        <DocsCode>ref</DocsCode> to call map methods from event handlers or
        effects.
      </p>
      <ExamplePreview :code="refCode" class="mt-4">
        <div class="relative h-full">
          <Map ref="mapRef" :center="[-74.006, 40.7128]" :zoom="10" class="h-full" @load="onMapLoad" />
          <div class="absolute bottom-4 left-4 z-10 flex gap-2">
            <Button size="sm" :disabled="!mapReady" @click="handleFlyTo">
              Fly to NYC
            </Button>
          </div>
        </div>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="using-the-composable" title="Using the Composable">
      <p>
        For child components rendered inside <DocsCode>Map</DocsCode>, use the
        <DocsCode>useMap</DocsCode> composable to access the map instance and listen
        to events.
      </p>
      <ExamplePreview :code="useMapCode" class="mt-4" height="h-[300px]">
        <Map :center="[-74.006, 40.7128]" :zoom="10" class="h-full">
          <CameraInfo />
        </Map>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="example-custom-controls" title="Example: Custom Controls">
      <p>
        This example shows how to create custom controls that manipulate the
        map's pitch and bearing.
      </p>
      <ExamplePreview :code="customControlsCode" class="mt-4">
        <div class="relative h-full">
          <Map ref="mapRef2" :center="[-73.9857, 40.7484]" :zoom="14" class="h-full">
            <MapControls />
          </Map>
          <div class="absolute top-4 left-4 z-10 flex gap-2">
            <Button size="sm" @click="toggle3D">
              3D View
            </Button>
            <Button size="sm" variant="outline" @click="resetView">
              Reset
            </Button>
          </div>
        </div>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="example-custom-geojson-layer" title="Example: Custom GeoJSON Layer">
      <p>
        Add custom GeoJSON data as layers with fill and outline styles. This
        example shows NYC parks with hover interactions.
      </p>
      <CustomLayerExample class="mt-4" />
    </DocsSection>

    <DocsSection id="example-markers-via-layers" title="Example: Markers via Layers">
      <p>
        When displaying hundreds or thousands of markers, use GeoJSON layers
        instead of DOM-based <DocsCode>MapMarker</DocsCode> components. This
        approach renders markers on the WebGL canvas, providing significantly
        better performance.
      </p>
      <LayerMarkersExample class="mt-4" />
    </DocsSection>

    <DocsSection id="extend-to-build" title="Extend to Build">
      <p>You can extend this to build custom features like:</p>
      <ul class="mt-4 space-y-2 list-disc list-inside">
        <li>
          <strong>Real-time tracking</strong> - Live location updates for
          delivery, rides, or fleet management
        </li>
        <li>
          <strong>Geofencing</strong> - Trigger actions when users enter or
          leave specific areas
        </li>
        <li>
          <strong>Heatmaps</strong> - Visualize density data like population,
          crime, or activity hotspots
        </li>
        <li>
          <strong>Drawing tools</strong> - Let users draw polygons, lines, or
          place markers for custom areas
        </li>
        <li>
          <strong>3D buildings</strong> - Extrude building footprints for
          urban visualization
        </li>
        <li>
          <strong>Animations</strong> - Animate markers along routes or create
          fly-through experiences
        </li>
        <li>
          <strong>Custom data layers</strong> - Overlay weather, traffic, or
          satellite imagery
        </li>
      </ul>
    </DocsSection>
  </DocsLayout>
</template>
