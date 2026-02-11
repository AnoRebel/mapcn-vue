<script setup lang="ts">
import { ref, computed } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface PackageManager {
  name: string
  label: string
  command: string
}

const props = defineProps<{
  commands: {
    npm?: string
    yarn?: string
    pnpm?: string
    bun?: string
  }
  class?: string
}>()

const activeTab = ref('npm')
const copied = ref(false)

const packageManagers: PackageManager[] = [
  { name: 'npm', label: 'npm', command: props.commands.npm || '' },
  { name: 'yarn', label: 'yarn', command: props.commands.yarn || '' },
  { name: 'pnpm', label: 'pnpm', command: props.commands.pnpm || '' },
  { name: 'bun', label: 'bun', command: props.commands.bun || '' },
].filter(pm => pm.command)

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const activeCommand = computed(() => {
  const pm = packageManagers.find(p => p.name === activeTab.value)
  return pm?.command || ''
})
</script>

<template>
  <div :class="cn('rounded-lg border bg-muted/50', props.class)">
    <!-- Tabs -->
    <div class="flex border-b border-border/50">
      <button
        v-for="pm in packageManagers"
        :key="pm.name"
        :class="cn(
          'px-4 py-2 text-sm font-medium transition-colors relative',
          activeTab === pm.name
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )"
        @click="activeTab = pm.name"
      >
        {{ pm.label }}
        <span
          v-if="activeTab === pm.name"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        />
      </button>
    </div>
    
    <!-- Code block -->
    <div class="relative group">
      <pre class="p-4 text-sm font-mono overflow-x-auto"><code>{{ activeCommand }}</code></pre>
      <button
        class="absolute top-2 right-2 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background border border-border"
        :class="{ 'opacity-100': copied }"
        aria-label="Copy to clipboard"
        @click="copyToClipboard(activeCommand)"
      >
        <Check v-if="copied" class="size-4 text-green-500" />
        <Copy v-else class="size-4" />
      </button>
    </div>
  </div>
</template>
