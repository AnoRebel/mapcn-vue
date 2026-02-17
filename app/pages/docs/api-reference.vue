<script setup lang="ts">
import DocsLayout from "~/components/docs/DocsLayout.vue";
import DocsSection from "~/components/docs/DocsSection.vue";
import DocsCode from "~/components/docs/DocsCode.vue";
import CodeBlock from "~/components/docs/CodeBlock.vue";
import DocsPropTable from "~/components/docs/DocsPropTable.vue";

definePageMeta({ layout: "docs" });
useSeoMeta({
  title: "API Reference",
  description:
    "Complete prop reference for all mapcn-vue components: Map, MapMarker, MapPopup, MapRoute, MapClusterLayer, MapGeoJson, MapImageOverlay, DeckGLOverlay, MapControls, and composables.",
});

const anatomyCode = `<Map>
  <MapMarker :longitude="..." :latitude="...">
    <MarkerContent>
      <!-- Your custom marker content -->
    </MarkerContent>
    <MarkerPopup />
    <MarkerTooltip />
  </MapMarker>

  <MapPopup :longitude="..." :latitude="..." />
  <MapControls :show-compass="true" :show-locate="true" />
  <MapRoute :coordinates="..." color="#3b82f6" />
  <MapClusterLayer :data="..." />
  <MapGeoJson :data="geojson" layer-type="fill" />
  <MapImageOverlay url="..." :coordinates="[[...], [...], [...], [...]]" />
  <DeckGLOverlay :layers="[...]" :interleaved="true" />
</Map>`;

const useMapCode = `const { map, isLoaded, isStyleLoaded, hasRendered } = useMap()`;

const mapProps = [
  {
    name: "center",
    type: "[number, number]",
    description: "Initial center coordinates [longitude, latitude]",
  },
  {
    name: "zoom",
    type: "number",
    default: "10",
    description: "Initial zoom level",
  },
  {
    name: "bearing",
    type: "number",
    default: "0",
    description: "Initial bearing (rotation) in degrees",
  },
  {
    name: "pitch",
    type: "number",
    default: "0",
    description: "Initial pitch (tilt) in degrees",
  },
  { name: "minZoom", type: "number", description: "Minimum zoom level" },
  { name: "maxZoom", type: "number", description: "Maximum zoom level" },
  { name: "minPitch", type: "number", description: "Minimum pitch in degrees" },
  { name: "maxPitch", type: "number", description: "Maximum pitch in degrees" },
  {
    name: "maxBounds",
    type: "LngLatBoundsLike",
    description:
      "Restrict map panning to these bounds [[sw_lng, sw_lat], [ne_lng, ne_lat]]",
  },
  {
    name: "fadeDuration",
    type: "number",
    description: "Duration of symbol fade-in/out animations in milliseconds",
  },
  {
    name: "theme",
    type: "'light' | 'dark'",
    description: "Map theme (auto-detected from system if not provided)",
  },
  {
    name: "styles",
    type: "{ light?: string; dark?: string }",
    description: "Custom map tile styles for light/dark themes",
  },
  {
    name: "projection",
    type: "ProjectionSpecification",
    description: "Map projection (e.g., { type: 'globe' })",
  },
  {
    name: "viewport",
    type: "Partial<MapViewport>",
    description: "Controlled viewport state with center, zoom, bearing, pitch",
  },
  {
    name: "onViewportChange",
    type: "(viewport: MapViewport) => void",
    description: "Callback when viewport changes (for controlled mode)",
  },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the map container",
  },
];

const mapEvents = [
  {
    name: "@load",
    type: "() => void",
    description: "Emitted when the map finishes loading",
  },
];

