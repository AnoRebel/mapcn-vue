<script setup lang="ts">
const props = defineProps<{
  href: string
  external?: boolean
}>()
</script>

<template>
  <NuxtLink
    :to="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
  >
    <slot />
  </NuxtLink>
</template>
