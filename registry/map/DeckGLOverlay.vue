<script setup lang="ts">
import type { Layer } from "@deck.gl/core";
import { useDeckGLOverlay } from "./composables/useDeckGLOverlay";

const props = withDefaults(
  defineProps<{
    layers: Layer[];
    interleaved?: boolean;
  }>(),
  {
    interleaved: true,
  },
);

useDeckGLOverlay(props);
</script>

<template>
  <div v-if="false" />
</template>