const controlsProps = [
  {
    name: "position",
    type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
    default: "'bottom-right'",
    description: "Position of the controls on the map",
  },
  {
    name: "showZoom",
    type: "boolean",
    default: "true",
    description: "Show zoom in/out buttons",
  },
  {
    name: "showCompass",
    type: "boolean",
    default: "false",
    description: "Show compass button that rotates with map bearing",
  },
  {
    name: "showLocate",
    type: "boolean",
    default: "false",
    description: "Show locate button to find user location",
  },
  {
    name: "showFullscreen",
    type: "boolean",
    default: "false",
    description: "Show fullscreen toggle button",
  },
  {
    name: "onLocate",
    type: "(coords: { longitude: number; latitude: number }) => void",
    description: "Callback when user location is found",
  },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the controls container",
  },
];

const markerProps = [
  {
    name: "longitude",
    type: "number",
    description: "Longitude coordinate (required)",
  },
  {
    name: "latitude",
    type: "number",
    description: "Latitude coordinate (required)",
  },
  {
    name: "draggable",
    type: "boolean",
    default: "false",
    description: "Whether the marker can be dragged",
  },
  {
    name: "anchor",
    type: "string",
    default: "'center'",
    description: "Anchor position of the marker element",
  },
  {
    name: "offset",
    type: "PointLike",
    description: "Offset in pixels from the anchor position",
  },
  {
    name: "rotation",
    type: "number",
    default: "0",
    description: "Rotation angle in degrees",
  },
  {
    name: "rotationAlignment",
    type: "'map' | 'viewport' | 'auto'",
    description: "How the marker rotation aligns with the map",
  },
  {
    name: "pitchAlignment",
    type: "'map' | 'viewport' | 'auto'",
    description: "How the marker pitch aligns with the map",
  },
  {
    name: "scale",
    type: "number",
    description: "Scale factor for the default marker",
  },
  {
    name: "color",
    type: "string",
    description: "Color of the default marker (if using default element)",
  },
  {
    name: "clickTolerance",
    type: "number",
    description: "Tolerance in pixels for click events",
  },
  {
    name: "subpixelPositioning",
    type: "boolean",
    description: "Enable subpixel positioning for smoother movement",
  },
  {
    name: "onClick",
    type: "(e: MouseEvent) => void",
    description: "Callback when marker is clicked",
  },
  {
    name: "onMouseEnter",
    type: "(e: MouseEvent) => void",
    description: "Callback when mouse enters marker",
  },
  {
    name: "onMouseLeave",
    type: "(e: MouseEvent) => void",
    description: "Callback when mouse leaves marker",
  },
  {
    name: "onDragStart",
    type: "(lngLat: { lng: number; lat: number }) => void",
    description: "Callback when drag starts",
  },
  {
    name: "onDrag",
    type: "(lngLat: { lng: number; lat: number }) => void",
    description: "Callback during drag",
  },
  {
    name: "onDragEnd",
    type: "(lngLat: { lng: number; lat: number }) => void",
    description: "Callback when drag ends",
  },
];

const markerContentProps = [
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the marker container",
  },
];

const markerLabelProps = [
  {
    name: "position",
    type: "'top' | 'bottom'",
    default: "'top'",
    description: "Position of the label relative to the marker",
  },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the label",
  },
];

const markerPopupProps = [
  {
    name: "offset",
    type: "number",
    default: "16",
    description: "Popup offset from marker in pixels",
  },
  {
    name: "closeButton",
    type: "boolean",
    default: "false",
    description: "Show a close button in the popup",
  },
  {
    name: "anchor",
    type: "'top' | 'bottom' | 'left' | 'right' | 'center' | ...",
    description: "Popup anchor position relative to the marker",
  },
  {
    name: "maxWidth",
    type: "string",
    description: "Max width of the popup (CSS value)",
  },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the popup container",
  },
];

const markerTooltipProps = [
  {
    name: "offset",
    type: "number",
    default: "16",
    description: "Tooltip offset from marker in pixels",
  },
  {
    name: "anchor",
    type: "'top' | 'bottom' | 'left' | 'right' | 'center' | ...",
    description: "Tooltip anchor position relative to the marker",
  },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the tooltip content",
  },
];

