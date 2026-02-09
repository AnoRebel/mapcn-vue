<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

useSeoMeta({
  title: 'Page Not Found',
  description: 'The page you\'re looking for doesn\'t exist or has been moved.',
})
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div class="text-center space-y-6 max-w-md">
        <div class="flex justify-center">
          <div class="relative">
            <MapPin
              class="size-16 text-muted-foreground/30"
              stroke-width="1"
            />
            <span class="absolute -top-1 -right-1 text-4xl">?</span>
          </div>
        </div>

        <div class="space-y-2">
          <h1 class="text-4xl font-semibold tracking-tight">
            Lost on the map
          </h1>
          <p class="text-muted-foreground text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div class="flex gap-3 justify-center">
          <Button as-child>
            <NuxtLink to="/">Go home</NuxtLink>
          </Button>
          <Button variant="outline" as-child>
            <NuxtLink to="/docs">Read docs</NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
