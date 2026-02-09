<script setup lang="ts">
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const props = defineProps<{
  title?: string
}>()

const id = computed(() => props.title ? slugify(props.title) : undefined)
</script>

<template>
  <section class="space-y-5 scroll-mt-24" :id="id">
    <h2 v-if="title" class="text-xl font-semibold tracking-tight text-foreground">
      {{ title }}
    </h2>
    <div class="text-foreground/80 text-[15px] leading-7 space-y-4 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:leading-7 [&_strong]:text-foreground [&_strong]:font-medium [&_em]:text-muted-foreground">
      <slot />
    </div>
  </section>
</template>
