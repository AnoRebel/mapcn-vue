<script setup lang="ts">
import { TooltipProvider } from '~/components/ui/tooltip'
</script>

<template>
  <TooltipProvider>
    <div class="font-sans antialiased min-h-screen flex flex-col">
      <div class="flex-1">
        <slot />
      </div>
      <AppFooter />
    </div>
  </TooltipProvider>
</template>
