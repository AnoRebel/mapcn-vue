<script setup lang="ts">
import { Map, MapControls } from '~~/registry/map'
import { Card } from '~/components/ui/card'
import DocsLayout from '~/components/docs/DocsLayout.vue'
import DocsSection from '~/components/docs/DocsSection.vue'
import DocsCode from '~/components/docs/DocsCode.vue'
import CodeBlock from '~/components/docs/CodeBlock.vue'
import DocsNote from '~/components/docs/DocsNote.vue'
import PackageManagerTabs from '~/components/docs/PackageManagerTabs.vue'

definePageMeta({ layout: 'docs' })
useSeoMeta({ title: 'Installation - mapcn-vue' })

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl

const installCommands = {
  npm: `npx shadcn-vue@latest add ${siteUrl}/maps/map.json`,
  yarn: `npx shadcn-vue@latest add ${siteUrl}/maps/map.json`,
  pnpm: `pnpm dlx shadcn-vue@latest add ${siteUrl}/maps/map.json`,
  bun: `bunx --bun shadcn-vue@latest add ${siteUrl}/maps/map.json`,
}

const usageCode = `<script setup lang="ts">
import { Map, MapControls } from "@/components/ui/map"
<\/script>

<template>
  <Card class="h-[300px] p-0 overflow-hidden">
    <Map :center="[-74.006, 40.7128]" :zoom="11">
      <MapControls />
    </Map>
  </Card>
</template>`
</script>

<template>
  <DocsLayout
    title="Installation"
    description="How to install and set up mapcn-vue in your project."
    :prev="{ title: 'Introduction', href: '/docs' }"
    :next="{ title: 'API Reference', href: '/docs/api-reference' }"
    :toc="[
      { title: 'Prerequisites', slug: 'prerequisites' },
      { title: 'Installation', slug: 'installation' },
      { title: 'Usage', slug: 'usage' },
    ]"
  >
    <DocsSection title="Prerequisites">
      <p>
        A project with
        <DocsLink href="https://tailwindcss.com" external>Tailwind CSS</DocsLink>
        and
        <DocsLink href="https://www.shadcn-vue.com" external>shadcn-vue</DocsLink>
        set up.
      </p>
    </DocsSection>

    <DocsSection title="Installation">
      <p>Run the following command to add the map component:</p>
      <PackageManagerTabs :commands="installCommands" class="mt-4" />
      <p class="mt-4">
        This will install <DocsCode>maplibre-gl</DocsCode> and add the map
        component to your project.
      </p>
    </DocsSection>

    <DocsSection title="Usage">
      <p>Import and use the map component:</p>
      <CodeBlock :code="usageCode" />
      <Card class="h-[300px] p-0 overflow-hidden rounded-lg mt-4">
        <ClientOnly>
          <Map :center="[-74.006, 40.7128]" :zoom="11" class="h-full">
            <MapControls />
          </Map>
        </ClientOnly>
      </Card>
    </DocsSection>

    <DocsNote>
      <strong>Note:</strong> The map uses free CARTO basemap tiles by default.
      No API key required. Tiles automatically switch between light and dark
      themes.
    </DocsNote>
  </DocsLayout>
</template>
