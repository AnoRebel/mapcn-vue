<script setup lang="ts">
import DocsLayout from '~/components/docs/DocsLayout.vue'
import DocsSection from '~/components/docs/DocsSection.vue'
import DocsCode from '~/components/docs/DocsCode.vue'
import CodeBlock from '~/components/docs/CodeBlock.vue'
import DocsPropTable from '~/components/docs/DocsPropTable.vue'

definePageMeta({ layout: 'docs' })
useSeoMeta({ title: 'API Reference - mapcn-vue' })

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
</Map>`

const useMapCode = `const { map, isLoaded, isStyleLoaded } = useMap()`
</script>

<template>
  <DocsLayout
    title="API Reference"
    description="Complete reference for all map components and their props."
    :prev="{ title: 'Installation', href: '/docs/installation' }"
    :next="{ title: 'Map', href: '/docs/basic-map' }"
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
    ]"
  >
    <DocsNote>
      <strong>Note:</strong> This library is built on top of
      <DocsLink href="https://maplibre.org/maplibre-gl-js/docs/API/" external>
        MapLibre GL JS
      </DocsLink>. Most components extend the native MapLibre options.
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
      <DocsPropTable
        :props="[
          { name: 'center', type: '[number, number]', description: 'Initial center coordinates [longitude, latitude]' },
          { name: 'zoom', type: 'number', default: '10', description: 'Initial zoom level' },
          { name: 'theme', type: '\'light\' | \'dark\'', description: 'Map theme (auto-detected if not provided)' },
          { name: 'viewport', type: 'Partial&lt;MapViewport&gt;', description: 'Controlled viewport state with center, zoom, bearing, pitch' },
          { name: 'onViewportChange', type: '(viewport: MapViewport) =&gt; void', description: 'Callback when viewport changes (for controlled mode)' },
          { name: 'projection', type: 'ProjectionSpecification', description: 'Map projection (e.g., { type: \'globe\' })' },
          { name: 'styles', type: '{ light?: string, dark?: string }', description: 'Custom map styles for light/dark themes' },
        ]"
      />
    </DocsSection>

    <DocsSection title="useMap">
      <p>
        A composable that provides access to the MapLibre map instance and loading
        state. Must be used within a <DocsCode>Map</DocsCode> component.
      </p>
      <CodeBlock :code="useMapCode" language="ts" :show-copy-button="false" />
      <p class="mt-4">
        Returns an object with:
      </p>
      <ul class="mt-2 space-y-1 list-disc list-inside">
        <li><DocsCode>map</DocsCode> - The MapLibre GL map instance (ref)</li>
        <li><DocsCode>isLoaded</DocsCode> - Boolean indicating if the map is loaded</li>
        <li><DocsCode>isStyleLoaded</DocsCode> - Boolean indicating if the map style is loaded</li>
      </ul>
    </DocsSection>

    <DocsSection title="MapControls">
      <p>
        Renders map control buttons (zoom, compass, locate, fullscreen). Must
        be used inside <DocsCode>Map</DocsCode>. The compass automatically rotates
        to match the map's bearing.
      </p>
      <DocsPropTable
        :props="[
          { name: 'position', type: '\'top-left\' | \'top-right\' | \'bottom-left\' | \'bottom-right\'', default: '\'bottom-right\'', description: 'Position of the controls' },
          { name: 'showZoom', type: 'boolean', default: 'true', description: 'Show zoom in/out buttons' },
          { name: 'showCompass', type: 'boolean', default: 'false', description: 'Show compass button that rotates with map bearing' },
          { name: 'showLocate', type: 'boolean', default: 'false', description: 'Show locate button to find user location' },
          { name: 'showFullscreen', type: 'boolean', default: 'false', description: 'Show fullscreen toggle button' },
          { name: 'onLocate', type: '(coords: { longitude: number; latitude: number }) =&gt; void', description: 'Callback when user location is found' },
        ]"
      />
    </DocsSection>

    <DocsSection title="MapMarker">
      <p>
        Renders a customizable marker on the map. Supports drag events and provides
        context for MarkerPopup and MarkerTooltip components.
      </p>
      <DocsPropTable
        :props="[
          { name: 'longitude', type: 'number', description: 'Longitude coordinate (required)' },
          { name: 'latitude', type: 'number', description: 'Latitude coordinate (required)' },
          { name: 'draggable', type: 'boolean', default: 'false', description: 'Whether the marker is draggable' },
          { name: 'onDragStart', type: '(lngLat: { lng: number; lat: number }) =&gt; void', description: 'Callback when drag starts' },
          { name: 'onDrag', type: '(lngLat: { lng: number; lat: number }) =&gt; void', description: 'Callback during drag' },
          { name: 'onDragEnd', type: '(lngLat: { lng: number; lat: number }) =&gt; void', description: 'Callback when drag ends' },
          { name: 'onClick', type: '(e: MouseEvent) =&gt; void', description: 'Callback when marker is clicked' },
          { name: 'onMouseEnter', type: '(e: MouseEvent) =&gt; void', description: 'Callback when mouse enters marker' },
          { name: 'onMouseLeave', type: '(e: MouseEvent) =&gt; void', description: 'Callback when mouse leaves marker' },
          { name: 'anchor', type: 'string', default: '\'center\'', description: 'The anchor position of the marker' },
          { name: 'offset', type: 'PointLike', description: 'Offset in pixels from the anchor position' },
          { name: 'rotation', type: 'number', default: '0', description: 'Rotation angle in degrees' },
        ]"
      />
    </DocsSection>

    <DocsSection title="MarkerContent">
      <p>
        Renders custom content inside a marker. Must be used inside
        <DocsCode>MapMarker</DocsCode>. If no children are provided, a default
        blue dot marker is rendered.
      </p>
      <DocsPropTable
        :props="[
          { name: 'class', type: 'string', description: 'Additional CSS classes for the marker container' },
        ]"
      />
    </DocsSection>

    <DocsSection title="MarkerLabel">
      <p>
        Renders a text label positioned above or below a marker. Must be used inside
        <DocsCode>MarkerContent</DocsCode>.
      </p>
      <DocsPropTable
        :props="[
          { name: 'position', type: '\'top\' | \'bottom\'', default: '\'top\'', description: 'Position of the label relative to the marker' },
          { name: 'class', type: 'string', description: 'Additional CSS classes for the label' },
        ]"
      />
    </DocsSection>

    <DocsSection title="MarkerPopup">
      <p>
        Displays a popup when the marker is clicked. Must be used inside MapMarker.
        The popup content is fully customizable using the default slot.
      </p>
      <DocsPropTable
        :props="[
          { name: 'offset', type: 'number', default: '16', description: 'Popup offset from marker in pixels' },
          { name: 'closeButton', type: 'boolean', default: 'false', description: 'Show close button in popup' },
          { name: 'closeOnClick', type: 'boolean', default: 'true', description: 'Close popup when clicking elsewhere' },
          { name: 'anchor', type: '\'top\' | \'bottom\' | \'left\' | \'right\' | \'center\' | \'top-left\' | \'top-right\' | \'bottom-left\' | \'bottom-right\'', description: 'Popup anchor position' },
        ]"
      />
    </DocsSection>

    <DocsSection title="MarkerTooltip">
      <p>
        Displays a tooltip on hover. Must be used inside MapMarker.
        Perfect for showing brief information without clicking.
      </p>
      <DocsPropTable
        :props="[
          { name: 'offset', type: 'number', default: '16', description: 'Tooltip offset from marker in pixels' },
          { name: 'anchor', type: '\'top\' | \'bottom\' | \'left\' | \'right\' | \'center\' | \'top-left\' | \'top-right\' | \'bottom-left\' | \'bottom-right\'', description: 'Tooltip anchor position' },
        ]"
      />
    </DocsSection>

    <DocsSection title="MapPopup">
      <p>
        A standalone popup that can be placed anywhere on the map using coordinates.
        Unlike MarkerPopup, this is not tied to a marker.
      </p>
      <DocsPropTable
        :props="[
          { name: 'longitude', type: 'number', description: 'Longitude coordinate (required)' },
          { name: 'latitude', type: 'number', description: 'Latitude coordinate (required)' },
          { name: 'offset', type: 'number', default: '16', description: 'Popup offset from coordinates in pixels' },
          { name: 'closeButton', type: 'boolean', default: 'false', description: 'Show close button' },
          { name: 'closeOnClick', type: 'boolean', default: 'true', description: 'Close when clicking elsewhere' },
          { name: 'onClose', type: '() =&gt; void', description: 'Callback when popup closes' },
        ]"
      />
    </DocsSection>

    <DocsSection title="MapRoute">
      <p>
        Renders a line/route on the map connecting coordinate points.
        Supports animation and automatic bounds fitting.
      </p>
      <DocsPropTable
        :props="[
          { name: 'coordinates', type: '[number, number][]', description: 'Array of [longitude, latitude] pairs (required)' },
          { name: 'color', type: 'string', default: '\'#4285F4\'', description: 'Line color' },
          { name: 'width', type: 'number', default: '3', description: 'Line width in pixels' },
          { name: 'opacity', type: 'number', default: '0.8', description: 'Line opacity (0-1)' },
          { name: 'dashArray', type: '[number, number]', description: 'Dash pattern [dash length, gap length]' },
          { name: 'animated', type: 'boolean', default: 'false', description: 'Animate the route drawing' },
          { name: 'animationDuration', type: 'number', default: '2000', description: 'Animation duration in milliseconds' },
          { name: 'fitBounds', type: 'boolean', default: 'false', description: 'Automatically zoom to fit the route' },
          { name: 'fitBoundsOptions', type: 'FitBoundsOptions', description: 'Options for fitBounds (padding, etc)' },
          { name: 'interactive', type: 'boolean', default: 'true', description: 'Enable hover/click interactions' },
          { name: 'onClick', type: '() =&gt; void', description: 'Callback when route is clicked' },
        ]"
      />
    </DocsSection>

    <DocsSection title="MapClusterLayer">
      <p>
        Renders clustered point data using MapLibre GL's native clustering.
        Points are automatically grouped at low zoom levels and expand as you zoom in.
      </p>
      <DocsPropTable
        :props="[
          { name: 'data', type: 'string | GeoJSON.FeatureCollection&lt;GeoJSON.Point&gt;', description: 'GeoJSON data or URL (required)' },
          { name: 'clusterMaxZoom', type: 'number', default: '14', description: 'Maximum zoom level to cluster points' },
          { name: 'clusterRadius', type: 'number', default: '50', description: 'Cluster radius in pixels' },
          { name: 'clusterColors', type: '[string, string, string]', default: '[\'#22c55e\', \'#eab308\', \'#ef4444\']', description: 'Colors for different cluster sizes' },
          { name: 'clusterThresholds', type: '[number, number]', default: '[100, 750]', description: 'Point count thresholds for cluster colors' },
          { name: 'pointColor', type: 'string', default: '\'#3b82f6\'', description: 'Color for individual (unclustered) points' },
          { name: 'onPointClick', type: '(feature: GeoJSON.Feature, coordinates: [number, number]) =&gt; void', description: 'Callback when a point is clicked' },
          { name: 'onClusterClick', type: '(clusterId: number, coordinates: [number, number], pointCount: number) =&gt; void', description: 'Callback when a cluster is clicked' },
        ]"
      />
    </DocsSection>
  </DocsLayout>
</template>
