<script setup lang="ts">
import { Map, MapRoute, MapMarker, MarkerContent, MapControls } from '~~/registry/map'
import DocsLayout from '~/components/docs/DocsLayout.vue'
import DocsSection from '~/components/docs/DocsSection.vue'
import DocsCode from '~/components/docs/DocsCode.vue'
import DocsLink from '~/components/docs/DocsLink.vue'
import ExamplePreview from '~/components/docs/ExamplePreview.vue'
import RoutePlanningExample from '~/components/docs/examples/RoutePlanningExample.vue'
import AnimatedRouteExample from '~/components/docs/examples/AnimatedRouteExample.vue'

definePageMeta({ layout: 'docs' })
useSeoMeta({
  title: 'Routes',
  description: 'Draw routes and lines on the map with animation, dash patterns, auto-fit bounds, and click interactions.',
})

// NYC to Brooklyn route example
const routeCoordinates: [number, number][] = [
  [-74.006, 40.7128],
  [-73.9857, 40.7484],
  [-73.9654, 40.7829],
  [-73.9442, 40.6782],
]

const routeCode = `<script setup lang="ts">
const routeCoordinates = [
  [-74.006, 40.7128],
  [-73.9857, 40.7484],
  [-73.9654, 40.7829],
  [-73.9442, 40.6782],
]
<\/script>

<template>
  <div class="h-[400px] w-full">
    <Map :center="[-73.98, 40.75]" :zoom="11.2">
      <MapRoute
        :coordinates="routeCoordinates"
        color="#3b82f6"
        :width="4"
        :opacity="0.8"
      />
      <MapMarker
        v-for="(coord, index) in routeCoordinates"
        :key="index"
        :longitude="coord[0]"
        :latitude="coord[1]"
      >
        <MarkerContent>
          <div class="size-4.5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-semibold">
            {{ index + 1 }}
          </div>
        </MarkerContent>
      </MapMarker>
    </Map>
  </div>
</template>`

const animatedRouteCode = `<script setup lang="ts">
const routeCoordinates = [
  [-74.006, 40.7128],
  [-73.9857, 40.7484],
  [-73.9654, 40.7829],
  [-73.9442, 40.6782],
]
<\/script>

<template>
  <div class="h-[400px] w-full">
    <Map :center="[-73.98, 40.75]" :zoom="11.2">
      <MapRoute
        :coordinates="routeCoordinates"
        color="#10b981"
        :width="4"
        :opacity="0.8"
        animated
        :animation-duration="2000"
      />
      <MapMarker
        v-for="(coord, index) in routeCoordinates"
        :key="index"
        :longitude="coord[0]"
        :latitude="coord[1]"
      >
        <MarkerContent>
          <div class="size-4.5 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-semibold">
            {{ index + 1 }}
          </div>
        </MarkerContent>
      </MapMarker>
    </Map>
  </div>
</template>`
</script>

<template>
  <DocsLayout
    title="Routes"
    description="Draw lines and paths connecting coordinates on the map."
    :prev="{ title: 'Popups', href: '/docs/popups' }"
    :next="{ title: 'Clusters', href: '/docs/clusters' }"
    :toc="[
      { title: 'Basic Route', slug: 'basic-route' },
      { title: 'Animated Route', slug: 'animated-route' },
      { title: 'Live Tracking', slug: 'live-tracking' },
      { title: 'Route Planning', slug: 'route-planning' },
    ]"
  >
    <DocsSection>
      <p>
        Use <DocsCode>MapRoute</DocsCode> to draw lines connecting a series of
        coordinates. Perfect for showing directions, trails, or any path
        between points.
      </p>
    </DocsSection>

    <DocsSection id="basic-route" title="Basic Route">
      <p>Draw a route with numbered stop markers along the path.</p>
      <ExamplePreview :code="routeCode" class="mt-4">
        <Map class="h-full">
          <MapRoute
            :coordinates="routeCoordinates"
            color="#3b82f6"
            :width="4"
            :opacity="0.8"
            :fit-bounds="true"
          />
          <MapMarker
            v-for="(coord, index) in routeCoordinates"
            :key="index"
            :longitude="coord[0]"
            :latitude="coord[1]"
          >
            <MarkerContent>
              <div class="size-4.5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-semibold">
                {{ index + 1 }}
              </div>
            </MarkerContent>
          </MapMarker>
          <MapControls />
        </Map>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="animated-route" title="Animated Route">
      <p>Add smooth animation to your routes with the <DocsCode>animated</DocsCode> prop.</p>
      <ExamplePreview :code="animatedRouteCode" class="mt-4">
        <Map class="h-full">
          <MapRoute
            :coordinates="routeCoordinates"
            color="#10b981"
            :width="4"
            :opacity="0.8"
            animated
            :animation-duration="2000"
            :fit-bounds="true"
          />
          <MapMarker
            v-for="(coord, index) in routeCoordinates"
            :key="index"
            :longitude="coord[0]"
            :latitude="coord[1]"
          >
            <MarkerContent>
              <div class="size-4.5 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-semibold">
                {{ index + 1 }}
              </div>
            </MarkerContent>
          </MapMarker>
          <MapControls />
        </Map>
      </ExamplePreview>
    </DocsSection>

    <DocsSection id="live-tracking" title="Live Tracking">
      <p>
        Simulate a vehicle or person traveling along a route with configurable
        transport modes (walking, driving, commuting). Features start/pause/reset
        controls, progress tracking, and editable destinations.
      </p>
      <AnimatedRouteExample class="mt-4" />
    </DocsSection>

    <DocsSection id="route-planning" title="Route Planning">
      <p>
        Display multiple route options and let users select between them.
        This example fetches real driving directions from the
        <DocsLink href="http://project-osrm.org/" external>OSRM API</DocsLink>.
        Click on a route or use the buttons to switch.
      </p>
      <RoutePlanningExample class="mt-4" />
    </DocsSection>
  </DocsLayout>
</template>
