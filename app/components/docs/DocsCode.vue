<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <code
    :class="
      cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
        props.class,
      )
    "
  >
    <slot />
  </code>
</template>
