<script setup lang="ts">
interface TocItem {
  title: string;
  slug: string;
}

interface NavLink {
  title: string;
  href: string;
}

defineProps<{
  title: string;
  description: string;
  prev?: NavLink;
  next?: NavLink;
  toc?: TocItem[];
}>();
</script>

<template>
  <div class="flex flex-1">
    <!-- Main Content -->
    <main class="flex-1 min-w-0">
      <div class="px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12">
        <div class="max-w-4xl xl:max-w-5xl mx-auto w-full min-w-0">
          <!-- Header -->
          <div class="space-y-3 mb-8">
            <h1
              class="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground"
            >
              {{ title }}
            </h1>
            <p
              class="text-sm sm:text-base text-muted-foreground leading-relaxed"
            >
              {{ description }}
            </p>
          </div>

          <!-- Content -->
          <div class="space-y-10 w-full min-w-0">
            <slot />
          </div>

          <!-- Prev/Next Navigation -->
          <div
            v-if="prev || next"
            class="flex items-center justify-between gap-4 mt-12 pt-8 border-t"
          >
            <NuxtLink
              v-if="prev"
              :to="prev.href"
              class="group flex flex-col items-start gap-1.5 p-4 -m-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span class="text-xs text-muted-foreground">Previous</span>
              <span
                class="text-sm font-medium group-hover:underline underline-offset-4"
              >
                {{ prev.title }}
              </span>
            </NuxtLink>
            <div v-else class="hidden sm:block" />

            <NuxtLink
              v-if="next"
              :to="next.href"
              class="group flex flex-col items-end gap-1.5 p-4 -m-4 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span class="text-xs text-muted-foreground">Next</span>
              <span
                class="text-sm font-medium group-hover:underline underline-offset-4"
              >
                {{ next.title }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <!-- Table of Contents - Desktop -->
    <aside v-if="toc?.length" class="hidden xl:block w-64 shrink-0 border-l">
      <nav class="sticky top-28 p-6">
        <DocsToc :items="toc" />
      </nav>
    </aside>
  </div>
</template>
