<script setup lang="ts">
import { ref } from "vue";
import { Map, MapClusterLayer, MapPopup, MapControls } from "~~/registry/map";
import DocsLayout from "~/components/docs/DocsLayout.vue";
import DocsSection from "~/components/docs/DocsSection.vue";
import DocsCode from "~/components/docs/DocsCode.vue";
import ExamplePreview from "~/components/docs/ExamplePreview.vue";

definePageMeta({ layout: "docs" });
useSeoMeta({
  title: "Clusters",
  description:
    "Efficiently render thousands of points with automatic clustering using MapClusterLayer. Color-coded clusters expand on zoom.",
});

interface SelectedPoint {
  feature: GeoJSON.Feature;
  coords: [number, number];
}

// Must be defined at top level of script setup
const selectedPoint = ref<SelectedPoint | null>(null);

const clusterCode = `<script setup lang="ts">
import { ref } from 'vue'

interface SelectedPoint {
  feature: GeoJSON.Feature
  coords: [number, number]
}

const selectedPoint = ref<SelectedPoint | null>(null)

function handlePointClick(feature: GeoJSON.Feature, coords: [number, number]) {
  selectedPoint.value = { feature, coords }
}

function handlePopupClose() {
  selectedPoint.value = null
}
<\/script>

<template>
  <div class="h-[400px] w-full">
    <Map :center="[-103.59, 40.66]" :zoom="3.4">
      <MapClusterLayer
        data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
        :cluster-radius="50"
        :cluster-max-zoom="14"
        :cluster-colors="['#1d8cf8', '#6d5dfc', '#e23670']"
        point-color="#1d8cf8"
        @point-click="handlePointClick"
      />
      <MapPopup
        v-if="selectedPoint"
        :longitude="selectedPoint.coords[0]"
        :latitude="selectedPoint.coords[1]"
        @close="handlePopupClose"
        :close-button="true"
      >
        <div class="space-y-1 p-1">
          <p class="text-sm">Magnitude: {{ selectedPoint.feature.properties.mag }}</p>
        </div>
      </MapPopup>
      <MapControls />
    </Map>
  </div>
</template>`;

function handlePointClick(feature: GeoJSON.Feature, coords: [number, number]) {
  selectedPoint.value = { feature, coords };
}

function handlePopupClose() {
  selectedPoint.value = null;
}
</script>

<template>
  <DocsLayout
    title="Clusters"
    description="Visualize large datasets with automatic point clustering."
    :prev="{ title: 'Routes', href: '/docs/routes' }"
    :next="{ title: 'Advanced', href: '/docs/advanced-usage' }"
  >
    <DocsSection>
      <p>
        The <DocsCode>MapClusterLayer</DocsCode> component uses MapLibre's
        built-in clustering to efficiently render large numbers of points.
        Points are automatically grouped into clusters at low zoom levels, and
        expand as you zoom in.
      </p>
    </DocsSection>

    <DocsSection id="basic-example" title="Basic Example">
      <p>
        Click on clusters to zoom in. Click individual points to see details in
        a popup.
      </p>
      <ExamplePreview :code="clusterCode" class="mt-4">
        <Map :center="[-103.59, 40.66]" :zoom="3.4" class="h-full">
          <MapClusterLayer
            data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
            :cluster-radius="50"
            :cluster-max-zoom="14"
            :cluster-colors="['#1d8cf8', '#6d5dfc', '#e23670']"
            point-color="#1d8cf8"
            @point-click="handlePointClick"
          />
          <MapPopup
            v-if="selectedPoint"
            :longitude="selectedPoint.coords[0]"
            :latitude="selectedPoint.coords[1]"
            :close-button="true"
            @close="handlePopupClose"
          >
            <div class="space-y-1 p-2">
              <p class="text-sm font-medium">Earthquake</p>
              <p class="text-xs text-muted-foreground">
                Magnitude: {{ (selectedPoint.feature.properties as any)?.mag }}
              </p>
            </div>
          </MapPopup>
          <MapControls />
        </Map>
      </ExamplePreview>
    </DocsSection>
  </DocsLayout>
</template>
