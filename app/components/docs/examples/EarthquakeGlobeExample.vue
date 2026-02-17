<script setup lang="ts">
import { ref, computed, markRaw, onMounted, watch } from "vue";
import { Map, DeckGLOverlay, MapStarfieldLayer } from "~~/registry/map";
import { ScatterplotLayer } from "@deck.gl/layers";
import { useMap } from "~~/registry/map/composables/useMap";

// --- Types ---
interface EarthquakeProperties {
  mag: number;
  place: string;
  time: number;
  title: string;
}

interface EarthquakeFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number, number];
  };
  properties: EarthquakeProperties;
}

interface EarthquakeGeoJSON {
  type: "FeatureCollection";
  features: EarthquakeFeature[];
}

interface EarthquakeData {
  coordinates: [number, number];
  magnitude: number;
  depth: number;
  place: string;
  time: number;
  title: string;
}

// --- Data ---
const USGS_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

const earthquakeData = ref<EarthquakeData[]>([]);
const selectedQuake = ref<EarthquakeData | null>(null);
const loading = ref(true);

function getQuakeColor(mag: number): [number, number, number, number] {
  if (mag < 3) return [0, 200, 100, 180];
  if (mag < 5) return [255, 200, 0, 200];
  if (mag < 6) return [255, 120, 0, 220];
  return [255, 30, 30, 255];
}

onMounted(async () => {
  try {
    const response = await fetch(USGS_URL);
    const data: EarthquakeGeoJSON = await response.json();
    earthquakeData.value = data.features.map((f) => ({
      coordinates: [f.geometry.coordinates[0]!, f.geometry.coordinates[1]!] as [
        number,
        number,
      ],
      magnitude: f.properties.mag,
      depth: f.geometry.coordinates[2]!,
      place: f.properties.place,
      time: f.properties.time,
      title: f.properties.title,
    }));
  } catch (e) {
    console.error("Failed to fetch earthquake data:", e);
  } finally {
    loading.value = false;
  }
});

const layers = computed(() => {
  if (earthquakeData.value.length === 0) return [];
  return [
    markRaw(
      new ScatterplotLayer<EarthquakeData>({
        id: "earthquakes",
        data: earthquakeData.value,
        getPosition: (d) => d.coordinates,
        getRadius: (d) => Math.pow(2, d.magnitude) * 1000,
        getFillColor: (d) => getQuakeColor(d.magnitude),
        radiusMinPixels: 4,
        radiusMaxPixels: 45,
        opacity: 0.9,
        pickable: true,
        antialiasing: true,
        onClick: (info) => {
          if (info.object) selectedQuake.value = info.object;
        },
      }),
    ),
  ];
});

