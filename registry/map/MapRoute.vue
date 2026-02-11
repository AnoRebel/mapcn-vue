<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, useId, computed } from "vue";
import MapLibreGL from "maplibre-gl";
import { useMap } from "./composables/useMap";

const props = withDefaults(
  defineProps<{
    id?: string;
    coordinates: [number, number][];
    color?: string;
    width?: number;
    opacity?: number;
    dashArray?: [number, number];
    animated?: boolean;
    animationDuration?: number;
    fitBounds?: boolean;
    fitBoundsOptions?: maplibregl.FitBoundsOptions;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    interactive?: boolean;
  }>(),
  {
    color: "#4285F4",
    width: 3,
    opacity: 0.8,
    animated: false,
    animationDuration: 2000,
    fitBounds: false,
    interactive: true,
  },
);

const { map, isLoaded } = useMap();
const autoId = useId();
const id = computed(() => props.id ?? autoId);
const sourceId = computed(() => `route-source-${id.value}`);
const layerId = computed(() => `route-layer-${id.value}`);
const animationFrame = ref<number>();
const isSetup = ref(false);

// Event handlers - defined at component scope so they're accessible in cleanup
const handleClick = () => props.onClick?.();
const handleMouseEnter = () => {
  if (map.value) {
    map.value.getCanvas().style.cursor = "pointer";
  }
  props.onMouseEnter?.();
};
const handleMouseLeave = () => {
  if (map.value) {
    map.value.getCanvas().style.cursor = "";
  }
  props.onMouseLeave?.();
};

// Animated line drawing function
function animateRoute(coordinates: [number, number][]) {
  if (!map.value || !props.animated) return;

  const startTime = performance.now();
  const duration = props.animationDuration;
  const totalPoints = coordinates.length;

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const pointCount = Math.max(2, Math.floor(easedProgress * totalPoints));
    const currentCoordinates = coordinates.slice(0, pointCount);

    const source = map.value!.getSource(sourceId.value) as
      | MapLibreGL.GeoJSONSource
      | undefined;
    if (source) {
      source.setData({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: currentCoordinates },
      });
    }

    if (progress < 1) {
      animationFrame.value = requestAnimationFrame(step);
    }
  }

  animationFrame.value = requestAnimationFrame(step);
}

function setupLayer() {
  if (!map.value || isSetup.value) return;

  // Check if source/layer already exists
  if (map.value.getSource(sourceId.value)) return;

  map.value.addSource(sourceId.value, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: [] },
    },
  });

  map.value.addLayer({
    id: layerId.value,
    type: "line",
    source: sourceId.value,
    layout: { "line-join": "round", "line-cap": "round" },
    paint: {
      "line-color": props.color,
      "line-width": props.width,
      "line-opacity": props.opacity,
      ...(props.dashArray && { "line-dasharray": props.dashArray }),
    },
  });

  isSetup.value = true;

  // Set data
  if (props.coordinates.length >= 2) {
    if (props.animated) {
      animateRoute(props.coordinates);
    } else {
      const source = map.value.getSource(
        sourceId.value,
      ) as MapLibreGL.GeoJSONSource;
      source.setData({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: props.coordinates },
      });
    }

    // Fit bounds to route if enabled
    if (props.fitBounds) {
      const bounds = new MapLibreGL.LngLatBounds();
      props.coordinates.forEach((coord) => {
        bounds.extend(coord as [number, number]);
      });
      map.value.fitBounds(bounds, {
        padding: 50,
        ...props.fitBoundsOptions,
      });
    }
  }

  if (props.interactive) {
    map.value.on("click", layerId.value, handleClick);
    map.value.on("mouseenter", layerId.value, handleMouseEnter);
    map.value.on("mouseleave", layerId.value, handleMouseLeave);
  }
}

function cleanupLayer() {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }
  if (!map.value || !isSetup.value) return;

  if (props.interactive) {
    map.value.off("click", layerId.value, handleClick);
    map.value.off("mouseenter", layerId.value, handleMouseEnter);
    map.value.off("mouseleave", layerId.value, handleMouseLeave);
  }

  try {
    if (map.value.getLayer(layerId.value)) map.value.removeLayer(layerId.value);
    if (map.value.getSource(sourceId.value))
      map.value.removeSource(sourceId.value);
  } catch {
    // ignore
  }

  isSetup.value = false;
}

onMounted(() => {
  // Wait for map to be loaded
  if (isLoaded.value) {
    setupLayer();
  } else {
    const unwatch = watch(isLoaded, (loaded) => {
      if (loaded) {
        setupLayer();
        unwatch();
      }
    });
  }
});

onUnmounted(cleanupLayer);

// Watch for coordinate changes
watch(
  () => props.coordinates,
  (coordinates) => {
    if (
      !isLoaded.value ||
      !map.value ||
      coordinates.length < 2 ||
      !isSetup.value
    )
      return;
    const source = map.value.getSource(
      sourceId.value,
    ) as MapLibreGL.GeoJSONSource;
    if (source) {
      if (props.animated) {
        animateRoute(coordinates);
      } else {
        source.setData({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates },
        });
      }
    }
  },
  { deep: true },
);

// Watch for style changes
watch(
  [
    () => props.color,
    () => props.width,
    () => props.opacity,
    () => props.dashArray,
  ],
  () => {
    if (!isLoaded.value || !map.value || !map.value.getLayer(layerId.value))
      return;
    map.value.setPaintProperty(layerId.value, "line-color", props.color);
    map.value.setPaintProperty(layerId.value, "line-width", props.width);
    map.value.setPaintProperty(layerId.value, "line-opacity", props.opacity);
    if (props.dashArray) {
      map.value.setPaintProperty(
        layerId.value,
        "line-dasharray",
        props.dashArray,
      );
    }
  },
);
</script>
