<script setup lang="ts">
import DocsLayout from "~/components/docs/DocsLayout.vue";
import DocsSection from "~/components/docs/DocsSection.vue";
import DocsCode from "~/components/docs/DocsCode.vue";
import DocsLink from "~/components/docs/DocsLink.vue";
import DocsNote from "~/components/docs/DocsNote.vue";

definePageMeta({ layout: "docs" });
useSeoMeta({
  title: "Examples",
  description:
    "Comprehensive collection of interactive map examples with code.",
});

const examples = {
  globe: {
    title: "🌍 Globe Examples",
    description: "3D globe visualizations with satellite imagery",
    items: [
      {
        name: "Earthquake Globe",
        component: "EarthquakeGlobeExample",
        deps: ["deck.gl"],
        desc: "3D globe showing worldwide seismic activity with satellite tiles",
      },
    ],
  },
  valhalla: {
    title: "🚗 Valhalla Routing",
    description: "Turn-by-turn navigation and route optimization",
    items: [
      {
        name: "Route Planning",
        component: "ValhallaRouteExample",
        deps: [],
        desc: "A-to-B routing with driving/cycling/walking profiles",
      },
      {
        name: "Multi-Stop Routes",
        component: "ValhallaMultiStopExample",
        deps: [],
        desc: "Traveling salesman optimization with multiple stops",
      },
      {
        name: "Delivery Tracking",
        component: "DeliveryTrackingExample",
        deps: [],
        desc: "Real-time delivery simulation with animated vehicle",
      },
    ],
  },
  maplibre: {
    title: "🗺️ MapLibre Essentials",
    description: "Core MapLibre GL features and controls",
    items: [
      {
        name: "FlyTo Animations",
        component: "FlyToExample",
        deps: [],
        desc: "Smooth camera transitions between cities",
      },
      {
        name: "Pitch & Bearing",
        component: "PitchControlExample",
        deps: [],
        desc: "3D map tilt and rotation controls",
      },
      {
        name: "Layer Switcher",
        component: "LayerSwitcherExample",
        deps: [],
        desc: "Toggle layer visibility and switch basemaps",
      },
      {
        name: "Interactive Legend",
        component: "InteractiveLegendExample",
        deps: [],
        desc: "Category filtering with clickable legend",
      },
      {
        name: "Custom Styles",
        component: "CustomStyleExample",
        deps: [],
        desc: "Dynamic style switching with OpenFreeMap",
      },
      {
        name: "Live Tracking",
        component: "AnimatedRouteExample",
        deps: [],
        desc: "Animated vehicle tracking with configurable speeds",
      },
    ],
  },
  layers: {
    title: "📊 Data Layers",
    description: "GeoJSON, raster, and vector data visualization",
    items: [
      {
        name: "GeoJSON Layers",
        component: "GeoJsonLayersExample",
        deps: [],
        desc: "Points, lines, and polygons from GeoJSON data",
      },
      {
        name: "Choropleth Maps",
        component: "ChoroplethExample",
        deps: [],
        desc: "Color-coded regions with data-driven styling",
      },
      {
        name: "Rich Popups",
        component: "RichPopupsExample",
        deps: [],
        desc: "Complex popups with images and actions",
      },
    ],
  },
  deckglCore: {
    title: "⚡ deck.gl Core",
    description: "High-performance WebGL visualization layers",
    deps: "bun add deck.gl @deck.gl/mapbox @deck.gl/layers",
    items: [
      {
        name: "Scatterplot",
        component: "DeckGLScatterplotExample",
        deps: ["deck.gl"],
        desc: "High-performance point rendering with 1000s of points",
      },
      {
        name: "Arc Layer",
        component: "DeckGLArcExample",
        deps: ["deck.gl"],
        desc: "Great circle arcs for flight routes",
      },
      {
        name: "Line Layer",
        component: "DeckGLLineExample",
        deps: ["deck.gl"],
        desc: "Straight-line connections between points",
      },
      {
        name: "Path Layer",
        component: "DeckGLPathExample",
        deps: ["deck.gl"],
        desc: "GPS trails and routes with custom styling",
      },
      {
        name: "Polygon Layer",
        component: "DeckGLPolygonExample",
        deps: ["deck.gl"],
        desc: "Filled and stroked polygons with 3D extrusion",
      },
      {
        name: "Column Layer",
        component: "DeckGLColumnExample",
        deps: ["deck.gl"],
        desc: "3D extruded columns for height data",
      },
      {
        name: "Icon Layer",
        component: "DeckGLIconExample",
        deps: ["deck.gl"],
        desc: "Custom icon markers with SVG support",
      },
      {
        name: "Text Layer",
        component: "DeckGLTextExample",
        deps: ["deck.gl"],
        desc: "Text labels with backgrounds and collision detection",
      },
      {
        name: "Trips Layer",
        component: "DeckGLTripsExample",
        deps: ["deck.gl"],
        desc: "Animated trip paths with timestamp trails",
      },
    ],
  },
  deckglAgg: {
    title: "🔥 deck.gl Aggregation",
    description: "Density and aggregation layers for large datasets",
    deps: "bun add @deck.gl/aggregation-layers",
    items: [
      {
        name: "Heatmap",
        component: "DeckGLHeatmapExample",
        deps: ["deck.gl"],
        desc: "Density visualization for point clusters",
      },
      {
        name: "Hexagon Layer",
        component: "DeckGLHexagonExample",
        deps: ["deck.gl"],
        desc: "3D hexagonal binning for aggregated data",
      },
    ],
  },
  deckglGeo: {
    title: "🌐 deck.gl Geographic",
    description: "Tile-based and geographic layers",
    deps: "bun add @deck.gl/geo-layers",
    items: [
      {
        name: "MVT Layer",
        component: "DeckGLMVTExample",
        deps: ["deck.gl"],
        desc: "Mapbox Vector Tiles rendering",
      },
      {
        name: "Tile Layer",
        component: "DeckGLTileExample",
        deps: ["deck.gl"],
        desc: "Raster tile overlay",
      },
      {
        name: "H3 Hexagons",
        component: "DeckGLH3Example",
        deps: ["deck.gl", "h3-js"],
        desc: "Uber H3 spatial indexing",
      },
    ],
  },
  deckglSpatial: {
    title: "📍 deck.gl Spatial Indexing",
    description: "Grid-based aggregation and spatial indexing",
    deps: "bun add @deck.gl/aggregation-layers",
    items: [
      {
        name: "Grid Layer",
        component: "DeckGLGridExample",
        deps: ["deck.gl"],
        desc: "Square grid aggregation with 3D elevation",
      },
      {
        name: "Hexagon Layer",
        component: "DeckGLHexagonExample",
        deps: ["deck.gl"],
        desc: "Hexagonal binning for data aggregation",
      },
    ],
  },
};
</script>

