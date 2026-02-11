<script setup lang="ts">
import { ref, watch } from "vue";
import type { MapLayerMouseEvent } from "maplibre-gl";
import { MapPopup, useMap } from "~~/registry/map";
import type { FeatureCollection } from "geojson";

interface SelectedPoint {
  id: number;
  name: string;
  category: string;
  coordinates: [number, number];
}

const props = defineProps<{
  pointsData: FeatureCollection;
}>();

const { map, isLoaded } = useMap();
const selectedPoint = ref<SelectedPoint | null>(null);
const isSetup = ref(false);

// Generate stable IDs
const sourceId = `markers-source-${Math.random().toString(36).substr(2, 9)}`;
const layerId = `markers-layer-${Math.random().toString(36).substr(2, 9)}`;

// Setup layers when map is loaded
watch(
  () => isLoaded.value,
  (loaded) => {
    if (!loaded || !map.value || isSetup.value) return;

    // Add source
    if (!map.value.getSource(sourceId)) {
      map.value.addSource(sourceId, {
        type: "geojson",
        data: props.pointsData,
      });
    }

    // Add layer
    if (!map.value.getLayer(layerId)) {
      map.value.addLayer({
        id: layerId,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-radius": 6,
          "circle-color": "#3b82f6",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
    }

    const handleClick = (e: MapLayerMouseEvent) => {
      if (!e.features?.length) return;
      const feature = e.features[0];
      if (!feature) return;
      selectedPoint.value = {
        id: feature.properties?.id,
        name: feature.properties?.name,
        category: feature.properties?.category,
        coordinates: (feature.geometry as GeoJSON.Point).coordinates as [
          number,
          number,
        ],
      };
    };

    const handleMouseEnter = () => {
      map.value!.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.value!.getCanvas().style.cursor = "";
    };

    map.value.on("click", layerId, handleClick);
    map.value.on("mouseenter", layerId, handleMouseEnter);
    map.value.on("mouseleave", layerId, handleMouseLeave);

    isSetup.value = true;
  },
  { immediate: true },
);
</script>

<template>
  <MapPopup
    v-if="selectedPoint"
    :longitude="selectedPoint.coordinates[0]"
    :latitude="selectedPoint.coordinates[1]"
    :close-on-click="false"
    :offset="10"
    :close-button="true"
    @close="selectedPoint = null"
  >
    <div class="min-w-[140px]">
      <p class="font-medium">{{ selectedPoint.name }}</p>
      <p class="text-sm text-muted-foreground">{{ selectedPoint.category }}</p>
    </div>
  </MapPopup>
</template>
