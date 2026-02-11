<script setup lang="ts">
import { ref } from "vue";
import { Map } from "~~/registry/map";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { RotateCcw } from "lucide-vue-next";

const pitch = ref(0);
const bearing = ref(0);
const mapRef = ref<InstanceType<typeof Map>>();

function updateCamera() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = (mapRef.value as any)?.mapInstance;
  if (map) {
    map.easeTo({
      pitch: pitch.value,
      bearing: bearing.value,
      duration: 500,
    });
  }
}

function resetCamera() {
  pitch.value = 0;
  bearing.value = 0;
  updateCamera();
}

const presetViews = [
  { name: "Flat", pitch: 0, bearing: 0 },
  { name: "Tilted", pitch: 45, bearing: 0 },
  { name: "3D View", pitch: 60, bearing: 30 },
  { name: "Overview", pitch: 60, bearing: -45 },
];
</script>

<template>
  <div class="space-y-4">
    <!-- Controls -->
    <Card>
      <CardContent class="p-4 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium">Pitch</span>
              <span class="text-xs text-muted-foreground">{{ pitch }}°</span>
            </div>
            <input
              v-model.number="pitch"
              type="range"
              min="0"
              max="85"
              step="5"
              class="w-full"
              @input="updateCamera"
            />
          </div>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm font-medium">Bearing</span>
              <span class="text-xs text-muted-foreground">{{ bearing }}°</span>
            </div>
            <input
              v-model.number="bearing"
              type="range"
              min="-180"
              max="180"
              step="10"
              class="w-full"
              @input="updateCamera"
            />
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button
            v-for="view in presetViews"
            :key="view.name"
            variant="outline"
            size="sm"
            @click="
              pitch = view.pitch;
              bearing = view.bearing;
              updateCamera();
            "
          >
            {{ view.name }}
          </Button>
          <Button variant="ghost" size="sm" @click="resetCamera">
            <RotateCcw class="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Map -->
    <div class="h-[400px] w-full rounded-lg overflow-hidden border">
      <Map
        ref="mapRef"
        :center="[-74.006, 40.7128]"
        :zoom="15"
        :pitch="pitch"
        :bearing="bearing"
        class="h-full"
      />
    </div>

    <p class="text-sm text-muted-foreground">
      Pitch and bearing controls for 3D map navigation. Adjust the sliders to
      tilt the map (pitch) and rotate the view (bearing). Use preset buttons for
      common angles.
    </p>
  </div>
</template>
