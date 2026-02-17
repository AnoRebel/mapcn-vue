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
import DeckGLLineExample from "~/components/docs/examples/DeckGLLineExample.vue";
import DeckGLPathExample from "~/components/docs/examples/DeckGLPathExample.vue";
import DeckGLPolygonExample from "~/components/docs/examples/DeckGLPolygonExample.vue";
import DeckGLColumnExample from "~/components/docs/examples/DeckGLColumnExample.vue";
import DeckGLHexagonExample from "~/components/docs/examples/DeckGLHexagonExample.vue";
import DeckGLGridExample from "~/components/docs/examples/DeckGLGridExample.vue";
import DeckGLScreenGridExample from "~/components/docs/examples/DeckGLScreenGridExample.vue";
import DeckGLContourExample from "~/components/docs/examples/DeckGLContourExample.vue";
import DeckGLIconExample from "~/components/docs/examples/DeckGLIconExample.vue";
import DeckGLTextExample from "~/components/docs/examples/DeckGLTextExample.vue";
import DeckGLTripsExample from "~/components/docs/examples/DeckGLTripsExample.vue";
import EarthquakeGlobeExample from "~/components/docs/examples/EarthquakeGlobeExample.vue";
import DeckGLBitmapExample from "~/components/docs/examples/DeckGLBitmapExample.vue";
import DeckGLTileExample from "~/components/docs/examples/DeckGLTileExample.vue";
import DeckGLMVTExample from "~/components/docs/examples/DeckGLMVTExample.vue";
import DeckGLH3Example from "~/components/docs/examples/DeckGLH3Example.vue";

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
      { title: 'Line Layer', slug: 'line-layer' },
      { title: 'Path Layer', slug: 'path-layer' },
      { title: 'Polygon Layer', slug: 'polygon-layer' },
      { title: 'Icon Layer', slug: 'icon-layer' },
      { title: 'Text Layer', slug: 'text-layer' },
      { title: 'Heatmap Layer', slug: 'heatmap' },
      { title: 'Hexagon Layer', slug: 'hexagon-layer' },
      { title: 'Grid Layer', slug: 'grid-layer' },
      { title: 'Screen Grid', slug: 'screen-grid' },
      { title: 'Contour Layer', slug: 'contour-layer' },
      { title: 'Column Layer', slug: 'column-layer' },
      { title: 'Animated Trips', slug: 'trips-layer' },
      { title: 'Earthquake Globe', slug: 'earthquake-globe' },
      { title: 'Bitmap Layer', slug: 'bitmap-layer' },
      { title: 'Tile Layer', slug: 'tile-layer' },
      { title: 'MVT Layer', slug: 'mvt-layer' },
      { title: 'H3 Hexagon Layer', slug: 'h3-layer' },
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
      ><code>bun add deck.gl @deck.gl/mapbox @deck.gl/layers @deck.gl/aggregation-layers @deck.gl/geo-layers</code></pre>
      <DocsNote class="mt-4">
        deck.gl adds approximately 500KB to your bundle. Consider dynamic
        imports for production if only using specific layer types.
      </DocsNote>
    </DocsSection>

    <!-- Core Layers -->

    <DocsSection id="scatterplot" title="Scatterplot Layer">
      <p>
        The <DocsCode>ScatterplotLayer</DocsCode> renders millions of points
        efficiently. Perfect for visualizing large datasets like taxi pickups,
        crime incidents, or sensor readings.
      </p>
      <ExamplePreview :code="basicCode" class="mt-4" height="h-[500px]">
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

    <DocsSection id="line-layer" title="Line Layer">
      <p>
        <DocsCode>LineLayer</DocsCode> draws straight lines between two points.
        Useful for showing direct connections like network links or simple
        origin-destination pairs.
      </p>
      <ExamplePreview
        source-file="DeckGLLineExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLLineExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="path-layer" title="Path Layer">
      <p>
        <DocsCode>PathLayer</DocsCode> renders polylines from coordinate arrays.
        Ideal for GPS trails, routes, and any multi-segment line data with
        custom widths and colors.
      </p>
      <ExamplePreview
        source-file="DeckGLPathExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLPathExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="polygon-layer" title="Polygon Layer">
      <p>
        <DocsCode>PolygonLayer</DocsCode> renders filled polygons with optional
        3D extrusion. Great for building footprints, zoning boundaries, or any
        area-based visualization.
      </p>
      <ExamplePreview
        source-file="DeckGLPolygonExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLPolygonExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="icon-layer" title="Icon Layer">
      <p>
        <DocsCode>IconLayer</DocsCode> renders raster icons at specified
        positions. Supports custom icon atlases and per-point sizing for
        categorical map markers.
      </p>
      <ExamplePreview
        source-file="DeckGLIconExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLIconExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="text-layer" title="Text Layer">
      <p>
        <DocsCode>TextLayer</DocsCode> renders text labels at geographic
        positions. Useful for annotations, POI labels, or data-value overlays on
        the map.
      </p>
      <ExamplePreview
        source-file="DeckGLTextExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLTextExample />
      </ExamplePreview>
    </DocsSection>

    <!-- Aggregation Layers -->

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

    <DocsSection id="hexagon-layer" title="Hexagon Layer">
      <p>
        <DocsCode>HexagonLayer</DocsCode> aggregates data into hexagonal bins
        with optional 3D elevation. A powerful way to visualize spatial
        distribution and density patterns.
      </p>
      <ExamplePreview
        source-file="DeckGLHexagonExample.vue"
        class="mt-4"
        height="h-[550px]"
      >
        <DeckGLHexagonExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="grid-layer" title="Grid Layer">
      <p>
        <DocsCode>GridLayer</DocsCode> aggregates data into a uniform square
        grid with color and height encoding. Similar to hexagons but uses a
        rectangular grid pattern.
      </p>
      <ExamplePreview
        source-file="DeckGLGridExample.vue"
        class="mt-4"
        height="h-[550px]"
      >
        <DeckGLGridExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="screen-grid" title="Screen Grid Layer">
      <p>
        <DocsCode>ScreenGridLayer</DocsCode> aggregates data into a grid in
        screen space rather than world space. The grid cells remain a constant
        pixel size regardless of zoom level.
      </p>
      <ExamplePreview
        source-file="DeckGLScreenGridExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLScreenGridExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="contour-layer" title="Contour Layer">
      <p>
        <DocsCode>ContourLayer</DocsCode> renders contour lines or filled bands
        for point data, similar to topographic maps. Visualize density
        thresholds with isobands and isolines.
      </p>
      <ExamplePreview
        source-file="DeckGLContourExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLContourExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="column-layer" title="Column Layer">
      <p>
        <DocsCode>ColumnLayer</DocsCode> renders 3D extruded columns at
        geographic positions. Perfect for population data, building heights, or
        any metric that benefits from a 3D bar-chart style visualization.
      </p>
      <ExamplePreview
        source-file="DeckGLColumnExample.vue"
        class="mt-4"
        height="h-[550px]"
      >
        <DeckGLColumnExample />
      </ExamplePreview>
    </DocsSection>

    <!-- Animated & Advanced -->

    <DocsSection id="trips-layer" title="Animated Trips">
      <p>
        <DocsCode>TripsLayer</DocsCode> animates paths over time, perfect for
        visualizing vehicle movement, delivery routes, or any temporal
        trajectory data. This example uses real NYC taxi trip data with orange
        and teal trails representing different vendors.
      </p>
      <ExamplePreview
        source-file="DeckGLTripsExample.vue"
        class="mt-4"
        height="h-[550px]"
      >
        <DeckGLTripsExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="earthquake-globe" title="Earthquake Globe">
      <p>
        A 3D globe visualization of live seismic activity from
        <DocsLink href="https://earthquake.usgs.gov" external>USGS</DocsLink>.
        Combines a satellite basemap with a Three.js starfield skybox and
        deck.gl <DocsCode>ScatterplotLayer</DocsCode> for earthquake points
        color-coded by magnitude. Click any point for details.
      </p>
      <DocsNote class="mt-2">
        This example uses <DocsCode>Three.js</DocsCode> for the starfield custom
        layer. Install with <DocsCode>bun add three</DocsCode>.
      </DocsNote>
      <ExamplePreview
        source-file="EarthquakeGlobeExample.vue"
        class="mt-4"
        height="h-[600px]"
      >
        <EarthquakeGlobeExample />
      </ExamplePreview>
    </DocsSection>

    <!-- Geo Layers -->

    <DocsSection id="bitmap-layer" title="Bitmap Layer">
      <p>
        <DocsCode>BitmapLayer</DocsCode> renders a georeferenced raster image on
        the map. Use it for satellite imagery, historical maps, or any raster
        overlay positioned by geographic bounds.
      </p>
      <ExamplePreview
        source-file="DeckGLBitmapExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLBitmapExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="tile-layer" title="Tile Layer">
      <p>
        <DocsCode>TileLayer</DocsCode> renders raster or vector data from a
        standard tile pyramid (XYZ / TMS). Perfect for loading satellite
        imagery, custom tile servers, or any slippy-map tile source.
      </p>
      <ExamplePreview
        source-file="DeckGLTileExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLTileExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="mvt-layer" title="MVT Layer">
      <p>
        <DocsCode>MVTLayer</DocsCode> renders Mapbox Vector Tiles with custom
        styling. Ideal for rendering OpenStreetMap data, custom tile servers, or
        Mapbox-hosted vector data with full control over colors and line widths.
      </p>
      <ExamplePreview
        source-file="DeckGLMVTExample.vue"
        class="mt-4"
        height="h-[500px]"
      >
        <DeckGLMVTExample />
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="h3-layer" title="H3 Hexagon Layer">
      <p>
        <DocsCode>H3HexagonLayer</DocsCode> renders hexagons from
        <DocsLink href="https://h3geo.org" external>Uber's H3</DocsLink>
        spatial indexing system. Each hexagon is addressed by an H3 index
        string, enabling efficient geospatial aggregation and visualization.
      </p>
      <DocsNote class="mt-2">
        Requires the <DocsCode>h3-js</DocsCode> library for H3 index resolution.
        Install with <DocsCode>bun add h3-js</DocsCode>.
      </DocsNote>
      <ExamplePreview
        source-file="DeckGLH3Example.vue"
        class="mt-4"
        height="h-[550px]"
      >
        <DeckGLH3Example />
      </ExamplePreview>
    </DocsSection>
  </DocsLayout>
</template>
