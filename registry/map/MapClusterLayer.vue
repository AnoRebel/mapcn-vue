<script setup lang="ts">
import { ref, computed, onUnmounted, watch, useId } from "vue";
import type {
  MapMouseEvent,
  MapGeoJSONFeature,
  GeoJSONSource,
} from "maplibre-gl";
import { useMap } from "./composables/useMap";

const props = withDefaults(
  defineProps<{
    data: string | GeoJSON.FeatureCollection<GeoJSON.Point>;
    clusterMaxZoom?: number;
    clusterRadius?: number;
    clusterColors?: [string, string, string];
    clusterThresholds?: [number, number];
    pointColor?: string;
    onPointClick?: (
      feature: GeoJSON.Feature<GeoJSON.Point>,
      coordinates: [number, number],
    ) => void;
    onClusterClick?: (
      clusterId: number,
      coordinates: [number, number],
      pointCount: number,
    ) => void;
  }>(),
  {
    clusterMaxZoom: 14,
    clusterRadius: 50,
    clusterColors: () => ["#22c55e", "#eab308", "#ef4444"],
    clusterThresholds: () => [100, 750],
    pointColor: "#3b82f6",
  },
);

const { map, isLoaded } = useMap();
const autoId = useId();
const sourceId = computed(() => `cluster-source-${autoId}`);
const clusterLayerId = computed(() => `clusters-${autoId}`);
const clusterCountLayerId = computed(() => `cluster-count-${autoId}`);
const unclusteredLayerId = computed(() => `unclustered-point-${autoId}`);

const isSetup = ref(false);

// Event handlers stored for cleanup
const handlers = {
  handleClusterClick: null as
    | ((e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => Promise<void>)
    | null,
  handlePointClick: null as
    | ((e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => void)
    | null,
  handleMouseEnterCluster: null as (() => void) | null,
  handleMouseLeaveCluster: null as (() => void) | null,
  handleMouseEnterPoint: null as (() => void) | null,
  handleMouseLeavePoint: null as (() => void) | null,
};

// Setup layers when map is loaded
watch(
  () => isLoaded.value,
  (loaded) => {
    if (!loaded || !map.value || isSetup.value) return;

    // Check if source/layers already exist
    if (map.value.getSource(sourceId.value)) return;

    // Add clustered GeoJSON source
    map.value.addSource(sourceId.value, {
      type: "geojson",
      data: props.data,
      cluster: true,
      clusterMaxZoom: props.clusterMaxZoom,
      clusterRadius: props.clusterRadius,
    });

    // Add cluster circles layer
    map.value.addLayer({
      id: clusterLayerId.value,
      type: "circle",
      source: sourceId.value,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          props.clusterColors[0],
          props.clusterThresholds[0],
          props.clusterColors[1],
          props.clusterThresholds[1],
          props.clusterColors[2],
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          20,
          props.clusterThresholds[0],
          30,
          props.clusterThresholds[1],
          40,
        ],
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
        "circle-opacity": 0.85,
      },
    });

    // Add cluster count text layer
    map.value.addLayer({
      id: clusterCountLayerId.value,
      type: "symbol",
      source: sourceId.value,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 12,
      },
      paint: {
        "text-color": "#fff",
      },
    });

    // Add unclustered point layer
    map.value.addLayer({
      id: unclusteredLayerId.value,
      type: "circle",
      source: sourceId.value,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": props.pointColor,
        "circle-radius": 5,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    // Cluster click handler
    handlers.handleClusterClick = async (
      e: MapMouseEvent & { features?: MapGeoJSONFeature[] },
    ) => {
      const features = map.value!.queryRenderedFeatures(e.point, {
        layers: [clusterLayerId.value],
      });
      if (!features.length) return;

      const feature = features[0]!;
      const clusterId = feature.properties?.cluster_id as number;
      const pointCount = feature.properties?.point_count as number;
      const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number,
      ];

      if (props.onClusterClick) {
        props.onClusterClick(clusterId, coordinates, pointCount);
      } else {
        const source = map.value!.getSource(sourceId.value) as GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.value!.easeTo({ center: coordinates, zoom });
      }
    };

    // Unclustered point click handler
    handlers.handlePointClick = (
      e: MapMouseEvent & { features?: MapGeoJSONFeature[] },
    ) => {
      if (!props.onPointClick || !e.features?.length) return;

      const feature = e.features[0]!;
      const coordinates = (
        feature.geometry as GeoJSON.Point
      ).coordinates.slice() as [number, number];

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      props.onPointClick(
        feature as unknown as GeoJSON.Feature<GeoJSON.Point>,
        coordinates,
      );
    };

    // Cursor style handlers
    handlers.handleMouseEnterCluster = () => {
      map.value!.getCanvas().style.cursor = "pointer";
    };
    handlers.handleMouseLeaveCluster = () => {
      map.value!.getCanvas().style.cursor = "";
    };
    handlers.handleMouseEnterPoint = () => {
      if (props.onPointClick) {
        map.value!.getCanvas().style.cursor = "pointer";
      }
    };
    handlers.handleMouseLeavePoint = () => {
      map.value!.getCanvas().style.cursor = "";
    };

    map.value.on("click", clusterLayerId.value, handlers.handleClusterClick);
    map.value.on("click", unclusteredLayerId.value, handlers.handlePointClick);
    map.value.on(
      "mouseenter",
      clusterLayerId.value,
      handlers.handleMouseEnterCluster,
    );
    map.value.on(
      "mouseleave",
      clusterLayerId.value,
      handlers.handleMouseLeaveCluster,
    );
    map.value.on(
      "mouseenter",
      unclusteredLayerId.value,
      handlers.handleMouseEnterPoint,
    );
    map.value.on(
      "mouseleave",
      unclusteredLayerId.value,
      handlers.handleMouseLeavePoint,
    );

    isSetup.value = true;
  },
  { immediate: true },
);