const mapPopupProps = [
  {
    name: "longitude",
    type: "number",
    description: "Longitude coordinate (required)",
  },
  {
    name: "latitude",
    type: "number",
    description: "Latitude coordinate (required)",
  },
  {
    name: "offset",
    type: "number",
    default: "16",
    description: "Popup offset from coordinates in pixels",
  },
  {
    name: "closeButton",
    type: "boolean",
    default: "false",
    description: "Show a close button",
  },
  {
    name: "anchor",
    type: "'top' | 'bottom' | 'left' | 'right' | 'center' | ...",
    description: "Popup anchor position",
  },
  {
    name: "onClose",
    type: "() => void",
    description: "Callback when popup closes",
  },
  {
    name: "class",
    type: "string",
    description: "Additional CSS classes for the popup container",
  },
];

const routeProps = [
  {
    name: "coordinates",
    type: "[number, number][]",
    description: "Array of [longitude, latitude] pairs (required)",
  },
  {
    name: "id",
    type: "string",
    description: "Unique layer/source ID (auto-generated if not provided)",
  },
  {
    name: "color",
    type: "string",
    default: "'#4285F4'",
    description: "Line color",
  },
  {
    name: "width",
    type: "number",
    default: "3",
    description: "Line width in pixels",
  },
  {
    name: "opacity",
    type: "number",
    default: "0.8",
    description: "Line opacity (0-1)",
  },
  {
    name: "dashArray",
    type: "[number, number]",
    description: "Dash pattern [dash length, gap length]",
  },
  {
    name: "animated",
    type: "boolean",
    default: "false",
    description: "Animate the route drawing",
  },
  {
    name: "animationDuration",
    type: "number",
    default: "2000",
    description: "Animation duration in milliseconds",
  },
  {
    name: "fitBounds",
    type: "boolean",
    default: "false",
    description: "Automatically zoom to fit the route",
  },
  {
    name: "fitBoundsOptions",
    type: "FitBoundsOptions",
    description: "Options for fitBounds (padding, maxZoom, etc.)",
  },
  {
    name: "interactive",
    type: "boolean",
    default: "true",
    description: "Enable hover/click interactions on the route",
  },
  {
    name: "onClick",
    type: "() => void",
    description: "Callback when route is clicked",
  },
  {
    name: "onMouseEnter",
    type: "() => void",
    description: "Callback when mouse enters the route",
  },
  {
    name: "onMouseLeave",
    type: "() => void",
    description: "Callback when mouse leaves the route",
  },
];

const clusterProps = [
  {
    name: "data",
    type: "string | GeoJSON.FeatureCollection<GeoJSON.Point>",
    description: "GeoJSON data or URL to a GeoJSON file (required)",
  },
  {
    name: "clusterMaxZoom",
    type: "number",
    default: "14",
    description: "Maximum zoom level at which to cluster points",
  },
  {
    name: "clusterRadius",
    type: "number",
    default: "50",
    description: "Cluster radius in pixels",
  },
  {
    name: "clusterColors",
    type: "[string, string, string]",
    default: "['#22c55e', '#eab308', '#ef4444']",
    description: "Colors for small, medium, and large clusters",
  },
  {
    name: "clusterThresholds",
    type: "[number, number]",
    default: "[100, 750]",
    description: "Point count thresholds for cluster color changes",
  },
  {
    name: "pointColor",
    type: "string",
    default: "'#3b82f6'",
    description: "Color for individual (unclustered) points",
  },
  {
    name: "onPointClick",
    type: "(feature: GeoJSON.Feature, coordinates: [number, number]) => void",
    description: "Callback when an individual point is clicked",
  },
  {
    name: "onClusterClick",
    type: "(clusterId: number, coordinates: [number, number], pointCount: number) => void",
    description:
      "Callback when a cluster is clicked (defaults to zoom-to-expand)",
  },
];

