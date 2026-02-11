<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { cn } from "@/lib/utils";

interface TocItem {
  title: string;
  slug: string;
}

const props = defineProps<{
  items: TocItem[];
  class?: string;
}>();

const activeId = ref<string | null>(props.items[0]?.slug ?? null);

let observer: IntersectionObserver | null = null;

function setupObserver() {
  // Clean up previous observer
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (!props.items.length) return;

  // Track which sections are visible; pick the topmost one
  const visibleIds = new Set<string>();

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleIds.add(entry.target.id);
        } else {
          visibleIds.delete(entry.target.id);
        }
      }

      // Pick the first item (in TOC order) that's currently visible
      for (const item of props.items) {
        if (visibleIds.has(item.slug)) {
          activeId.value = item.slug;
          return;
        }
      }
    },
    {
      // Top 20% of viewport triggers "in view"
      rootMargin: "0px 0px -80% 0px",
      threshold: 0,
    },
  );

  // Observe all heading elements by their slug id
  for (const item of props.items) {
    const el = document.getElementById(item.slug);
    if (el) observer.observe(el);
  }
}

onMounted(() => {
  // Small delay to ensure DOM sections are rendered
  requestAnimationFrame(() => setupObserver());
});

// Re-setup if toc items change (e.g. navigating between docs pages)
watch(
  () => props.items,
  () => {
    requestAnimationFrame(() => setupObserver());
  },
  { deep: true },
);

onUnmounted(() => {
  observer?.disconnect();
});
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
          :class="
            cn(
              'relative pl-3 py-1 text-[13px] no-underline transition-colors',
              activeId === item.slug
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )
          "
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
