<script setup lang="ts">
import { ref, computed } from "vue";
import { Map, MapGeoJson } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import type { Feature, FeatureCollection } from "geojson";

// Unemployment data by state
const unemploymentByState: Record<string, number> = {
  Alabama: 2.8,
  Alaska: 5.3,
  Arizona: 3.7,
  Arkansas: 3.5,
  California: 5.3,
  Colorado: 3.4,
  Connecticut: 4.2,
  Delaware: 4.4,
  Florida: 3.3,
  Georgia: 3.4,
  Hawaii: 3.0,
  Idaho: 3.1,
  Illinois: 4.8,
  Indiana: 3.4,
  Iowa: 2.9,
  Kansas: 2.9,
  Kentucky: 4.3,
  Louisiana: 4.0,
  Maine: 3.0,
  Maryland: 2.9,
  Massachusetts: 3.5,
  Michigan: 4.1,
  Minnesota: 3.2,
  Mississippi: 3.8,
  Missouri: 3.4,
  Montana: 3.1,
  Nebraska: 2.9,
  Nevada: 5.1,
  "New Hampshire": 2.7,
  "New Jersey": 4.2,
  "New Mexico": 4.0,
  "New York": 4.5,
  "North Carolina": 3.4,
  "North Dakota": 2.5,
  Ohio: 4.0,
  Oklahoma: 3.4,
  Oregon: 4.3,
  Pennsylvania: 3.7,
  "Rhode Island": 4.1,
  "South Carolina": 3.3,
  "South Dakota": 2.7,
  Tennessee: 3.3,
  Texas: 4.0,
  Utah: 3.0,
  Vermont: 2.6,
  Virginia: 3.1,
  Washington: 4.2,
  "West Virginia": 4.1,
  Wisconsin: 3.1,
  Wyoming: 3.4,
};

// Color scale thresholds
const colorThresholds = [
  { value: 3, color: "#fef0d9" },
  { value: 4, color: "#fdcc8a" },
  { value: 5, color: "#fc8d59" },
  { value: 6, color: "#e34a33" },
  { value: 10, color: "#b30000" },
];

function getColor(rate: number): string {
  for (const threshold of colorThresholds) {
    if (rate <= threshold.value) return threshold.color;
  }
  return colorThresholds[colorThresholds.length - 1]!.color;
}

// Sample GeoJSON for US states (simplified)
const statesGeoJson = ref<FeatureCollection>({
  type: "FeatureCollection",
  features: [],
});

const isLoading = ref(true);
const selectedState = ref<string | null>(null);

// Load US states GeoJSON
onMounted(async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json",
    );
    const data = (await response.json()) as FeatureCollection;

    // Add unemployment data and colors
    data.features = data.features.map((feature: Feature) => {
      const stateName = feature.properties?.name;
      const rate = unemploymentByState[stateName] || 4.0;
      return {
        ...feature,
        properties: {
          ...feature.properties,
          unemploymentRate: rate,
          fillColor: getColor(rate),
        },
      };
    });

    statesGeoJson.value = data;
  } catch (error) {
    console.error("Failed to load states data:", error);
  } finally {
    isLoading.value = false;
  }
});

const legendItems = colorThresholds.map((threshold, index) => ({
  color: threshold.color,
  label:
    index === 0
      ? `< ${threshold.value}%`
      : index === colorThresholds.length - 1
        ? `> ${colorThresholds[index - 1]!.value}%`
        : `${colorThresholds[index - 1]!.value}% - ${threshold.value}%`,
}));

function handleFeatureClick(feature: Feature) {
  selectedState.value = feature.properties?.name;
}

const selectedStateData = computed(() => {
  if (!selectedState.value) return null;
  const rate = unemploymentByState[selectedState.value];
  return { name: selectedState.value, rate };
});
</script>

<template>
  <div class="space-y-1">
    <!-- Info Panel -->
    <Card v-if="selectedStateData" class="py-1 gap-1">
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">{{ selectedStateData.name }}</h3>
            <p class="text-sm text-muted-foreground">Unemployment Rate</p>
          </div>
          <div
            class="text-2xl font-bold"
            :style="{ color: getColor(selectedStateData.rate ?? 0) }"
          >
            {{ selectedStateData.rate }}%
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border relative">
      <Map :center="[-96, 37.8]" :zoom="3.5" class="h-full">
        <MapGeoJson
          v-if="!isLoading"
          :data="statesGeoJson"
          layer-type="fill"
          :style="{ fillOpacity: 0.8, strokeWidth: 1, strokeColor: '#fff' }"
          :fit-bounds="true"
          :interactive="true"
          @click="handleFeatureClick"
        />
      </Map>

      <!-- Legend -->
      <div
        class="absolute bottom-4 left-4 bg-background/90 backdrop-blur p-3 rounded-lg shadow-lg border"
      >
        <p class="text-xs font-medium mb-2">Unemployment Rate</p>
        <div class="space-y-1">
          <div
            v-for="item in legendItems"
            :key="item.label"
            class="flex items-center gap-2"
          >
            <div
              class="w-4 h-4 rounded"
              :style="{ backgroundColor: item.color }"
            />
            <span class="text-xs">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <p v-if="isLoading" class="text-center text-sm text-muted-foreground">
      Loading map data...
    </p>
  </div>
</template>
