<script setup lang="ts">
import { Map, MapImageOverlay } from "~~/registry/map";
import DocsLayout from "~/components/docs/DocsLayout.vue";
import DocsSection from "~/components/docs/DocsSection.vue";
import DocsCode from "~/components/docs/DocsCode.vue";
import ExamplePreview from "~/components/docs/ExamplePreview.vue";
import GeoJsonLayersExample from "~/components/docs/examples/GeoJsonLayersExample.vue";
import ChoroplethExample from "~/components/docs/examples/ChoroplethExample.vue";
import FlyToExample from "~/components/docs/examples/FlyToExample.vue";

definePageMeta({ layout: "docs" });
useSeoMeta({
  title: "Layers",
  description:
    "Work with GeoJSON data, raster tiles, image overlays, and advanced layer styling.",
});

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
</template>`;

const imageOverlayCode = `<script setup lang="ts">
import { Map, MapImageOverlay } from '@@/registry/map'

// Radar weather image over the northeastern US
// Corners: [top-left, top-right, bottom-right, bottom-left]
const radarCorners: [[number, number], [number, number], [number, number], [number, number]] = [
  [-80.425, 46.437],  // top-left
  [-71.516, 46.437],  // top-right
  [-71.516, 37.936],  // bottom-right
  [-80.425, 37.936],  // bottom-left
]
<\/script>

<template>
  <Map :center="[-75.97, 42.19]" :zoom="5" theme="dark">
    <MapImageOverlay
      url="https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif"
      :coordinates="radarCorners"
      :opacity="0.85"
    />
  </Map>
</template>`;

const radarCorners: [
  [number, number],
  [number, number],
  [number, number],
  [number, number],
] = [
  [-80.425, 46.437],
  [-71.516, 46.437],
  [-71.516, 37.936],
  [-80.425, 37.936],
];
</script>

<template>
  <DocsLayout
    title="Layers"
    description="Advanced layer types for data visualization and custom overlays."
    :prev="{ title: 'Clusters', href: '/docs/clusters' }"
    :next="{ title: 'deck.gl', href: '/docs/deckgl' }"
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
        support for points (circles), lines, and polygons. Perfect for
        displaying data-driven visualizations.
      </p>
      <ExamplePreview :code="geoJsonCode" class="mt-4" height="h-[500px]">
        <GeoJsonLayersExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="choropleth-maps" title="Choropleth Maps">
      <p>
        Choropleth maps use color to represent data values across geographic
        regions. Combine <DocsCode>MapGeoJson</DocsCode> with data-driven
        styling to create thematic maps.
      </p>
      <ExamplePreview
        source-file="ChoroplethExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <ChoroplethExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="image-overlays" title="Image Overlays">
      <p>
        <DocsCode>MapImageOverlay</DocsCode> displays georeferenced images on
        the map. Provide corner coordinates to stretch the image over a
        geographic area.
      </p>
      <ExamplePreview :code="imageOverlayCode" class="mt-4" height="h-[400px]">
        <Map :center="[-75.97, 42.19]" :zoom="5" theme="dark" class="h-full">
          <MapImageOverlay
            url="https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif"
            :coordinates="radarCorners"
            :opacity="0.85"
          />
        </Map>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="camera-animations" title="Camera Animations">
      <p>
        Smooth camera transitions with <DocsCode>flyTo</DocsCode>,
        <DocsCode>easeTo</DocsCode>, and <DocsCode>jumpTo</DocsCode> animations.
        Access the underlying MapLibre instance for full camera control.
      </p>
      <ExamplePreview
        source-file="FlyToExample.vue"
        class="mt-4"
        height="h-[550px]"
      >
        <FlyToExample />
      </ExamplePreview>
    </DocsSection>
  </DocsLayout>
</template>
