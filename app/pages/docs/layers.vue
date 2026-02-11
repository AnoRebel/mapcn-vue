<script setup lang="ts">
import { Map, MapGeoJson, MapImageOverlay, MapMarker, MarkerContent } from '~~/registry/map'
import DocsLayout from '~/components/docs/DocsLayout.vue'
import DocsSection from '~/components/docs/DocsSection.vue'
import DocsCode from '~/components/docs/DocsCode.vue'
import ExamplePreview from '~/components/docs/ExamplePreview.vue'
import GeoJsonLayersExample from '~/components/docs/examples/GeoJsonLayersExample.vue'
import ChoroplethExample from '~/components/docs/examples/ChoroplethExample.vue'
import FlyToExample from '~/components/docs/examples/FlyToExample.vue'

definePageMeta({ layout: 'docs' })
useSeoMeta({
  title: 'Layers',
  description: 'Work with GeoJSON data, raster tiles, image overlays, and advanced layer styling.',
})

const geoJsonCode = `<script setup lang="ts">
import { Map, MapGeoJson } from '@@/registry/map'

const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Location A' },
      geometry: {
        type: 'Point',
        coordinates: [-74.006, 40.7128]
      }
    }
  ]
}
<\/script>

<template>
  <Map :center="[-74.006, 40.7128]" :zoom="10">
    <MapGeoJson
      :data="data"
      layer-type="circle"
      :style="{ 
        circleRadius: 8, 
        circleColor: '#f97316' 
      }"
    />
  </Map>
</template>`

const imageOverlayCode = `<script setup lang="ts">
import { Map, MapImageOverlay } from '@@/registry/map'

// Image corners: [top-left, top-right, bottom-right, bottom-left]
const imageCorners = [
  [-80.5, 25.8],  // top-left
  [-80.1, 25.8],  // top-right
  [-80.1, 25.4],  // bottom-right
  [-80.5, 25.4],  // bottom-left
]
<\/script>

<template>
  <Map :center="[-80.3, 25.6]" :zoom="10">
    <MapImageOverlay
      url="/overlay-image.png"
      :coordinates="imageCorners"
      :opacity="0.8"
    />
  </Map>
</template>`
</script>

<template>
  <DocsLayout
    title="Layers"
    description="Advanced layer types for data visualization and custom overlays."
    :prev="{ title: 'Clusters', href: '/docs/clusters' }"
    :next="{ title: 'Advanced Usage', href: '/docs/advanced-usage' }"
    :toc="[
      { title: 'GeoJSON Layers', slug: 'geojson-layers' },
      { title: 'Choropleth Maps', slug: 'choropleth-maps' },
      { title: 'Image Overlays', slug: 'image-overlays' },
      { title: 'Camera Animations', slug: 'camera-animations' },
    ]"
  >
    <DocsSection>
      <p>
        Beyond markers and routes, mapcn-vue supports advanced layer types for 
        data visualization. Render GeoJSON data, overlay images, and create 
        sophisticated visualizations with choropleth maps.
      </p>
    </DocsSection>

    <DocsSection id="geojson-layers" title="GeoJSON Layers">
      <p>
        The <DocsCode>MapGeoJson</DocsCode> component renders GeoJSON data with 
        support for points (circles), lines, and polygons. Perfect for displaying 
        data-driven visualizations.
      </p>
      <ExamplePreview :code="geoJsonCode" class="mt-4" height="h-[500px]">
        <GeoJsonLayersExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="choropleth-maps" title="Choropleth Maps">
      <p>
        Choropleth maps use color to represent data values across geographic regions. 
        Combine <DocsCode>MapGeoJson</DocsCode> with data-driven styling to create 
        thematic maps.
      </p>
      <ExamplePreview :code="'See ChoroplethExample.vue'" class="mt-4" height="h-[500px]">
        <ChoroplethExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="image-overlays" title="Image Overlays">
      <p>
        <DocsCode>MapImageOverlay</DocsCode> displays georeferenced images on the map. 
        Provide corner coordinates to stretch the image over a geographic area.
      </p>
      <ExamplePreview :code="imageOverlayCode" class="mt-4" height="h-[300px]">
        <Map :center="[-80.3, 25.6]" :zoom="10" class="h-full">
          <div class="absolute inset-0 flex items-center justify-center bg-muted/50">
            <p class="text-muted-foreground">Image overlay example (requires image asset)</p>
          </div>
        </Map>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="camera-animations" title="Camera Animations">
      <p>
        Smooth camera transitions with <DocsCode>flyTo</DocsCode>, <DocsCode>easeTo</DocsCode>, 
        and <DocsCode>jumpTo</DocsCode> animations. Access the underlying MapLibre instance 
        for full camera control.
      </p>
      <ExamplePreview :code="'See FlyToExample.vue'" class="mt-4" height="h-[550px]">
        <FlyToExample />
      </ExamplePreview>
    </DocsSection>
  </DocsLayout>
</template>
