<script setup lang="ts">
import { Map, MapControls } from '~~/registry/map'
import DocsLayout from '~/components/docs/DocsLayout.vue'
import DocsSection from '~/components/docs/DocsSection.vue'
import DocsCode from '~/components/docs/DocsCode.vue'
import ExamplePreview from '~/components/docs/ExamplePreview.vue'

definePageMeta({ layout: 'docs' })
useSeoMeta({ title: 'Controls - mapcn-vue' })

const controlsCode = `<template>
  <div class="h-[400px] w-full">
    <Map :center="[2.3522, 48.8566]" :zoom="11">
      <MapControls
        position="bottom-right"
        :show-zoom="true"
        :show-compass="true"
        :show-locate="true"
        :show-fullscreen="true"
      />
    </Map>
  </div>
</template>`
</script>

<template>
  <DocsLayout
    title="Controls"
    description="Add interactive controls to your map for zoom, compass, location, and fullscreen."
    :prev="{ title: 'Map', href: '/docs/basic-map' }"
    :next="{ title: 'Markers', href: '/docs/markers' }"
    :toc="[
      { title: 'Default Controls', slug: 'default-controls' },
    ]"
  >
    <DocsSection id="default-controls" title="Default Controls">
      <p>
        The <DocsCode>MapControls</DocsCode> component provides a set of
        interactive controls that can be positioned on any corner of the map.
      </p>
      <ExamplePreview :code="controlsCode" class="mt-4">
        <Map :center="[2.3522, 48.8566]" :zoom="11" class="h-full">
          <MapControls
            position="bottom-right"
            :show-zoom="true"
            :show-compass="true"
            :show-locate="true"
            :show-fullscreen="true"
          />
        </Map>
      </ExamplePreview>
    </DocsSection>
  </DocsLayout>
</template>