const geoJsonProps = [
  {
    name: "id",
    type: "string",
    description: "Unique identifier for the layer (auto-generated if omitted)",
  },
  {
    name: "data",
    type: "FeatureCollection | Feature<Geometry>",
    description: "GeoJSON data to render on the map",
  },
  {
    name: "layerType",
    type: "'fill' | 'line' | 'circle' | 'symbol'",
    default: "'fill'",
    description: "The type of MapLibre layer to render",
  },
  {
    name: "style",
    type: "GeoJsonLayerStyle",
    description:
      "Style overrides (fillColor, strokeColor, strokeWidth, circleRadius, etc.)",
  },
  {
    name: "fitBounds",
    type: "boolean",
    default: "false",
    description: "Automatically fit the map bounds to the data extent",
  },
  {
    name: "fitBoundsOptions",
    type: "FitBoundsOptions",
    description: "MapLibre fit bounds options (padding, maxZoom, etc.)",
  },
  {
    name: "interactive",
    type: "boolean",
    default: "true",
    description: "Enable hover and click interactions on the layer",
  },
];

const geoJsonEvents = [
  {
    name: "@click",
    type: "(feature: Feature) => void",
    description: "Emitted when a feature is clicked",
  },
  {
    name: "@mouseEnter",
    type: "(feature: Feature) => void",
    description: "Emitted when the cursor enters a feature",
  },
  {
    name: "@mouseLeave",
    type: "() => void",
    description: "Emitted when the cursor leaves a feature",
  },
];

const imageOverlayProps = [
  {
    name: "id",
    type: "string",
    description:
      "Unique identifier for the overlay (auto-generated if omitted)",
  },
  {
    name: "url",
    type: "string",
    description: "URL of the image to overlay on the map",
  },
  {
    name: "coordinates",
    type: "[[number, number], [number, number], [number, number], [number, number]]",
    description:
      "Four corner coordinates [topLeft, topRight, bottomRight, bottomLeft]",
  },
  {
    name: "opacity",
    type: "number",
    default: "1",
    description: "Opacity of the raster image (0-1)",
  },
];

const deckGLOverlayProps = [
  {
    name: "layers",
    type: "Layer[]",
    description: "Array of deck.gl Layer instances to render",
  },
  {
    name: "interleaved",
    type: "boolean",
    default: "true",
    description:
      "Whether deck.gl layers interleave with MapLibre layers (true) or render on top (false)",
  },
];

const useMapRouteCode = `const { isSetup, sourceId, layerId } = useMapRoute({
  coordinates: [...],
  color: '#4285F4',
  width: 3,
  onClick: () => console.log('clicked'),
})`;

const useMapGeoJsonCode = `const { isSetup, sourceId, layerId } = useMapGeoJson({
  data: geojsonData,
  layerType: 'fill',
  style: { fillColor: '#3b82f6', fillOpacity: 0.5 },
  onClick: (feature) => console.log(feature),
})`;

const useDeckGLOverlayCode = `const { isSetup, overlayRef } = useDeckGLOverlay({
  layers: [new ScatterplotLayer({ ... })],
  interleaved: true,
})`;

const useMapClusterLayerCode = `const { isSetup, sourceId } = useMapClusterLayer({
  data: 'https://example.com/points.geojson',
  clusterRadius: 50,
  clusterMaxZoom: 14,
  clusterColors: ['#22c55e', '#eab308', '#ef4444'],
  onPointClick: (feature, coords) => console.log(feature),
})`;

const useMapImageOverlayCode = `const { isSetup, sourceId, layerId } = useMapImageOverlay({
  url: 'https://example.com/overlay.png',
  coordinates: [
    [-80.425, 46.437],  // top-left
    [-71.516, 46.437],  // top-right
    [-71.516, 37.936],  // bottom-right
    [-80.425, 37.936],  // bottom-left
  ],
  opacity: 0.7,
})`;

const useMarkerContextCode = `// Inside a MapMarker child component:
const { marker, map, isReady } = useMarkerContext()`;

const starfieldCode = `import { MapStarfieldLayer } from '@@/registry/map'

// Add to map after style loads:
map.addLayer(
  MapStarfieldLayer({
    starCount: 4000,
    starSize: 2.0,
    galaxyTextureUrl: '/milky-way.jpg',
    galaxyBrightness: 0.35,
  })
)`;
</script>

