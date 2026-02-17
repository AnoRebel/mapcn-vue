<script setup lang="ts">
import DocsLayout from "~/components/docs/DocsLayout.vue";
import DocsSection from "~/components/docs/DocsSection.vue";
import DocsCode from "~/components/docs/DocsCode.vue";
import DocsNote from "~/components/docs/DocsNote.vue";
import ExamplePreview from "~/components/docs/ExamplePreview.vue";
import FlyToExample from "~/components/docs/examples/FlyToExample.vue";
import CustomStyleExample from "~/components/docs/examples/CustomStyleExample.vue";
import GeoJsonLayersExample from "~/components/docs/examples/GeoJsonLayersExample.vue";
import DeckGLScatterplotExample from "~/components/docs/examples/DeckGLScatterplotExample.vue";
import DeckGLArcExample from "~/components/docs/examples/DeckGLArcExample.vue";
import DeckGLHeatmapExample from "~/components/docs/examples/DeckGLHeatmapExample.vue";

definePageMeta({ layout: "docs" });
useSeoMeta({
  title: "Examples",
  description:
    "Comprehensive collection of interactive map examples with code.",
});

interface ExampleItem {
  name: string;
  desc: string;
  deps: string[];
  link?: string;
}

interface ExampleGroup {
  title: string;
  description: string;
  deps?: string;
  items: ExampleItem[];
}

