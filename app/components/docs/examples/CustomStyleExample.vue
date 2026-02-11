<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Map } from "~~/registry/map";

const styles = {
  default: undefined as string | undefined,
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

type StyleKey = keyof typeof styles;

const selectedStyle = ref<StyleKey>("default");
const pitch = ref(0);

watch(selectedStyle, (newStyle) => {
  pitch.value = newStyle === "openstreetmap3d" ? 60 : 0;
});

const currentStyleUrl = computed(() => styles[selectedStyle.value]);
</script>

<template>
  <div class="h-[400px] relative w-full">
    <Map
      :center="[-0.1276, 51.5074]"
      :zoom="15"
      :pitch="pitch"
      :styles="
        currentStyleUrl
          ? { light: currentStyleUrl, dark: currentStyleUrl }
          : undefined
      "
      class="h-full"
    />
    <div class="absolute top-2 right-2 z-10">
      <select
        v-model="selectedStyle"
        class="bg-background text-foreground border rounded-md px-2 py-1 text-sm shadow"
      >
        <option value="default">Default (Carto)</option>
        <option value="openstreetmap">OpenStreetMap</option>
        <option value="openstreetmap3d">OpenStreetMap 3D</option>
      </select>
    </div>
  </div>
</template>
