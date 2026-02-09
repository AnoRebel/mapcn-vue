<script setup lang="ts">
import { useColorMode } from '#imports'
import { Button } from '~/components/ui/button'
import { Kbd } from '~/components/ui/kbd'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Keyboard shortcut: 'T' key
onMounted(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target as HTMLElement)?.isContentEditable
    ) {
      return
    }

    if ((e.key === 't' || e.key === 'T') && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      toggleTheme()
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => document.removeEventListener('keydown', handleKeyDown))
})
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button
        @click="toggleTheme"
        variant="ghost"
        aria-label="Toggle theme"
        size="icon"
        class="size-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4.5"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M12 3l0 18" />
          <path d="M12 9l4.65 -4.65" />
          <path d="M12 14.3l7.37 -7.37" />
          <path d="M12 19.6l8.85 -8.85" />
        </svg>
        <span class="sr-only">Toggle theme</span>
      </Button>
    </TooltipTrigger>
    <TooltipContent class="flex items-center gap-2 pr-1">
      Toggle Theme <Kbd>T</Kbd>
    </TooltipContent>
  </Tooltip>
</template>