<template>
  <DocsLayout
    title="Examples"
    description="Complete collection of interactive map examples organized by category."
    :prev="{ title: 'deck.gl', href: '/docs/deckgl' }"
    :toc="[
      { title: 'Overview', slug: 'overview' },
      { title: 'Globe Examples', slug: 'globe' },
      { title: 'Valhalla Routing', slug: 'valhalla' },
      { title: 'MapLibre Essentials', slug: 'maplibre' },
      { title: 'Data Layers', slug: 'layers' },
      { title: 'deck.gl Core', slug: 'deckgl-core' },
      { title: 'deck.gl Aggregation', slug: 'deckgl-aggregation' },
      { title: 'deck.gl Geographic', slug: 'deckgl-geographic' },
      { title: 'deck.gl Spatial Indexing', slug: 'deckgl-spatial' },
    ]"
  >
    <DocsSection id="overview" title="Overview">
      <p>
        This collection includes
        {{
          Object.values(examples).reduce(
            (acc, cat) => acc + cat.items.length,
            0,
          )
        }}+ interactive examples demonstrating various mapping capabilities.
        Each example is designed to be copy-paste ready and follows our Vue 3
        Composition API patterns.
      </p>
      <DocsNote>
        <strong>Note:</strong> Examples marked with
        <DocsCode>deck.gl</DocsCode> require additional dependencies. See each
        section for installation commands.
      </DocsNote>
    </DocsSection>

    <!-- Globe Examples -->
    <DocsSection id="globe" :title="examples.globe.title">
      <p>{{ examples.globe.description }}</p>
      <div class="mt-4 space-y-2">
        <div
          v-for="item in examples.globe.items"
          :key="item.name"
          class="p-3 bg-muted rounded-lg"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ item.name }}</span>
            <span
              v-if="item.deps.length"
              class="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
            >
              {{ item.deps.join(", ") }}
            </span>
          </div>
          <p class="text-sm text-muted-foreground mt-1">{{ item.desc }}</p>
        </div>
      </div>
    </DocsSection>

    <!-- Valhalla -->
    <DocsSection id="valhalla" :title="examples.valhalla.title">
      <p>{{ examples.valhalla.description }}</p>
      <div class="mt-4 space-y-2">
        <div
          v-for="item in examples.valhalla.items"
          :key="item.name"
          class="p-3 bg-muted rounded-lg"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ item.name }}</span>
            <span
              class="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded"
              >No extra deps</span
            >
          </div>
          <p class="text-sm text-muted-foreground mt-1">{{ item.desc }}</p>
        </div>
      </div>
      <p class="mt-4 text-sm text-muted-foreground">
        Connect to
        <DocsLink href="https://valhalla.github.io/valhalla/" external
          >Valhalla</DocsLink
        >
        or your own routing API for production use.
      </p>
    </DocsSection>

    <!-- MapLibre Essentials -->
    <DocsSection id="maplibre" :title="examples.maplibre.title">
      <p>{{ examples.maplibre.description }}</p>
      <div class="mt-4 space-y-2">
        <div
          v-for="item in examples.maplibre.items"
          :key="item.name"
          class="p-3 bg-muted rounded-lg"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ item.name }}</span>
            <span
              class="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded"
              >No extra deps</span
            >
          </div>
          <p class="text-sm text-muted-foreground mt-1">{{ item.desc }}</p>
        </div>
      </div>
    </DocsSection>

    <!-- Data Layers -->
    <DocsSection id="layers" :title="examples.layers.title">
      <p>{{ examples.layers.description }}</p>
      <div class="mt-4 space-y-2">
        <div
          v-for="item in examples.layers.items"
          :key="item.name"
          class="p-3 bg-muted rounded-lg"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ item.name }}</span>
            <span
              class="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded"
              >No extra deps</span
            >
          </div>
          <p class="text-sm text-muted-foreground mt-1">{{ item.desc }}</p>
        </div>
      </div>
    </DocsSection>

    <!-- deck.gl Core -->
    <DocsSection id="deckgl-core" :title="examples.deckglCore.title">
      <p>{{ examples.deckglCore.description }}</p>
      <pre
        class="mt-2 p-3 bg-muted rounded-lg text-sm"
      ><code>{{ examples.deckglCore.deps }}</code></pre>
      <div class="mt-4 space-y-2">
        <div
          v-for="item in examples.deckglCore.items"
          :key="item.name"
          class="p-3 bg-muted rounded-lg border-l-4 border-primary"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ item.name }}</span>
            <span
              class="text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded"
              >deck.gl</span
            >
          </div>
          <p class="text-sm text-muted-foreground mt-1">{{ item.desc }}</p>
        </div>
      </div>
    </DocsSection>

    <!-- deck.gl Aggregation -->
    <DocsSection id="deckgl-aggregation" :title="examples.deckglAgg.title">
      <p>{{ examples.deckglAgg.description }}</p>
      <pre
        class="mt-2 p-3 bg-muted rounded-lg text-sm"
      ><code>{{ examples.deckglAgg.deps }}</code></pre>
      <div class="mt-4 space-y-2">
        <div
          v-for="item in examples.deckglAgg.items"
          :key="item.name"
          class="p-3 bg-muted rounded-lg border-l-4 border-primary"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ item.name }}</span>
            <span
              class="text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded"
              >deck.gl</span
            >
          </div>
          <p class="text-sm text-muted-foreground mt-1">{{ item.desc }}</p>
        </div>
      </div>
    </DocsSection>

    <!-- deck.gl Geographic -->
    <DocsSection id="deckgl-geographic" :title="examples.deckglGeo.title">
      <p>{{ examples.deckglGeo.description }}</p>
      <pre
        class="mt-2 p-3 bg-muted rounded-lg text-sm"
      ><code>{{ examples.deckglGeo.deps }}</code></pre>
      <div class="mt-4 space-y-2">
        <div
          v-for="item in examples.deckglGeo.items"
          :key="item.name"
          class="p-3 bg-muted rounded-lg border-l-4 border-primary"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ item.name }}</span>
            <span
              class="text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded"
            >
              {{ item.deps.includes("h3-js") ? "deck.gl + h3-js" : "deck.gl" }}
            </span>
          </div>
          <p class="text-sm text-muted-foreground mt-1">{{ item.desc }}</p>
        </div>
      </div>
    </DocsSection>

    <!-- deck.gl Spatial Indexing -->
    <DocsSection id="deckgl-spatial" :title="examples.deckglSpatial.title">
      <p>{{ examples.deckglSpatial.description }}</p>
      <pre
        class="mt-2 p-3 bg-muted rounded-lg text-sm"
      ><code>{{ examples.deckglSpatial.deps }}</code></pre>
      <div class="mt-4 space-y-2">
        <div
          v-for="item in examples.deckglSpatial.items"
          :key="item.name"
          class="p-3 bg-muted rounded-lg border-l-4 border-primary"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium">{{ item.name }}</span>
            <span
              class="text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded"
              >deck.gl</span
            >
          </div>
          <p class="text-sm text-muted-foreground mt-1">{{ item.desc }}</p>
        </div>
      </div>
    </DocsSection>

    <DocsSection title="Quick Start">
      <p>Import any example component and use it directly:</p>
      <pre
        class="mt-2 p-4 bg-muted rounded-lg text-sm overflow-x-auto"
      ><code>&lt;script setup lang="ts"&gt;
import { FlyToExample } from '~/components/docs/examples'
&lt;/script&gt;

&lt;template&gt;
  &lt;FlyToExample /&gt;
&lt;/template&gt;</code></pre>
      <p class="mt-4 text-muted-foreground">
        All examples are located in
        <DocsCode>app/components/docs/examples/</DocsCode>
        and follow Vue 3 Composition API patterns.
      </p>
    </DocsSection>
  </DocsLayout>
</template>
