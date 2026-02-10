<script setup lang="ts">
import { Zap, Moon, Puzzle, Code, Box, Layers } from 'lucide-vue-next'
import DocsLayout from '~/components/docs/DocsLayout.vue'
import DocsSection from '~/components/docs/DocsSection.vue'
import DocsLink from '~/components/docs/DocsLink.vue'

definePageMeta({ layout: 'docs' })

useSeoMeta({
  title: 'Introduction',
  description: 'Beautiful, accessible map components for Vue/Nuxt. Built on MapLibre GL, styled with Tailwind CSS, designed for shadcn-vue.',
})

const features = [
  { icon: Zap, title: 'Zero Config', description: 'Works out of the box with free map tiles. No API keys needed.' },
  { icon: Moon, title: 'Theme Aware', description: 'Automatically switches between light and dark map styles.' },
  { icon: Puzzle, title: 'Composable', description: 'Build complex UIs with simple, composable components.' },
  { icon: Code, title: 'TypeScript', description: 'Full type safety with comprehensive TypeScript support.' },
  { icon: Box, title: 'Copy & Paste', description: 'Own your code. No dependencies, just copy into your project.' },
  { icon: Layers, title: 'Any Map Style', description: 'Use any MapLibre-compatible tiles: MapTiler, Carto, OpenStreetMap, and more.' },
]
</script>

<template>
  <DocsLayout
    title="Introduction"
    description="Beautiful, accessible map components."
    :next="{ title: 'Installation', href: '/docs/installation' }"
    :toc="[
      { title: 'Why mapcn?', slug: 'why-mapcn' },
      { title: 'Why MapLibre Directly?', slug: 'why-maplibre-directly' },
      { title: 'Any Map Style', slug: 'any-map-style' },
      { title: 'Features', slug: 'features' },
      { title: 'Credits', slug: 'credits' },
    ]"
  >
    <DocsSection>
      <p>
        <strong class="text-foreground">mapcn-vue</strong> provides
        beautifully designed, accessible, and customizable map components.
        Built on
        <DocsLink href="https://maplibre.org" external>MapLibre GL</DocsLink>,
        styled with
        <DocsLink href="https://tailwindcss.com" external>Tailwind CSS</DocsLink>,
        and designed to work with
        <DocsLink href="https://www.shadcn-vue.com" external>shadcn-vue</DocsLink>.
      </p>
    </DocsSection>

    <DocsSection title="Why mapcn-vue?">
      <p>
        There's no proper copy-paste, easy-to-use map integration for Vue/Nuxt.
        Most solutions require complex configurations, API keys, or
        heavy wrapper libraries. mapcn-vue solves this:
      </p>
      <ul>
        <li>
          <strong class="text-foreground">One Command:</strong> Run the
          install, get a working map. No config files, no API keys, no setup.
        </li>
        <li>
          <strong class="text-foreground">Own Your Code:</strong> Copy the
          components into your project. Modify anything.
        </li>
        <li>
          <strong class="text-foreground">No Wrapper Overhead:</strong>
          Built directly on MapLibre. Drop to the raw API whenever you need.
        </li>
        <li>
          <strong class="text-foreground">Looks Good Already:</strong>
          Thoughtful defaults with dark mode. Style with Tailwind as needed.
        </li>
        <li>
          <strong class="text-foreground">Works Anywhere:</strong> Bring
          your own tiles — MapTiler, Carto, OSM, or any MapLibre-compatible
          source.
        </li>
      </ul>
    </DocsSection>

    <DocsSection title="Why MapLibre Directly?">
      <p>
        mapcn-vue uses
        <DocsLink href="https://maplibre.org" external>MapLibre</DocsLink>
        directly instead of wrapper libraries. This keeps components close to
        the underlying API — when you copy a mapcn-vue component, you fully
        own the map instance without extra framework dependencies.
      </p>
      <p>
        UI elements like markers, popups, and tooltips are rendered via Vue/Nuxt
        portals, giving you complete styling freedom. You can drop down to raw
        MapLibre APIs anytime without "escaping" a wrapper.
      </p>
    </DocsSection>

    <DocsSection title="Any Map Style">
      <p>
        mapcn-vue works with any
        <DocsLink href="https://maplibre.org/maplibre-style-spec/" external>
          MapLibre-compatible tiles
        </DocsLink>. This means you can use tiles from virtually any provider:
      </p>
      <ul>
        <li>
          <DocsLink href="https://www.maptiler.com" external>MapTiler</DocsLink>
          - Beautiful vector tiles with extensive customization options
        </li>
        <li>
          <DocsLink href="https://carto.com/basemaps" external>Carto</DocsLink>
          - Clean, minimal basemaps perfect for data visualization
        </li>
        <li>
          <DocsLink href="https://www.openstreetmap.org" external>OpenStreetMap</DocsLink>
          - Community-driven, open-source map data
        </li>
        <li>
          <DocsLink href="https://stadiamaps.com" external>Stadia Maps</DocsLink>
          - Fast, reliable tile hosting with multiple styles
        </li>
        <li>
          <DocsLink href="https://www.thunderforest.com" external>Thunderforest</DocsLink>
          - Specialized maps for outdoors, cycling, and transport
        </li>
        <li>And any other provider that supports the MapLibre style spec</li>
      </ul>
    </DocsSection>

    <DocsSection title="Features">
      <div class="grid gap-4 sm:grid-cols-2 mt-4 not-prose">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="rounded-lg border bg-card p-4 space-y-2"
        >
          <div class="flex items-center gap-2">
            <div class="flex size-8 items-center justify-center rounded-md bg-primary/10">
              <component :is="feature.icon" class="size-4 text-primary" />
            </div>
            <h3 class="font-medium text-foreground">{{ feature.title }}</h3>
          </div>
          <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
        </div>
      </div>
    </DocsSection>

    <DocsSection title="Credits">
      <p>
        <strong class="text-foreground">mapcn-vue</strong> is the official Vue/Nuxt port of
        <DocsLink href="https://github.com/AnmolSaini16/mapcn" external>mapcn</DocsLink>,
        originally built by
        <DocsLink href="https://github.com/AnmolSaini16" external>Anmoldeep Singh</DocsLink>
        for React/Next.js. Vue/Nuxt port by
        <DocsLink href="https://github.com/AnoRebel" external>AnoRebel</DocsLink>.
      </p>
    </DocsSection>
  </DocsLayout>
</template>
