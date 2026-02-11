<script setup lang="ts">
import { ref } from "vue";
import { Map, MapGeoJson } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Feature, FeatureCollection } from "geojson";

// Sample GeoJSON data - earthquake locations
const earthquakeData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        magnitude: 4.5,
        location: "San Francisco, CA",
        time: "2 hours ago",
      },
      geometry: { type: "Point", coordinates: [-122.4194, 37.7749] },
    },
    {
      type: "Feature",
      properties: {
        magnitude: 3.2,
        location: "Los Angeles, CA",
        time: "5 hours ago",
      },
      geometry: { type: "Point", coordinates: [-118.2437, 34.0522] },
    },
    {
      type: "Feature",
      properties: {
        magnitude: 5.1,
        location: "Seattle, WA",
        time: "1 day ago",
      },
      geometry: { type: "Point", coordinates: [-122.3321, 47.6062] },
    },
    {
      type: "Feature",
      properties: {
        magnitude: 2.8,
        location: "Portland, OR",
        time: "2 days ago",
      },
      geometry: { type: "Point", coordinates: [-122.6784, 45.5152] },
    },
    {
      type: "Feature",
      properties: { magnitude: 4.2, location: "Reno, NV", time: "3 days ago" },
      geometry: { type: "Point", coordinates: [-119.8138, 39.5296] },
    },
  ],
};

// Polygon data - national parks
const parkData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Yellowstone", type: "National Park" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-110.5, 44.2],
            [-110.5, 45.1],
            [-109.8, 45.1],
            [-109.8, 44.2],
            [-110.5, 44.2],
          ],
        ],
      },
    },
  ],
};

// Line data - fault lines
const faultLineData: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "San Andreas Fault", type: "Fault Line" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-122.5, 37.7],
          [-121.8, 36.8],
          [-120.5, 35.5],
          [-119.5, 34.5],
          [-118.5, 33.8],
          [-117.2, 32.8],
        ],
      },
    },
  ],
};

const selectedFeature = ref<Feature | null>(null);

function handlePointClick(feature: Feature) {
  selectedFeature.value = feature;
}
</script>

<template>
  <div class="space-y-4">
    <!-- Feature Info -->
    <Card v-if="selectedFeature">
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">
              {{
                selectedFeature.properties?.location ||
                selectedFeature.properties?.name
              }}
            </h3>
            <p class="text-sm text-muted-foreground">
              {{ selectedFeature.properties?.type }}
            </p>
          </div>
          <div
            v-if="selectedFeature.properties?.magnitude"
            class="text-2xl font-bold text-orange-500"
          >
            M{{ selectedFeature.properties.magnitude }}
          </div>
        </div>
        <p
          v-if="selectedFeature.properties?.time"
          class="text-xs text-muted-foreground mt-2"
        >
          {{ selectedFeature.properties.time }}
        </p>
      </CardContent>
    </Card>

    <!-- Map Tabs -->
    <Tabs default-value="points" class="w-full">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="points">Points (Circles)</TabsTrigger>
        <TabsTrigger value="polygons">Polygons (Fill)</TabsTrigger>
        <TabsTrigger value="lines">Lines</TabsTrigger>
      </TabsList>

      <TabsContent value="points">
        <div class="h-[400px] w-full rounded-lg overflow-hidden border">
          <Map :center="[-120, 37]" :zoom="5" class="h-full">
            <MapGeoJson
              :data="earthquakeData"
              layer-type="circle"
              :style="{
                circleRadius: 8,
                circleColor: '#f97316',
                circleOpacity: 0.8,
                strokeColor: '#fff',
                strokeWidth: 2,
              }"
              :fit-bounds="true"
              :interactive="true"
              @click="handlePointClick"
            />
          </Map>
        </div>
        <p class="text-sm text-muted-foreground mt-2">
          Click on earthquake markers to see details. Circle size represents
          magnitude.
        </p>
      </TabsContent>

      <TabsContent value="polygons">
        <div class="h-[400px] w-full rounded-lg overflow-hidden border">
          <Map :center="[-110, 44.5]" :zoom="6" class="h-full">
            <MapGeoJson
              :data="parkData"
              layer-type="fill"
              :style="{
                fillColor: '#22c55e',
                fillOpacity: 0.5,
                strokeColor: '#15803d',
                strokeWidth: 2,
              }"
              :fit-bounds="true"
            />
          </Map>
        </div>
        <p class="text-sm text-muted-foreground mt-2">
          Polygons with fill color and stroke outline for boundaries.
        </p>
      </TabsContent>

      <TabsContent value="lines">
        <div class="h-[400px] w-full rounded-lg overflow-hidden border">
          <Map :center="[-119, 35]" :zoom="5" class="h-full">
            <MapGeoJson
              :data="faultLineData"
              layer-type="line"
              :style="{
                strokeColor: '#dc2626',
                strokeWidth: 3,
                strokeOpacity: 0.8,
              }"
              :fit-bounds="true"
            />
          </Map>
        </div>
        <p class="text-sm text-muted-foreground mt-2">
          Line strings for paths, routes, or fault lines.
        </p>
      </TabsContent>
    </Tabs>
  </div>
</template>