const catalog: Record<string, ExampleGroup> = {
  maplibre: {
    title: "MapLibre Essentials",
    description: "Core MapLibre GL features and controls",
    items: [
      {
        name: "FlyTo Animations",
        deps: [],
        desc: "Smooth camera transitions between cities",
        link: "#camera-animations",
      },
      {
        name: "Custom Styles",
        deps: [],
        desc: "Dynamic basemap switching with OpenFreeMap",
        link: "#custom-styles",
      },
      {
        name: "GeoJSON Layers",
        deps: [],
        desc: "Points, lines, and polygons from GeoJSON data",
        link: "#geojson-layers",
      },
      {
        name: "Choropleth Maps",
        deps: [],
        desc: "Color-coded regions with data-driven styling",
        link: "/docs/layers#choropleth-maps",
      },
      {
        name: "Animated Routes",
        deps: [],
        desc: "Animated vehicle tracking on routes",
        link: "/docs/routes",
      },
      {
        name: "Cluster Layers",
        deps: [],
        desc: "Automatic point clustering at scale",
        link: "/docs/clusters",
      },
    ],
  },
  deckglCore: {
    title: "deck.gl Core Layers",
    description: "High-performance WebGL visualization layers",
    deps: "bun add deck.gl @deck.gl/mapbox @deck.gl/layers",
    items: [
      {
        name: "Scatterplot",
        deps: ["deck.gl"],
        desc: "High-performance point rendering",
        link: "#deckgl-scatterplot",
      },
      {
        name: "Arc Layer",
        deps: ["deck.gl"],
        desc: "Great circle arcs for flight routes",
        link: "#deckgl-arcs",
      },
      {
        name: "Heatmap",
        deps: ["deck.gl"],
        desc: "Density visualization for point clusters",
        link: "#deckgl-heatmap",
      },
    ],
  },
  deckglAdvanced: {
    title: "More deck.gl Layers",
    description: "Additional layer types for specialized use cases",
    deps: "bun add @deck.gl/aggregation-layers @deck.gl/geo-layers",
    items: [
      {
        name: "Line Layer",
        deps: ["deck.gl"],
        desc: "Straight-line connections between points",
        link: "/docs/deckgl#line-layer",
      },
      {
        name: "Path Layer",
        deps: ["deck.gl"],
        desc: "GPS trails and routes with custom styling",
        link: "/docs/deckgl#path-layer",
      },
      {
        name: "Polygon Layer",
        deps: ["deck.gl"],
        desc: "Filled polygons with 3D extrusion",
        link: "/docs/deckgl#polygon-layer",
      },
      {
        name: "Column Layer",
        deps: ["deck.gl"],
        desc: "3D extruded columns for height data",
        link: "/docs/deckgl#column-layer",
      },
      {
        name: "Hexagon Layer",
        deps: ["deck.gl"],
        desc: "Hexagonal binning for data aggregation",
        link: "/docs/deckgl#hexagon-layer",
      },
      {
        name: "Grid Layer",
        deps: ["deck.gl"],
        desc: "Square grid aggregation with 3D elevation",
        link: "/docs/deckgl#grid-layer",
      },
      {
        name: "Screen Grid",
        deps: ["deck.gl"],
        desc: "Screen-space grid aggregation",
        link: "/docs/deckgl#screen-grid",
      },
      {
        name: "Contour Layer",
        deps: ["deck.gl"],
        desc: "Density contour lines and isobands",
        link: "/docs/deckgl#contour-layer",
      },
      {
        name: "Icon Layer",
        deps: ["deck.gl"],
        desc: "Raster icons at geographic positions",
        link: "/docs/deckgl#icon-layer",
      },
      {
        name: "Text Layer",
        deps: ["deck.gl"],
        desc: "Text labels at geographic positions",
        link: "/docs/deckgl#text-layer",
      },
      {
        name: "Animated Trips",
        deps: ["deck.gl"],
        desc: "Real NYC taxi trip animation with fading trails",
        link: "/docs/deckgl#trips-layer",
      },
      {
        name: "Earthquake Globe",
        deps: ["deck.gl", "three"],
        desc: "Live USGS data on a 3D globe with starfield",
        link: "/docs/deckgl#earthquake-globe",
      },
      {
        name: "Bitmap Layer",
        deps: ["deck.gl"],
        desc: "Georeferenced raster image overlay",
        link: "/docs/deckgl#bitmap-layer",
      },
      {
        name: "Tile Layer",
        deps: ["deck.gl"],
        desc: "Satellite / raster tile pyramid rendering",
        link: "/docs/deckgl#tile-layer",
      },
      {
        name: "MVT Layer",
        deps: ["deck.gl"],
        desc: "Mapbox Vector Tiles with custom styling",
        link: "/docs/deckgl#mvt-layer",
      },
      {
        name: "H3 Hexagon Layer",
        deps: ["deck.gl"],
        desc: "Uber H3 spatial index hexagon visualization",
        link: "/docs/deckgl#h3-layer",
      },
    ],
  },
};
</script>

