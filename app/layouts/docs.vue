<script setup lang="ts">
import { SidebarProvider } from '~/components/ui/sidebar'
import { TooltipProvider } from '~/components/ui/tooltip'
</script>

<template>
  <TooltipProvider>
    <SidebarProvider>
      <div class="flex min-h-screen flex-col">
        <AppHeader
          class="sticky top-0 z-50 bg-background/95 border-b backdrop-blur supports-backdrop-filter:bg-background/60"
        >
          <template #left>
            <MobileSidebarTrigger />
          </template>
        </AppHeader>
        <div class="flex flex-1">
          <DocsSidebar />
          <main class="flex-1 min-w-0">
            <slot />
          </main>
        </div>
      </div>
    </SidebarProvider>
  </TooltipProvider>
</template>
