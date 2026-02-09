<template>
  <footer class="w-full py-6 border-t">
    <div class="w-full container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div class="flex items-center gap-2">
        <span class="font-medium text-foreground">mapcn-vue</span>
        <span class="text-muted-foreground/80">•</span>
        <span>
          Built by
          <a
            href="https://github.com/AnoRebel"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-foreground underline underline-offset-4"
          >
            AnoRebel
          </a>
        </span>
      </div>
      <div class="flex items-center gap-5">
        <NuxtLink
          to="/docs"
          class="hover:text-foreground transition-colors"
        >
          Documentation
        </NuxtLink>
        <a
          href="https://github.com/AnoRebel/mapcn-vue"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-foreground transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  </footer>
</template>
