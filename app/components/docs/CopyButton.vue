<script setup lang="ts">
import { ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<{
  text: string
  class?: string
}>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <button
    @click="copy"
    :class="cn('p-1.5 rounded hover:bg-muted transition-colors', props.class)"
    aria-label="Copy code"
  >
    <Check v-if="copied" class="size-3.5 text-emerald-500" />
    <Copy v-else class="size-3.5 text-muted-foreground" />
  </button>
</template>