<template>
  <DocsLayout
    title="Examples"
    description="Interactive map examples with live previews and copy-paste code."
    :prev="{ title: 'API Reference', href: '/docs/api-reference' }"
    :next="{ title: 'Map', href: '/docs/basic-map' }"
    :toc="[
      { title: 'Camera Animations', slug: 'camera-animations' },
      { title: 'Custom Styles', slug: 'custom-styles' },
      { title: 'GeoJSON Layers', slug: 'geojson-layers' },
      { title: 'deck.gl Scatterplot', slug: 'deckgl-scatterplot' },
      { title: 'deck.gl Arcs', slug: 'deckgl-arcs' },
      { title: 'deck.gl Heatmap', slug: 'deckgl-heatmap' },
      { title: 'All Examples', slug: 'all-examples' },
    ]"
  >
    <!-- Live interactive examples -->
    <DocsSection id="camera-animations" title="Camera Animations">
      <p>
        Smooth camera transitions with <DocsCode>flyTo</DocsCode>,
        <DocsCode>easeTo</DocsCode>, and <DocsCode>jumpTo</DocsCode>.
      </p>
      <ExamplePreview
        source-file="FlyToExample.vue"
        class="mt-3"
        height="h-[450px]"
      >
        <FlyToExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="custom-styles" title="Custom Styles">
      <p>
        Switch between basemap styles dynamically using the
        <DocsCode>styles</DocsCode> prop.
      </p>
      <ExamplePreview
        source-file="CustomStyleExample.vue"
        class="mt-3"
        height="h-[350px]"
      >
        <CustomStyleExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="geojson-layers" title="GeoJSON Layers">
      <p>
        Render points, lines, and polygons from GeoJSON data with
        <DocsCode>MapGeoJson</DocsCode>.
      </p>
      <ExamplePreview
        source-file="GeoJsonLayersExample.vue"
        class="mt-3"
        height="h-[450px]"
      >
        <GeoJsonLayersExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="deckgl-scatterplot" title="deck.gl Scatterplot">
      <p>
        High-performance point rendering with
        <DocsCode>ScatterplotLayer</DocsCode>.
      </p>
      <ExamplePreview
        source-file="DeckGLScatterplotExample.vue"
        class="mt-3"
        height="h-[480px]"
      >
        <DeckGLScatterplotExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="deckgl-arcs" title="deck.gl Arc Layer">
      <p>
        Origin-destination arcs with <DocsCode>ArcLayer</DocsCode> following
        Earth's curvature.
      </p>
      <ExamplePreview
        source-file="DeckGLArcExample.vue"
        class="mt-3"
        height="h-[480px]"
      >
        <DeckGLArcExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="deckgl-heatmap" title="deck.gl Heatmap">
      <p>Density visualization with <DocsCode>HeatmapLayer</DocsCode>.</p>
      <ExamplePreview
        source-file="DeckGLHeatmapExample.vue"
        class="mt-3"
        height="h-[480px]"
      >
        <DeckGLHeatmapExample />
      </ExamplePreview>
    </DocsSection>

    <!-- Full catalog -->
    <DocsSection id="all-examples" title="All Examples">
      <p class="mb-4">
        Browse all available examples. Items with links have live demos on their
        respective documentation pages.
      </p>

      <div v-for="(group, key) in catalog" :key="key" class="mb-6 last:mb-0">
        <h4 class="text-sm font-semibold mb-2">{{ group.title }}</h4>
        <p class="text-xs text-muted-foreground mb-2">
          {{ group.description }}
        </p>
        <div v-if="group.deps" class="mb-2">
          <code class="text-[11px] bg-muted px-2 py-1 rounded font-mono">{{
            group.deps
          }}</code>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <template v-for="item in group.items" :key="item.name">
            <NuxtLink
              v-if="item.link"
              :to="item.link"
              class="flex items-center justify-between p-2.5 rounded-lg border bg-card transition-colors no-underline hover:bg-accent hover:border-accent-foreground/20 cursor-pointer"
            >
              <div class="min-w-0">
                <div class="text-sm font-medium truncate">{{ item.name }}</div>
                <div class="text-xs text-muted-foreground truncate">
                  {{ item.desc }}
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0 ml-2">
                <span
                  v-if="item.deps.length"
                  class="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded font-medium"
                >
                  {{ item.deps.join(" + ") }}
                </span>
                <span
                  class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium"
                >
                  Demo
                </span>
              </div>
            </NuxtLink>
            <div
              v-else
              class="flex items-center justify-between p-2.5 rounded-lg border bg-card transition-colors no-underline opacity-75"
            >
              <div class="min-w-0">
                <div class="text-sm font-medium truncate">{{ item.name }}</div>
                <div class="text-xs text-muted-foreground truncate">
                  {{ item.desc }}
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0 ml-2">
                <span
                  v-if="item.deps.length"
                  class="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded font-medium"
                >
                  {{ item.deps.join(" + ") }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <DocsNote class="mt-4">
        <strong>Tip:</strong> All example source files are in
        <DocsCode>app/components/docs/examples/</DocsCode>. Import and use them
        directly in your project.
      </DocsNote>
    </DocsSection>
  </DocsLayout>
</template>
