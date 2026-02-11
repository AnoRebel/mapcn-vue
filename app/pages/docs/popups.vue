<script setup lang="ts">
import { ref } from 'vue'
import { Map, MapPopup } from '~~/registry/map'
import { Button } from '~/components/ui/button'
import DocsLayout from '~/components/docs/DocsLayout.vue'
import DocsSection from '~/components/docs/DocsSection.vue'
import DocsCode from '~/components/docs/DocsCode.vue'
import ExamplePreview from '~/components/docs/ExamplePreview.vue'

definePageMeta({ layout: 'docs' })
useSeoMeta({
  title: 'Popups',
  description: 'Display standalone popups at any coordinates on the map with custom content, close buttons, and anchor positioning.',
})

const showPopup = ref(true)

const popupCode = `<script setup lang="ts">
import { ref } from 'vue'

const showPopup = ref(true)
<\/script>

<template>
  <div class="h-[400px] w-full relative">
    <Map :center="[-74.006, 40.7128]" :zoom="13">
      <MapPopup
        v-if="showPopup"
        :longitude="-74.006"
        :latitude="40.7128"
        @close="showPopup = false"
        :close-button="true"
      >
        <div class="space-y-2">
          <h3 class="font-semibold text-foreground">New York City</h3>
          <p class="text-sm text-muted-foreground">
            The city that never sleeps. Population: 8.3 million
          </p>
          <Button size="sm" variant="outline" @click="showPopup = false">
            Close
          </Button>
        </div>
      </MapPopup>
    </Map>
    <Button v-if="!showPopup" @click="showPopup = true" class="absolute bottom-4 left-4 z-10">
      Show Popup
    </Button>
  </div>
</template>`
</script>

<template>
  <DocsLayout
    title="Popups"
    description="Display information windows that can be positioned on the map."
    :prev="{ title: 'Markers', href: '/docs/markers' }"
    :next="{ title: 'Routes', href: '/docs/routes' }"
    :toc="[
      { title: 'Basic Popup', slug: 'basic-popup' },
    ]"
  >
    <DocsSection id="basic-popup" title="Basic Popup">
      <p>
        Use <DocsCode>MapPopup</DocsCode> to display content at a specific location.
        Popups can be closed and support custom content.
      </p>
      <ExamplePreview :code="popupCode" class="mt-4">
        <div class="relative h-full">
          <Map :center="[-74.006, 40.7128]" :zoom="13" class="h-full">
            <MapPopup
              v-if="showPopup"
              :longitude="-74.006"
              :latitude="40.7128"
              :close-button="true"
              @close="showPopup = false"
            >
              <div class="space-y-2">
                <h3 class="font-semibold text-foreground">New York City</h3>
                <p class="text-sm text-muted-foreground">
                  The city that never sleeps. Population: 8.3 million
                </p>
                <Button size="sm" variant="outline" @click="showPopup = false">
                  Close
                </Button>
              </div>
            </MapPopup>
          </Map>
          <Button v-if="!showPopup" class="absolute bottom-4 left-4 z-10" @click="showPopup = true">
            Show Popup
          </Button>
        </div>
      </ExamplePreview>
    </DocsSection>
  </DocsLayout>
</template>
