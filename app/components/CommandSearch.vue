<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  FileText,
  SearchIcon,
} from 'lucide-vue-next'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { Kbd } from '~/components/ui/kbd'
import { Button } from '~/components/ui/button'
import { docsNavigation } from '~/utils/docs-navigation'

const open = ref(false)
const router = useRouter()

// Keyboard shortcut: Cmd/Ctrl + K
onMounted(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      open.value = !open.value
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => document.removeEventListener('keydown', handleKeyDown))
})

function handleSelect(href: string) {
  open.value = false
  router.push(href)
}

const allNavItems = computed(() => 
  docsNavigation.flatMap(group => group.items)
)
</script>

<template>
  <Button
    variant="outline"
    size="sm"
    aria-label="Search documentation"
    class="hidden group md:flex items-center w-[180px] dark:border-border/50 border-border/70 rounded-lg text-sm font-normal text-muted-foreground"
    @click="open = true"
  >
    <SearchIcon class="size-3.5 shrink-0" />
    <span>Search docs...</span>
    <Kbd class="ml-auto">⌘K</Kbd>
  </Button>

  <CommandDialog
    v-model:open="open"
    title="Search Documentation"
    description="Search for documentation pages and components"
    :show-close-button="false"
  >
    <CommandInput
      placeholder="Search documentation..."
      class="border-none text-sm h-10"
    />
    <CommandList>
      <CommandEmpty class="py-8 text-muted-foreground text-sm">
        <div class="flex flex-col items-center gap-1.5">
          <FileText class="size-5 opacity-40" />
          <span>No results found.</span>
        </div>
      </CommandEmpty>
      <CommandGroup
        v-for="group in docsNavigation"
        :key="group.title"
        :heading="group.title"
      >
        <CommandItem
          v-for="item in group.items"
          :key="item.href"
          :value="item.title"
          @select="handleSelect(item.href)"
        >
          <component :is="item.icon" class="size-4" />
          <span>{{ item.title }}</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
    <div class="border-t p-3 text-xs text-muted-foreground/80 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <span class="flex items-center gap-1.5">
          <Kbd><ArrowDown class="size-3" /></Kbd>
          <Kbd><ArrowUp class="size-3" /></Kbd>
          <span>navigate</span>
        </span>
        <span class="flex items-center gap-1.5">
          <Kbd><CornerDownLeft class="size-3" /></Kbd>
          <span>select</span>
        </span>
      </div>
      <span class="flex items-baseline gap-1.5">
        <Kbd>esc</Kbd>
        <span>close</span>
      </span>
    </div>
  </CommandDialog>
</template>
