<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { cn } from '@/lib/utils'
import { highlightCode } from '~~/lib/highlight'

const props = defineProps<{
  code: string
  class?: string
}>()

const activeTab = ref<'preview' | 'code'>('preview')
const highlightedCode = ref('')

onMounted(async () => {
  highlightedCode.value = await highlightCode(props.code, 'vue')
})
</script>

<template>
  <div class="w-full rounded-lg border overflow-hidden">
    <div class="flex items-center justify-between border-b bg-muted/30 px-2 h-12">
      <div class="flex gap-2">
        <button
          @click="activeTab = 'preview'"
          :class="cn(
            'px-2 py-1 text-xs font-medium rounded transition-colors',
            activeTab === 'preview'
              ? 'text-foreground bg-muted dark:bg-muted/80'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-muted/80'
          )"
        >
          Preview
        </button>
        <button
          @click="activeTab = 'code'"
          :class="cn(
            'px-3 py-1 text-xs font-medium rounded transition-colors',
            activeTab === 'code'
              ? 'text-foreground bg-muted dark:bg-muted/80'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-muted/80'
          )"
        >
          Code
        </button>
      </div>

      <CopyButton :text="code" />
    </div>

    <div :class="cn('h-[400px] overflow-hidden', props.class)">
      <div v-if="activeTab === 'preview'" class="h-full">
        <slot />
      </div>
      <div
        v-else
        class="h-full p-4 overflow-auto text-sm bg-muted/20 [&_pre]:bg-transparent! [&_code]:bg-transparent!"
        v-html="highlightedCode"
      />
    </div>
  </div>
</template>