<template>
  <DocsLayout
    title="API Reference"
    description="Complete reference for all map components and their props."
    :prev="{ title: 'Installation', href: '/docs/installation' }"
    :next="{ title: 'Examples', href: '/docs/examples' }"
    :toc="[
      { title: 'Component Anatomy', slug: 'component-anatomy' },
      { title: 'Map', slug: 'map' },
      { title: 'useMap', slug: 'usemap' },
      { title: 'MapControls', slug: 'mapcontrols' },
      { title: 'MapMarker', slug: 'mapmarker' },
      { title: 'MarkerContent', slug: 'markercontent' },
      { title: 'MarkerLabel', slug: 'markerlabel' },
      { title: 'MarkerPopup', slug: 'markerpopup' },
      { title: 'MarkerTooltip', slug: 'markertooltip' },
      { title: 'MapPopup', slug: 'mappopup' },
      { title: 'MapRoute', slug: 'maproute' },
      { title: 'MapClusterLayer', slug: 'mapclusterlayer' },
      { title: 'MapGeoJson', slug: 'mapgeojson' },
      { title: 'MapImageOverlay', slug: 'mapimageoverlay' },
      { title: 'DeckGLOverlay', slug: 'deckgloverlay' },
      { title: 'MapStarfieldLayer', slug: 'mapstarfieldlayer' },
      { title: 'Composables', slug: 'composables' },
    ]"
  >
    <DocsNote>
      <strong>Note:</strong> This library is built on top of
      <DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/" external>
        MapLibre GL JS </DocsLink
      >. Most components extend the native MapLibre options.
    </DocsNote>

    <DocsSection title="Component Anatomy">
      <p>
        All parts of the component that you can use and combine to build your
        map.
      </p>
      <CodeBlock :code="anatomyCode" :show-copy-button="false" />
    </DocsSection>

    <DocsSection title="Map">
      <p>
        The root container component that initializes MapLibre GL and provides
        context to child components. Automatically handles theme switching
        between light and dark modes.
      </p>
      <DocsPropTable :props="mapProps" />
      <h4 class="text-sm font-medium mt-6 mb-2">Events</h4>
      <DocsPropTable :props="mapEvents" />
    </DocsSection>

    <DocsSection title="useMap">
      <p>
        A composable that provides access to the MapLibre map instance and
        loading state. Must be used within a <DocsCode>Map</DocsCode> component.
      </p>
      <CodeBlock :code="useMapCode" language="ts" :show-copy-button="false" />
      <p class="mt-4">Returns an object with:</p>
      <ul class="mt-2 space-y-1 list-disc list-inside">
        <li>
          <DocsCode>map</DocsCode> - The MapLibre GL map instance (ShallowRef)
        </li>
        <li>
          <DocsCode>isLoaded</DocsCode> - Whether the map has fired its
          <DocsCode>load</DocsCode> event
        </li>
        <li>
          <DocsCode>isStyleLoaded</DocsCode> - Whether the map style has
          finished loading
        </li>
        <li>
          <DocsCode>hasRendered</DocsCode> - Whether the map has completed its
          first render
        </li>
      </ul>
    </DocsSection>

    <DocsSection title="MapControls">
      <p>
        Renders map control buttons (zoom, compass, locate, fullscreen). Must be
        used inside <DocsCode>Map</DocsCode>. The compass automatically rotates
        to match the map's bearing and pitch.
      </p>
      <DocsPropTable :props="controlsProps" />
    </DocsSection>

    <DocsSection title="MapMarker">
      <p>
        Renders a customizable marker on the map. Extends MapLibre's
        <DocsCode>MarkerOptions</DocsCode> (minus <DocsCode>element</DocsCode>).
        Provides context for child MarkerPopup and MarkerTooltip components.
      </p>
      <DocsPropTable :props="markerProps" />
    </DocsSection>

    <DocsSection title="MarkerContent">
      <p>
        Renders custom content inside a marker. Must be used inside
        <DocsCode>MapMarker</DocsCode>. If no children are provided, a default
        blue dot marker is rendered.
      </p>
      <DocsPropTable :props="markerContentProps" />
    </DocsSection>

    <DocsSection title="MarkerLabel">
      <p>
        Renders a text label positioned above or below a marker. Must be used
        inside
        <DocsCode>MarkerContent</DocsCode>.
      </p>
      <DocsPropTable :props="markerLabelProps" />
    </DocsSection>

    <DocsSection title="MarkerPopup">
      <p>
        Displays a popup when the marker is clicked. Must be used inside
        <DocsCode>MapMarker</DocsCode>. Extends MapLibre's
        <DocsCode>PopupOptions</DocsCode>. The popup content is fully
        customizable using the default slot.
      </p>
      <DocsPropTable :props="markerPopupProps" />
    </DocsSection>

    <DocsSection title="MarkerTooltip">
      <p>
        Displays a tooltip on hover. Must be used inside
        <DocsCode>MapMarker</DocsCode>. Extends MapLibre's
        <DocsCode>PopupOptions</DocsCode> (minus closeButton and closeOnClick).
        Perfect for showing brief information without clicking.
      </p>
      <DocsPropTable :props="markerTooltipProps" />
    </DocsSection>

    <DocsSection title="MapPopup">
      <p>
        A standalone popup placed at specific coordinates on the map. Unlike
        MarkerPopup, this is not tied to a marker. Extends MapLibre's
        <DocsCode>PopupOptions</DocsCode>.
      </p>
      <DocsPropTable :props="mapPopupProps" />
    </DocsSection>

    <DocsSection title="MapRoute">
      <p>
        Renders a line/route on the map connecting coordinate points. Supports
        animation, dash patterns, and automatic bounds fitting.
      </p>
      <DocsPropTable :props="routeProps" />
    </DocsSection>

    <DocsSection title="MapClusterLayer">
      <p>
        Renders clustered point data using MapLibre GL's native clustering.
        Points are automatically grouped at low zoom levels and expand as you
        zoom in.
      </p>
      <DocsPropTable :props="clusterProps" />
    </DocsSection>

    <DocsSection title="MapGeoJson">
      <p>
        Renders GeoJSON data on the map as fill, line, circle, or symbol layers.
        Supports interactive features with click and hover events, automatic
        bounds fitting, and customizable styling.
      </p>
      <DocsPropTable :props="geoJsonProps" />
      <h4 class="text-sm font-medium mt-6 mb-2">Events</h4>
      <DocsPropTable :props="geoJsonEvents" />
    </DocsSection>

    <DocsSection title="MapImageOverlay">
      <p>
        Overlays a raster image on the map, positioned by four corner
        coordinates. Useful for historical maps, floor plans, or custom imagery.
      </p>
      <DocsPropTable :props="imageOverlayProps" />
    </DocsSection>

    <DocsSection title="DeckGLOverlay">
      <p>
        Integrates
        <DocsLink href="https://deck.gl" external>deck.gl</DocsLink>
        layers with the MapLibre map using the
        <DocsCode>@deck.gl/mapbox</DocsCode> overlay. Supports interleaved
        rendering where deck.gl layers render between MapLibre layers for proper
        depth ordering.
      </p>
      <DocsPropTable :props="deckGLOverlayProps" />
    </DocsSection>

    <DocsSection title="MapStarfieldLayer">
      <p>
        A Three.js custom layer that renders a procedural starfield skybox
        behind the globe. Implements MapLibre's
        <DocsCode>CustomLayerInterface</DocsCode>. Best used with
        <DocsCode>projection: { type: 'globe' }</DocsCode>.
      </p>
      <CodeBlock
        :code="starfieldCode"
        language="ts"
        :show-copy-button="false"
      />
      <p class="mt-4">Options:</p>
      <ul class="mt-2 space-y-1 list-disc list-inside text-sm">
        <li>
          <DocsCode>id</DocsCode> — Layer ID (default:
          <DocsCode>"starfield"</DocsCode>)
        </li>
        <li>
          <DocsCode>starCount</DocsCode> — Number of point stars (default: 4000)
        </li>
        <li><DocsCode>starSize</DocsCode> — Base point size (default: 2.0)</li>
        <li>
          <DocsCode>starColor</DocsCode> — Hex color for stars (default:
          0xffffff)
        </li>
        <li>
          <DocsCode>galaxyTextureUrl</DocsCode> — URL to a panoramic Milky Way
          texture (equirectangular). Omit for point stars only.
        </li>
        <li>
          <DocsCode>galaxyBrightness</DocsCode> — Brightness multiplier for the
          galaxy texture (default: 0.35)
        </li>
      </ul>
      <DocsNote class="mt-4">
        Requires <DocsCode>three</DocsCode> as a peer dependency. Install with
        <DocsCode>bun add three</DocsCode>.
      </DocsNote>
    </DocsSection>

    <DocsSection title="Composables">
      <p>
        All renderless components are also available as composables for use in
        <DocsCode>&lt;script setup&gt;</DocsCode> without a component wrapper.
        Each composable provides the same functionality as its component
        counterpart.
      </p>

      <h4 class="text-sm font-medium mt-6 mb-2">useMapRoute</h4>
      <p class="text-sm text-muted-foreground mb-2">
        Programmatically add a route/line layer to the map.
      </p>
      <CodeBlock
        :code="useMapRouteCode"
        language="ts"
        :show-copy-button="false"
      />

      <h4 class="text-sm font-medium mt-6 mb-2">useMapGeoJson</h4>
      <p class="text-sm text-muted-foreground mb-2">
        Programmatically add a GeoJSON layer with interactive features.
      </p>
      <CodeBlock
        :code="useMapGeoJsonCode"
        language="ts"
        :show-copy-button="false"
      />

      <h4 class="text-sm font-medium mt-6 mb-2">useDeckGLOverlay</h4>
      <p class="text-sm text-muted-foreground mb-2">
        Programmatically add a deck.gl overlay to the map.
      </p>
      <CodeBlock
        :code="useDeckGLOverlayCode"
        language="ts"
        :show-copy-button="false"
      />

      <h4 class="text-sm font-medium mt-6 mb-2">useMapClusterLayer</h4>
      <p class="text-sm text-muted-foreground mb-2">
        Programmatically add a clustered point layer to the map. Points are
        grouped into circles at low zoom levels and expand as you zoom in.
      </p>
      <CodeBlock
        :code="useMapClusterLayerCode"
        language="ts"
        :show-copy-button="false"
      />

      <h4 class="text-sm font-medium mt-6 mb-2">useMapImageOverlay</h4>
      <p class="text-sm text-muted-foreground mb-2">
        Programmatically overlay a raster image on the map positioned by four
        corner coordinates.
      </p>
      <CodeBlock
        :code="useMapImageOverlayCode"
        language="ts"
        :show-copy-button="false"
      />

      <h4 class="text-sm font-medium mt-6 mb-2">useMarkerContext</h4>
      <p class="text-sm text-muted-foreground mb-2">
        Access the parent <DocsCode>MapMarker</DocsCode>'s marker instance and
        map reference from a child component. Must be called inside a
        <DocsCode>MapMarker</DocsCode>.
      </p>
      <CodeBlock
        :code="useMarkerContextCode"
        language="ts"
        :show-copy-button="false"
      />
      <p class="mt-3 text-sm">Returns an object with:</p>
      <ul class="mt-2 space-y-1 list-disc list-inside text-sm">
        <li>
          <DocsCode>marker</DocsCode> — The MapLibre Marker instance
          (ShallowRef)
        </li>
        <li>
          <DocsCode>map</DocsCode> — The MapLibre Map instance (ShallowRef)
        </li>
        <li>
          <DocsCode>isReady</DocsCode> — Whether the marker has been added to
          the map
        </li>
      </ul>
    </DocsSection>
  </DocsLayout>
</template>
