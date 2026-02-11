<script setup lang="ts">
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MarkerPopup,
} from "~~/registry/map";
import { Button } from "~/components/ui/button";
import { Star, Navigation, Clock, ExternalLink } from "lucide-vue-next";

interface Place {
  id: number;
  name: string;
  label: string;
  category: string;
  rating: number;
  reviews: number;
  hours: string;
  image: string;
  lng: number;
  lat: number;
}

const places: Place[] = [
  {
    id: 1,
    name: "The Metropolitan Museum of Art",
    label: "Museum",
    category: "Museum",
    rating: 4.8,
    reviews: 12453,
    hours: "10:00 AM - 5:00 PM",
    image:
      "https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=300&h=200&fit=crop",
    lng: -73.9632,
    lat: 40.7794,
  },
  {
    id: 2,
    name: "Brooklyn Bridge",
    label: "Landmark",
    category: "Landmark",
    rating: 4.9,
    reviews: 8234,
    hours: "Open 24 hours",
    image:
      "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?w=300&h=200&fit=crop",
    lng: -73.9969,
    lat: 40.7061,
  },
  {
    id: 3,
    name: "Grand Central Terminal",
    label: "Transit",
    category: "Transit",
    rating: 4.7,
    reviews: 5621,
    hours: "5:15 AM - 2:00 AM",
    image:
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=300&h=200&fit=crop",
    lng: -73.9772,
    lat: 40.7527,
  },
];
</script>

<template>
  <div class="h-[500px] w-full">
    <Map :center="[-73.98, 40.74]" :zoom="11" class="h-full">
      <MapMarker
        v-for="place in places"
        :key="place.id"
        :longitude="place.lng"
        :latitude="place.lat"
      >
        <MarkerContent>
          <div
            class="size-5 rounded-full bg-rose-500 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
          />
          <MarkerLabel position="bottom">{{ place.label }}</MarkerLabel>
        </MarkerContent>
        <MarkerPopup class="p-0 w-62">
          <div class="relative h-32 overflow-hidden rounded-t-md">
            <img
              :src="place.image"
              :alt="place.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="space-y-2 p-3">
            <div>
              <span
                class="text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                {{ place.category }}
              </span>
              <h3 class="font-semibold text-foreground leading-tight">
                {{ place.name }}
              </h3>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <div class="flex items-center gap-1">
                <Star class="size-3.5 fill-amber-400 text-amber-400" />
                <span class="font-medium">{{ place.rating }}</span>
                <span class="text-muted-foreground">
                  ({{ place.reviews.toLocaleString() }})
                </span>
              </div>
            </div>
            <div
              class="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Clock class="size-3.5" />
              <span>{{ place.hours }}</span>
            </div>
            <div class="flex gap-2 pt-1">
              <Button size="sm" class="flex-1 h-8">
                <Navigation class="size-3.5 mr-1.5" />
                Directions
              </Button>
              <Button size="sm" variant="outline" class="h-8">
                <ExternalLink class="size-3.5" />
              </Button>
            </div>
          </div>
        </MarkerPopup>
      </MapMarker>
    </Map>
  </div>
</template>
