<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import CodeBlock from './CodeBlock.vue'
import CopyButton from './CopyButton.vue'

defineProps<{
  code: string
  language?: string
  title?: string
  height?: string
}>()

const activeTab = ref('preview')
</script>

<template>
  <div class="rounded-lg border bg-card overflow-hidden">
    <Tabs v-model="activeTab">
      <!-- Header with tabs -->
      <div class="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <TabsList class="h-8 bg-transparent p-0 gap-1">
          <TabsTrigger 
            value="preview" 
            class="h-7 px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Preview
          </TabsTrigger>
          <TabsTrigger 
            value="code" 
            class="h-7 px-3 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Code
          </TabsTrigger>
        </TabsList>
        
        <CopyButton :text="code" />
      </div>

      <!-- Preview Content -->
      <TabsContent value="preview" class="mt-0">
        <div :class="height || 'h-[400px]'" class="relative bg-background">
          <ClientOnly>
            <slot />
            <template #fallback>
              <div class="h-full w-full flex items-center justify-center bg-muted/20">
                <div class="flex gap-1">
                  <span class="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
                  <span class="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:150ms]" />
                  <span class="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </TabsContent>
      
      <!-- Code Content -->
      <TabsContent value="code" class="mt-0">
        <div :class="height || 'h-[400px]'" class="overflow-auto bg-background">
          <CodeBlock 
            :code="code" 
            :language="language || 'vue'" 
            :show-copy-button="false"
            class="rounded-none border-0"
          />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
