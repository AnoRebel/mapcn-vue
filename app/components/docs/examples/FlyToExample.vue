<script setup lang="ts">
import { ref } from "vue";
import type { Map as MapLibreMap } from "maplibre-gl";
import { Map, MapMarker, MarkerContent } from "~~/registry/map";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { Plane, Navigation, Zap, RotateCcw } from "lucide-vue-next";
import type { Component } from "vue";

interface CityLocation {
  name: string;
  coordinates: [number, number];
  zoom: number;
  pitch?: number;
  bearing?: number;
}

const cities: CityLocation[] = [
  { name: "New York", coordinates: [-74.006, 40.7128], zoom: 12 },
  {
    name: "Paris",
    coordinates: [2.3522, 48.8566],
    zoom: 13,
    pitch: 45,
    bearing: 30,
  },
  { name: "Tokyo", coordinates: [139.6917, 35.6895], zoom: 11 },
  {
    name: "Sydney",
    coordinates: [151.2093, -33.8688],
    zoom: 12,
    pitch: 60,
    bearing: -45,
  },
  { name: "Rio de Janeiro", coordinates: [-43.1729, -22.9068], zoom: 11 },
  {
    name: "Dubai",
    coordinates: [55.2708, 25.2048],
    zoom: 13,
    pitch: 50,
    bearing: 120,
  },
];

type AnimationType = "flyTo" | "easeTo" | "jumpTo";

const currentCity = ref<CityLocation>(cities[0]!);
const animationType = ref<AnimationType>("flyTo");
const duration = ref([2000]);
const mapRef = ref<{ getMap: () => MapLibreMap | null } | null>(null);

function getMapInstance(): MapLibreMap | null {
  return mapRef.value?.getMap() ?? null;
}

function flyToCity(city: CityLocation) {
  const map = getMapInstance();
  if (!map) return;

  currentCity.value = city;

  const options = {
    center: city.coordinates as [number, number],
    zoom: city.zoom,
    pitch: city.pitch ?? 0,
    bearing: city.bearing ?? 0,
    duration: duration.value[0],
  };

  switch (animationType.value) {
    case "flyTo":
      map.flyTo(options);
      break;
    case "easeTo":
      map.easeTo(options);
      break;
    case "jumpTo":
      map.jumpTo({
        center: city.coordinates as [number, number],
        zoom: city.zoom,
        pitch: city.pitch ?? 0,
        bearing: city.bearing ?? 0,
      });
      break;
  }
}

function resetView() {
  const map = getMapInstance();
  if (!map) return;

  map.flyTo({
    center: [-74.006, 40.7128],
    zoom: 2,
    pitch: 0,
    bearing: 0,
    duration: 1500,
  });
}

const animationIcons: Record<AnimationType, Component> = {
  flyTo: Plane,
  easeTo: Navigation,
  jumpTo: Zap,
};
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <!-- Controls row -->
    <div
      class="example-controls grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 px-3 py-2 rounded-lg border bg-card shrink-0"
    >
      <!-- Left: animation type + duration -->
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <!-- <span class="text-xs font-medium text-muted-foreground shrink-0"
            >Type:</span
            > -->
          <div class="flex gap-1">
            <Button
              v-for="(icon, type) in animationIcons"
              :key="type"
              :variant="animationType === type ? 'default' : 'outline'"
              size="sm"
              class="h-6 px-2 text-xs"
              @click="animationType = type"
            >
              <component :is="icon" class="w-3 h-3 mr-1" />
              {{ type }}
            </Button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-muted-foreground shrink-0"
            >Duration:</span
          >
          <Slider
            v-model="duration"
            :min="500"
            :max="5000"
            :step="100"
            class="flex-1"
          />
          <span
            class="text-xs tabular-nums text-muted-foreground w-14 text-right"
            >{{ duration[0] }}ms</span
          >
        </div>
      </div>
      <!-- Right: city buttons -->
      <div class="flex flex-wrap gap-1 items-start">
        <Button
          v-for="city in cities"
          :key="city.name"
          variant="outline"
          size="sm"
          class="h-6 px-2 text-xs"
          :class="currentCity.name === city.name ? 'bg-secondary' : ''"
          @click="flyToCity(city)"
        >
          {{ city.name }}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="h-6 px-2 text-xs"
          @click="resetView"
        >
          <RotateCcw class="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>
    </div>

    <!-- Map -->
    <div class="flex-1 min-h-[200px] w-full rounded-lg overflow-hidden border">
      <Map ref="mapRef" :center="[-74.006, 40.7128]" :zoom="2" class="h-full">
        <MapMarker
          v-for="city in cities"
          :key="city.name"
          :longitude="city.coordinates[0]"
          :latitude="city.coordinates[1]"
        >
          <MarkerContent>
            <div
              class="w-2.5 h-2.5 rounded-full bg-primary border-2 border-white shadow-lg"
            />
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  </div>
</template>