function clearSelection() {
  selectedQuake.value = null;
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

const magnitudeBarWidth = computed(() =>
  selectedQuake.value
    ? `${Math.min((selectedQuake.value.magnitude / 10) * 100, 100)}%`
    : "0%",
);

const depthBarWidth = computed(() =>
  selectedQuake.value
    ? `${Math.min((selectedQuake.value.depth / 700) * 100, 100)}%`
    : "0%",
);

// --- Starfield Layer ---
// The starfield is a MapLibre custom layer (not a Vue component), so we add
// it imperatively once the map is loaded.
const StarfieldSetup = defineComponent({
  setup() {
    const { map, isLoaded, isStyleLoaded } = useMap();

    function addStarfield() {
      if (!map.value) return;
      // Only add once
      if (map.value.getLayer("starfield")) return;

      const starfield = new MapStarfieldLayer({
        id: "starfield",
        starCount: 5000,
        starSize: 2.5,
        galaxyTextureUrl:
          "https://raw.githubusercontent.com/geoql/maplibre-gl-starfield/main/public/milkyway.jpg",
        galaxyBrightness: 0.35,
      });

      // Insert before the first map layer (satellite tiles)
      const firstLayer = map.value.getStyle()?.layers?.[0];
      map.value.addLayer(starfield, firstLayer?.id);
    }

    watch(
      [isLoaded, isStyleLoaded],
      ([loaded, styleLoaded]) => {
        if (loaded && styleLoaded) addStarfield();
      },
      { immediate: true },
    );

    return () => null; // renderless component
  },
});

// Satellite style with globe projection and atmosphere
const satelliteStyle = {
  version: 8 as const,
  sources: {
    satellite: {
      type: "raster" as const,
      tiles: [
        "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg",
      ],
      tileSize: 256,
    },
  },
  layers: [{ id: "satellite", type: "raster" as const, source: "satellite" }],
} satisfies Record<string, unknown>;
</script>

<template>
  <div class="relative h-full w-full bg-black rounded-lg overflow-hidden">
    <Map
      :center="[0, 20]"
      :zoom="1.5"
      :projection="{ type: 'globe' }"
      :styles="{ light: satelliteStyle, dark: satelliteStyle }"
      class="h-full"
    >
      <StarfieldSetup />
      <DeckGLOverlay
        v-if="!loading && earthquakeData.length > 0"
        :layers="layers"
        :interleaved="false"
      />
    </Map>

    <!-- Earthquake info panel -->
    <Transition name="slide-up">
      <div
        v-if="selectedQuake"
        class="absolute bottom-3 left-3 z-10 max-w-[calc(100%-24px)] rounded-lg border border-cyan-500/20 bg-gray-950/90 p-4 shadow-[0_0_30px_rgba(0,200,255,0.06)] backdrop-blur-xl sm:w-72"
      >
        <button
          class="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          @click="clearSelection"
        >
          ✕
        </button>

        <h3
          class="mb-3 pr-7 text-sm font-bold uppercase leading-tight tracking-wider text-cyan-400"
        >
          {{ selectedQuake.place }}
        </h3>

        <div class="mb-3 space-y-1 text-xs text-white/70">
          <p>Magnitude: {{ selectedQuake.magnitude.toFixed(1) }}</p>
          <p>Depth: {{ selectedQuake.depth.toFixed(0) }} km</p>
          <p>Time: {{ formatTime(selectedQuake.time) }}</p>
        </div>

        <div class="space-y-2.5">
          <div>
            <div class="mb-1 flex items-center justify-between text-xs">
              <span class="font-medium tracking-wider text-white/40"
                >MAGNITUDE</span
              >
              <span class="font-mono text-xs font-bold text-cyan-400">{{
                selectedQuake.magnitude.toFixed(1)
              }}</span>
            </div>
            <div class="h-2 rounded-full bg-white/5">
              <div
                class="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-all duration-500"
                :style="{ width: magnitudeBarWidth }"
              />
            </div>
          </div>
          <div>
            <div class="mb-1 flex items-center justify-between text-xs">
              <span class="font-medium tracking-wider text-white/40"
                >DEPTH</span
              >
              <span class="font-mono text-xs font-bold text-orange-400"
                >{{ selectedQuake.depth.toFixed(0) }} km</span
              >
            </div>
            <div class="h-2 rounded-full bg-white/5">
              <div
                class="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_10px_rgba(249,115,22,0.4)] transition-all duration-500"
                :style="{ width: depthBarWidth }"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div class="text-center">
        <div
          class="mb-2 size-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent"
        />
        <p class="text-sm text-white/60">Loading earthquake data...</p>
      </div>
    </div>

    <!-- Legend -->
    <div
      v-if="!loading"
      class="absolute top-3 left-3 z-10 rounded-lg border border-white/10 bg-gray-950/80 p-3 backdrop-blur-xl"
    >
      <p class="text-xs font-medium text-white/60 mb-2">Magnitude</p>
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <div class="size-2.5 rounded-full bg-red-500" />
          <span class="text-[10px] text-white/50">6.0+ Major</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-2.5 rounded-full bg-orange-500" />
          <span class="text-[10px] text-white/50">5.0–6.0</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-2.5 rounded-full bg-yellow-400" />
          <span class="text-[10px] text-white/50">3.0–5.0</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-2.5 rounded-full bg-green-400" />
          <span class="text-[10px] text-white/50">&lt;3.0 Minor</span>
        </div>
      </div>
      <p class="text-[10px] text-white/30 mt-2">
        USGS M2.5+ past 7 days · click for details
      </p>
    </div>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
