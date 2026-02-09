<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { cn } from '@/lib/utils'

interface TocItem {
  title: string
  slug: string
}

const props = defineProps<{
  items: TocItem[]
  class?: string
}>()

const activeId = ref<string | null>(null)

// Use VueUse's useIntersectionObserver for better performance
useIntersectionObserver(
  () => props.items.map(item => document.getElementById(item.slug)).filter(Boolean) as HTMLElement[],
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    }
  },
  { 
    rootMargin: '0% 0% -80% 0%',
    threshold: 0,
  }
)
</script>

<template>
  <div :class="cn('flex flex-col gap-1', props.class)">
    <p class="text-foreground text-xs font-medium mb-2">On This Page</p>
    <div class="relative">
      <div class="absolute left-0 top-1 bottom-1 w-px bg-border" />
      <div class="flex flex-col gap-1">
        <a
          v-for="item in items"
          :key="item.slug"
          :href="`#${item.slug}`"
          :class="cn(
            'relative pl-3 py-1 text-[13px] no-underline transition-colors',
            activeId === item.slug
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )"
        >
          <div
            v-if="activeId === item.slug"
            class="absolute left-0 top-1 bottom-1 w-px bg-foreground rounded-full"
          />
          {{ item.title }}
        </a>
      </div>
    </div>
  </div>
</template>
