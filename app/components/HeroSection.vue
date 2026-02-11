<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check, ArrowRight } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl

const installCommand = `npx shadcn-vue@latest add ${siteUrl}/maps/map.json`

const copied = ref(false)

function copy() {
  navigator.clipboard.writeText(installCommand)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="relative">
    <div class="absolute inset-x-0 -inset-y-32 -z-10 overflow-hidden">
      <div
        class="absolute inset-0 opacity-[0.3] dark:opacity-[0.15]"
        style="{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }"
      />
      <div class="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
    </div>

    <div class="container flex flex-col items-center text-center">
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight animate-fade-up delay-100">
        <span class="bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
          Beautiful maps, made simple.
        </span>
      </h1>

      <p class="mt-6 text-foreground/80 text-lg md:text-xl leading-relaxed animate-fade-up delay-200 max-w-lg">
        Ready to use, customizable map components for Vue/Nuxt.
        <br class="hidden sm:block" >
        Built on MapLibre. Styled with Tailwind.
      </p>

      <div class="mt-8 animate-fade-up delay-300 w-full max-w-xl">
        <div class="bg-card border border-border rounded-lg shadow-xs overflow-hidden">
          <div class="flex items-center gap-1.5 px-3 py-2 border-b border-border/50">
            <span class="size-2 rounded-full bg-foreground/20" />
            <span class="size-2 rounded-full bg-foreground/20" />
            <span class="size-2 rounded-full bg-foreground/20" />
          </div>

          <div class="flex items-center gap-3 px-4 py-3 font-mono text-sm">
            <span class="text-emerald-500 shrink-0">$</span>
            <code class="text-foreground/80 truncate flex-1 text-left">
              {{ installCommand }}
            </code>
            <button class="text-muted-foreground hover:text-foreground transition-colors" @click="copy">
              <Check v-if="copied" class="size-4 text-emerald-500" />
              <Copy v-else class="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap justify-center items-center gap-3 animate-fade-up delay-400">
        <Button size="lg" as-child>
          <NuxtLink to="/docs">
            Get Started
            <ArrowRight class="size-4" />
          </NuxtLink>
        </Button>
        <Button variant="ghost" size="lg" as-child>
          <NuxtLink to="/docs/basic-map">View Components</NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template>
