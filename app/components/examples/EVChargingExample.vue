<script setup lang="ts">
import { Map, MapMarker, MarkerContent, MarkerTooltip } from "~~/registry/map";
import { Zap } from "lucide-vue-next";
import ExampleCard from "./ExampleCard.vue";

const stations = [
  {
    lng: -122.4194,
    lat: 37.7749,
    name: "Market St Station",
    status: "Available",
    power: "150 kW",
    price: "$0.35/kWh",
    color: "bg-emerald-500",
  },
  {
    lng: -122.4094,
    lat: 37.7849,
    name: "Union Square",
    status: "2 Available",
    power: "50 kW",
    price: "$0.28/kWh",
    color: "bg-emerald-500",
  },
  {
    lng: -122.4294,
    lat: 37.7689,
    name: "Castro Station",
    status: "In Use",
    power: "~15 min remaining",
    price: "",
    color: "bg-amber-500",
  },
  {
    lng: -122.4394,
    lat: 37.7809,
    name: "Hayes Valley",
    status: "Offline",
    power: "",
    price: "",
    color: "bg-zinc-400",
  },
];
</script>

<template>
  <ExampleCard label="EV Charging" class="aspect-square" delay="delay-700">
    <ClientOnly>
      <Map :center="[-122.425, 37.777]" :zoom="11.5" class="h-full">
        <MapMarker
          v-for="station in stations"
          :key="station.name"
          :longitude="station.lng"
          :latitude="station.lat"
        >
          <MarkerContent>
            <div
              :class="[
                'rounded-full p-1.5 shadow-lg',
                station.color,
                station.color.includes('emerald') && 'shadow-emerald-500/30',
                station.color.includes('amber') && 'shadow-amber-500/30',
              ]"
            >
              <Zap class="size-3 text-white fill-white" />
            </div>
          </MarkerContent>
          <MarkerTooltip>
            <div class="text-xs space-y-0.5">
              <div class="font-medium">{{ station.name }}</div>
              <div class="flex items-center gap-1">
                <span :class="['size-1.5 rounded-full', station.color]" />
                <span
                  :class="
                    station.color.includes('emerald')
                      ? 'text-emerald-500'
                      : station.color.includes('amber')
                        ? 'text-amber-500'
                        : 'text-muted-foreground'
                  "
                >
                  {{ station.status }}
                </span>
              </div>
              <div v-if="station.power" class="text-muted-foreground">
                {{ station.power }}
                <span v-if="station.price">• {{ station.price }}</span>
              </div>
            </div>
          </MarkerTooltip>
        </MapMarker>
      </Map>
    </ClientOnly>
  </ExampleCard>
</template>
