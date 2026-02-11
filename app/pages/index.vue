<script setup lang="ts">
definePageMeta({ layout: "default" });

useSeoMeta({
  title: "Beautiful Maps Made Simple",
  description:
    "Ready-to-use, customizable map components for Vue/Nuxt. Built on MapLibre GL, styled with Tailwind CSS. Zero config, copy-paste into your project.",
  ogImage: "/banner.png",
});
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
