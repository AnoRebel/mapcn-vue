<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import MapLibreGL from "maplibre-gl";
import type { MapLayerMouseEvent } from "maplibre-gl";
import { useMap } from "~~/registry/map";
import { Button } from "~/components/ui/button";
import { Layers, X } from "lucide-vue-next";
import type { FeatureCollection } from "geojson";

const props = defineProps<{
  geojsonData: FeatureCollection;
}>();

const { map, isLoaded } = useMap();
const isLayerVisible = ref(false);
const hoveredPark = ref<string | null>(null);
const layersReady = ref(false);
const hasFitBounds = ref(false);

const sourceId = `parks-${Math.random().toString(36).substr(2, 9)}`;
const fillLayerId = `parks-fill-${Math.random().toString(36).substr(2, 9)}`;
const outlineLayerId = `parks-outline-${Math.random().toString(36).substr(2, 9)}`;

let cleanup: (() => void) | null = null;

// Calculate bounds from GeoJSON features
function calculateBounds(
  geojson: FeatureCollection,
): MapLibreGL.LngLatBounds | null {
  if (!geojson || !geojson.features) return null;

  const bounds = new MapLibreGL.LngLatBounds();
  let hasCoords = false;

  geojson.features.forEach((feature) => {
    if (feature.geometry && feature.geometry.type === "Polygon") {
      const coords = feature.geometry.coordinates;
      coords[0]?.forEach((coord) => {
        bounds.extend(coord as [number, number]);
        hasCoords = true;
      });
    }
  });

  return hasCoords ? bounds : null;
}

// Setup layers when map is loaded
const stopWatch = watch(
  () => isLoaded.value,
  (loaded) => {
    if (!loaded || !map.value) return;

    // Add source
    if (!map.value.getSource(sourceId)) {
      map.value.addSource(sourceId, {
        type: "geojson",
        data: props.geojsonData,
      });
    }

    // Add fill layer (initially hidden)
    if (!map.value.getLayer(fillLayerId)) {
      map.value.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": "#22c55e",
          "fill-opacity": 0.4,
        },
        layout: {
          visibility: "none",
        },
      });
    }

    // Add outline layer (initially hidden)
    if (!map.value.getLayer(outlineLayerId)) {
      map.value.addLayer({
        id: outlineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "#16a34a",
          "line-width": 2,
        },
        layout: {
          visibility: "none",
        },
      });
    }

    layersReady.value = true;

    // Setup event handlers
    const handleMouseEnter = () => {
      if (!map.value) return;
      map.value.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      if (!map.value) return;
      map.value.getCanvas().style.cursor = "";
      hoveredPark.value = null;
    };

    const handleMouseMove = (e: MapLayerMouseEvent) => {
      if (!map.value) return;
      const features = map.value.queryRenderedFeatures(e.point, {
        layers: [fillLayerId],
      });
      const feature = features[0];
      if (feature && feature.properties) {
        hoveredPark.value = feature.properties.name || null;
      }
    };

    // Attach event handlers
    if (map.value.getLayer(fillLayerId)) {
      map.value.on("mouseenter", fillLayerId, handleMouseEnter);
      map.value.on("mouseleave", fillLayerId, handleMouseLeave);
      map.value.on("mousemove", fillLayerId, handleMouseMove);
    }

    // Store cleanup
    cleanup = () => {
      if (!map.value) return;
      if (map.value.getLayer(fillLayerId)) {
        map.value.off("mouseenter", fillLayerId, handleMouseEnter);
        map.value.off("mouseleave", fillLayerId, handleMouseLeave);
        map.value.off("mousemove", fillLayerId, handleMouseMove);
      }
    };
  },
  { immediate: true },
);

onUnmounted(() => {
  stopWatch();
  if (cleanup) cleanup();
});

const toggleLayer = () => {
  if (!map.value || !layersReady.value) return;

  const visibility = isLayerVisible.value ? "none" : "visible";

  try {
    if (map.value.getLayer(fillLayerId)) {
      map.value.setLayoutProperty(fillLayerId, "visibility", visibility);
    }
    if (map.value.getLayer(outlineLayerId)) {
      map.value.setLayoutProperty(outlineLayerId, "visibility", visibility);
    }

    // Fit bounds to parks when showing layer (only first time)
    if (!isLayerVisible.value && !hasFitBounds.value) {
      const bounds = calculateBounds(props.geojsonData);
      if (bounds) {
        map.value.fitBounds(bounds, {
          padding: 50,
          duration: 1000,
        });
        hasFitBounds.value = true;
      }
    }

    isLayerVisible.value = !isLayerVisible.value;
  } catch (e) {
    console.error("Error toggling layer:", e);
  }
};
</script>

<template>
  <div class="absolute top-3 left-3 z-10">
    <Button
      size="sm"
      :variant="isLayerVisible ? 'default' : 'secondary'"
      :disabled="!layersReady"
      @click="toggleLayer"
    >
      <X v-if="isLayerVisible" class="size-4 mr-1.5" />
      <Layers v-else class="size-4 mr-1.5" />
      {{ isLayerVisible ? "Hide Parks" : "Show Parks" }}
    </Button>
  </div>
  <div
    v-if="hoveredPark"
    class="absolute bottom-3 left-3 z-10 rounded-md bg-background/90 backdrop-blur px-3 py-2 text-sm font-medium border"
  >
    {{ hoveredPark }}
  </div>
</template>
