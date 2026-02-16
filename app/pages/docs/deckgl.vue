<script setup lang="ts">
import DocsLayout from "~/components/docs/DocsLayout.vue";
import DocsSection from "~/components/docs/DocsSection.vue";
import DocsCode from "~/components/docs/DocsCode.vue";
import DocsNote from "~/components/docs/DocsNote.vue";
import DocsLink from "~/components/docs/DocsLink.vue";
import ExamplePreview from "~/components/docs/ExamplePreview.vue";
import DeckGLScatterplotExample from "~/components/docs/examples/DeckGLScatterplotExample.vue";
import DeckGLArcExample from "~/components/docs/examples/DeckGLArcExample.vue";
import DeckGLHeatmapExample from "~/components/docs/examples/DeckGLHeatmapExample.vue";

definePageMeta({ layout: "docs" });
useSeoMeta({
  title: "deck.gl Integration",
  description: "High-performance WebGL visualization with deck.gl layers.",
});

const basicCode = `<script setup lang="ts">
import { Map, DeckGLOverlay } from '@@/registry/map'
import { ScatterplotLayer } from '@deck.gl/layers'

const data = [
  { position: [-74.006, 40.7128], value: 100 }
]

const layers = [
  new ScatterplotLayer({
    id: 'scatterplot',
    data,
    getPosition: d => d.position,
    getRadius: d => d.value,
    getFillColor: [255, 0, 0]
  })
]
<\/script>

<template>
  <Map :center="[-74.006, 40.7128]" :zoom="10">
    <DeckGLOverlay :layers="layers" />
  </Map>
</template>`;
</script>

<template>
  <DocsLayout
    title="deck.gl Integration"
    description="High-performance WebGL data visualization with deck.gl."
    :prev="{ title: 'Layers', href: '/docs/layers' }"
    :next="{ title: 'Advanced', href: '/docs/advanced-usage' }"
    :toc="[
      { title: 'Installation', slug: 'installation' },
      { title: 'Scatterplot Layer', slug: 'scatterplot' },
      { title: 'Arc Layer', slug: 'arc-layer' },
      { title: 'Heatmap Layer', slug: 'heatmap' },
      { title: 'Layer Types', slug: 'layer-types' },
    ]"
  >
    <DocsSection>
      <p>
        <DocsLink href="https://deck.gl" external>deck.gl</DocsLink> is a
        WebGL-powered framework for visualizing large-scale datasets. The
        <DocsCode>DeckGLOverlay</DocsCode>
        component integrates deck.gl with our Map component for high-performance
        visualization.
      </p>
    </DocsSection>

    <DocsSection id="installation" title="Installation">
      <p>
        deck.gl packages are required for these examples. Install them alongside
        mapcn-vue:
      </p>
      <pre
        class="mt-4 p-4 bg-muted rounded-lg overflow-x-auto"
      ><code>bun add deck.gl @deck.gl/mapbox @deck.gl/layers @deck.gl/aggregation-layers</code></pre>
      <DocsNote class="mt-4">
        deck.gl adds approximately 500KB to your bundle. Consider dynamic
        imports for production if only using specific layer types.
      </DocsNote>
    </DocsSection>

    <DocsSection id="scatterplot" title="Scatterplot Layer">
      <p>
        The <DocsCode>ScatterplotLayer</DocsCode> renders millions of points
        efficiently. Perfect for visualizing large datasets like taxi pickups,
        crime incidents, or sensor readings.
      </p>
      <ExamplePreview :code="basicCode" class="mt-4" height="h-[550px]">
        <DeckGLScatterplotExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="arc-layer" title="Arc Layer">
      <p>
        <DocsCode>ArcLayer</DocsCode> renders arcs between two points. Great for
        showing origin-destination flows like flight routes, migration patterns,
        or network traffic. Supports great circle arcs that follow Earth's
        curvature.
      </p>
      <ExamplePreview
        source-file="DeckGLArcExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLArcExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="heatmap" title="Heatmap Layer">
      <p>
        <DocsCode>HeatmapLayer</DocsCode> creates density visualizations from
        point data. Aggregate thousands or millions of points into an intuitive
        heat map showing concentration patterns.
      </p>
      <ExamplePreview
        source-file="DeckGLHeatmapExample.vue"
        class="mt-4"
        height="h-[550px]"
      >
        <DeckGLHeatmapExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="layer-types" title="Available Layer Types">
      <p>
        deck.gl provides many layer types for different visualization needs:
      </p>
      <ul class="mt-2">
        <li>
          <strong>Core Layers:</strong> Scatterplot, Arc, Line, Path, Polygon,
          GeoJSON, Icon, Text
        </li>
        <li>
          <strong>Aggregation Layers:</strong> Heatmap, Hexagon, Grid,
          ScreenGrid, Contour
        </li>
        <li>
          <strong>Geographic Layers:</strong> Terrain, Tile, MVT, Bitmap, WMS
        </li>
        <li>
          <strong>3D Layers:</strong> Scenegraph, SimpleMesh, PointCloud,
          SolidPolygon
        </li>
      </ul>
      <p class="mt-4">
        Import layers from <DocsCode>@deck.gl/layers</DocsCode>,
        <DocsCode>@deck.gl/aggregation-layers</DocsCode>, or other deck.gl
        packages and pass them to <DocsCode>DeckGLOverlay</DocsCode>.
      </p>
    </DocsSection>
  </DocsLayout>
</template>
