<script setup lang="ts">
import { ref, computed } from "vue";
import type { StyleSpecification } from "maplibre-gl";
import { Map, MapGeoJson } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import type { FeatureCollection } from "geojson";

// Parks layer
const parksData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Central Park", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.98, 40.77],
            [-73.95, 40.77],
            [-73.95, 40.8],
            [-73.98, 40.8],
            [-73.98, 40.77],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Riverside Park", type: "park" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.99, 40.78],
            [-73.97, 40.78],
            [-73.97, 40.81],
            [-73.99, 40.81],
            [-73.99, 40.78],
          ],
        ],
      },
    },
  ],
};

// Buildings layer
const buildingsData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Empire State", type: "building" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.986, 40.748],
            [-73.985, 40.748],
            [-73.985, 40.749],
            [-73.986, 40.749],
            [-73.986, 40.748],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { name: "Chrysler Building", type: "building" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-73.975, 40.751],
            [-73.974, 40.751],
            [-73.974, 40.752],
            [-73.975, 40.752],
            [-73.975, 40.751],
          ],
        ],
      },
    },
  ],
};

// Transit layer
const transitData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Subway Line 1", type: "transit" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.0, 40.72],
          [-73.99, 40.74],
          [-73.98, 40.76],
          [-73.97, 40.78],
        ],
      },
    },
  ],
};

const layers = ref({
  parks: { visible: true, opacity: 0.5, name: "Parks", color: "#22c55e" },
  buildings: {
    visible: true,
    opacity: 0.7,
    name: "Buildings",
    color: "#dc2626",
  },
  transit: { visible: true, opacity: 0.8, name: "Transit", color: "#2563eb" },
});

const currentStyle = ref<"light" | "dark" | "satellite">("light");

const styles = {
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  satellite: {
    version: 8,
    sources: {
      satellite: {
        type: "raster",
        tiles: [
          "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg",
        ],
        tileSize: 256,
      },
    },
    layers: [{ id: "satellite", type: "raster", source: "satellite" }],
  },
};

const mapStyles = computed(() => {
  const base = styles[currentStyle.value];
  if (typeof base === "string") {
    return { light: base, dark: base };
  }
  return {
    light: base as StyleSpecification,
    dark: base as StyleSpecification,
  };
});
</script>

<template>
  <div class="space-y-4">
    <!-- Layer Switcher -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <h3 class="font-semibold text-sm">Layers</h3>
        <div class="space-y-3">
          <div
            v-for="(layer, key) in layers"
            :key="key"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: layer.color }"
              />
              <span class="text-sm">{{ layer.name }}</span>
            </div>
            <Switch v-model="layer.visible" />
          </div>
        </div>

        <div class="border-t pt-4 mt-4">
          <h3 class="font-semibold text-sm mb-3">Basemap Style</h3>
          <div class="flex gap-2">
            <button
              v-for="style in ['light', 'dark', 'satellite']"
              :key="style"
              :class="
                currentStyle === style
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary'
              "
              class="px-3 py-1 text-sm rounded-md capitalize"
              @click="currentStyle = style as 'light' | 'dark' | 'satellite'"
            >
              {{ style }}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map
        :center="[-73.97, 40.77]"
        :zoom="12"
        :styles="mapStyles"
        class="h-full"
      >
        <MapGeoJson
          v-if="layers.parks.visible"
          :data="parksData"
          layer-type="fill"
          :style="{
            fillColor: layers.parks.color,
            fillOpacity: layers.parks.opacity,
            strokeColor: '#15803d',
            strokeWidth: 2,
          }"
        />
        <MapGeoJson
          v-if="layers.buildings.visible"
          :data="buildingsData"
          layer-type="fill"
          :style="{
            fillColor: layers.buildings.color,
            fillOpacity: layers.buildings.opacity,
            strokeColor: '#991b1b',
            strokeWidth: 2,
          }"
        />
        <MapGeoJson
          v-if="layers.transit.visible"
          :data="transitData"
          layer-type="line"
          :style="{
            strokeColor: layers.transit.color,
            strokeWidth: 3,
            strokeOpacity: layers.transit.opacity,
          }"
        />
      </Map>
    </div>

    <p class="text-sm text-muted-foreground">
      Interactive layer switcher demonstrating dynamic layer visibility, opacity
      control, and basemap style switching. Toggle layers on/off and switch
      between light, dark, and satellite views.
    </p>
  </div>
</template>
