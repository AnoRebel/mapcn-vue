<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'mapcn-vue - Beautiful maps made simple',
  description: 'Ready to use, customizable map components for Vue. Built on MapLibre. Styled with Tailwind.',
  ogTitle: 'mapcn-vue - Beautiful maps made simple',
  ogDescription: 'Ready to use, customizable map components for Vue.',
  ogImage: '/banner.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="flex flex-col pb-32">
    <AppHeader class="border-b border-transparent" />
    <main class="flex-1">
      <section class="relative w-full py-24">
        <HeroSection />
      </section>
      <section class="container">
        <ExamplesGrid />
      </section>
    </main>
  </div>
</template>