// Cleanup
onUnmounted(() => {
  if (!map.value || !isSetup.value) return;

  if (handlers.handleClusterClick) {
    map.value.off("click", clusterLayerId.value, handlers.handleClusterClick);
  }
  if (handlers.handlePointClick) {
    map.value.off("click", unclusteredLayerId.value, handlers.handlePointClick);
  }
  if (handlers.handleMouseEnterCluster) {
    map.value.off(
      "mouseenter",
      clusterLayerId.value,
      handlers.handleMouseEnterCluster,
    );
  }
  if (handlers.handleMouseLeaveCluster) {
    map.value.off(
      "mouseleave",
      clusterLayerId.value,
      handlers.handleMouseLeaveCluster,
    );
  }
  if (handlers.handleMouseEnterPoint) {
    map.value.off(
      "mouseenter",
      unclusteredLayerId.value,
      handlers.handleMouseEnterPoint,
    );
  }
  if (handlers.handleMouseLeavePoint) {
    map.value.off(
      "mouseleave",
      unclusteredLayerId.value,
      handlers.handleMouseLeavePoint,
    );
  }

  try {
    if (map.value.getLayer(clusterCountLayerId.value))
      map.value.removeLayer(clusterCountLayerId.value);
    if (map.value.getLayer(unclusteredLayerId.value))
      map.value.removeLayer(unclusteredLayerId.value);
    if (map.value.getLayer(clusterLayerId.value))
      map.value.removeLayer(clusterLayerId.value);
    if (map.value.getSource(sourceId.value))
      map.value.removeSource(sourceId.value);
  } catch {
    // ignore
  }
});

// Watch for data changes (only for non-URL data)
watch(
  () => props.data,
  (data) => {
    if (!isLoaded.value || !map.value || typeof data === "string") return;
    const source = map.value.getSource(sourceId.value) as GeoJSONSource;
    if (source) {
      source.setData(data);
    }
  },
  { deep: true },
);

// Watch for style changes
watch(
  [
    () => props.clusterColors,
    () => props.clusterThresholds,
    () => props.pointColor,
  ],
  () => {
    if (!isLoaded.value || !map.value) return;

    if (map.value.getLayer(clusterLayerId.value)) {
      map.value.setPaintProperty(clusterLayerId.value, "circle-color", [
        "step",
        ["get", "point_count"],
        props.clusterColors[0],
        props.clusterThresholds[0],
        props.clusterColors[1],
        props.clusterThresholds[1],
        props.clusterColors[2],
      ]);
      map.value.setPaintProperty(clusterLayerId.value, "circle-radius", [
        "step",
        ["get", "point_count"],
        20,
        props.clusterThresholds[0],
        30,
        props.clusterThresholds[1],
        40,
      ]);
    }

    if (map.value.getLayer(unclusteredLayerId.value)) {
      map.value.setPaintProperty(
        unclusteredLayerId.value,
        "circle-color",
        props.pointColor,
      );
    }
  },
);
</script>
