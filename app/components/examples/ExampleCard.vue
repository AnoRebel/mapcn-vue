<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    label?: string;
    class?: string;
    delay?: string;
  }>(),
  {
    delay: "delay-500",
  },
);
</script>

<template>
  <div
    :class="
      cn(
        'rounded-xl overflow-hidden shadow-sm bg-card border border-border/50 relative animate-scale-in',
        props.delay,
        props.class,
      )
    "
  >
    <div
      v-if="label"
      class="uppercase absolute top-2 left-2 z-10 tracking-wider text-[10px] text-muted-foreground bg-background/90 backdrop-blur-sm rounded px-2 py-1"
    >
      {{ label }}
    </div>
    <slot />
  </div>
</template>
