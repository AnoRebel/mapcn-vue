<script setup lang="ts">
import { ref } from "vue";
import { Map, type MapViewport } from "~~/registry/map";
import DocsLayout from "~/components/docs/DocsLayout.vue";
import DocsSection from "~/components/docs/DocsSection.vue";
import DocsCode from "~/components/docs/DocsCode.vue";
import DocsLink from "~/components/docs/DocsLink.vue";
import ExamplePreview from "~/components/docs/ExamplePreview.vue";
import CustomStyleExample from "~/components/docs/examples/CustomStyleExample.vue";

definePageMeta({ layout: "docs" });

const viewport = ref<MapViewport>({
  center: [-74.006, 40.7128],
  zoom: 8,
  bearing: 0,
  pitch: 0,
});
useSeoMeta({
  title: "Map",
  description:
    "Learn how to render a basic map, control the viewport programmatically, and use custom map tile styles with mapcn-vue.",
});

const basicMapCode = `<template>
  <div class="h-[400px] w-full">
    <Map :center="[-74.006, 40.7128]" :zoom="12" />
  </div>
</template>`;

const controlledMapCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Map, type MapViewport } from '@/components/ui/map'

const viewport = ref<MapViewport>({
  center: [-74.006, 40.7128],
  zoom: 8,
  bearing: 0,
  pitch: 0,
})
<\/script>

<template>
  <div class="h-[400px] relative w-full">
    <Map :viewport="viewport" @viewport-change="viewport = $event" />
    <div class="absolute top-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono bg-background/80 backdrop-blur px-2 py-1.5 rounded border">
      <span>lng: {{ viewport.center[0].toFixed(3) }}</span>
      <span>lat: {{ viewport.center[1].toFixed(3) }}</span>
      <span>zoom: {{ viewport.zoom.toFixed(1) }}</span>
    </div>
  </div>
</template>`;

const customStylesCode = `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Map } from '@/components/ui/map'

const styles = {
  default: undefined,
  openstreetmap: 'https://tiles.openfreemap.org/styles/bright',
  openstreetmap3d: 'https://tiles.openfreemap.org/styles/liberty',
}

const selectedStyle = ref('default')
const pitch = ref(0)

watch(selectedStyle, (newStyle) => {
  pitch.value = newStyle === 'openstreetmap3d' ? 60 : 0
})

const currentStyleUrl = computed(() => styles[selectedStyle.value])
<\/script>

<template>
  <div class="h-[400px] relative w-full">
    <Map
      :center="[-0.1276, 51.5074]"
      :zoom="15"
      :pitch="pitch"
      :styles="currentStyleUrl ? { light: currentStyleUrl, dark: currentStyleUrl } : undefined"
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
</template>`;
</script>

<template>
  <DocsLayout
    title="Map"
    description="The simplest way to add an interactive map to your application."
    :prev="{ title: 'API Reference', href: '/docs/api-reference' }"
    :next="{ title: 'Controls', href: '/docs/controls' }"
    :toc="[
      { title: 'Basic Usage', slug: 'basic-usage' },
      { title: 'Controlled Mode', slug: 'controlled-mode' },
      { title: 'Custom Styles', slug: 'custom-styles' },
    ]"
  >
    <DocsSection id="basic-usage" title="Basic Usage">
      <p>
        The <DocsCode>Map</DocsCode> component handles MapLibre GL setup,
        theming, and provides context for child components.
      </p>
      <ExamplePreview :code="basicMapCode" class="mt-4" height="h-[300px]">
        <Map :center="[-74.006, 40.7128]" :zoom="12" class="h-full" />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="controlled-mode" title="Controlled Mode">
      <p>
        Use the <DocsCode>viewport</DocsCode> and
        <DocsCode>@viewport-change</DocsCode> props to control the map's
        viewport externally.
      </p>
      <ExamplePreview :code="controlledMapCode" class="mt-4">
        <div class="relative h-full">
          <Map
            :viewport="viewport"
            class="h-full"
            @viewport-change="viewport = $event"
          />
          <div
            class="absolute top-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono bg-background/80 backdrop-blur px-2 py-1.5 rounded border"
          >
            <span>lng: {{ viewport.center[0].toFixed(3) }}</span>
            <span>lat: {{ viewport.center[1].toFixed(3) }}</span>
            <span>zoom: {{ viewport.zoom.toFixed(1) }}</span>
          </div>
        </div>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="custom-styles" title="Custom Styles">
      <p>
        Use the <DocsCode>styles</DocsCode> prop to provide custom map styles.
        This example uses free vector tiles from
        <DocsLink href="https://openfreemap.org" external>OpenFreeMap</DocsLink
        >, an open-source project, the data comes from OpenStreetMap.
      </p>
      <ExamplePreview :code="customStylesCode" class="mt-4" height="h-[400px]">
        <CustomStyleExample />
      </ExamplePreview>
    </DocsSection>
  </DocsLayout>
</template>
