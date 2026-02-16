<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import CodeBlock from "./CodeBlock.vue";
import CopyButton from "./CopyButton.vue";
import { Eye, Code2, PanelTopClose, PanelTopOpen } from "lucide-vue-next";

const props = defineProps<{
  code?: string;
  sourceFile?: string;
  language?: string;
  title?: string;
  height?: string;
}>();

const activeTab = ref("preview");
const fetchedCode = ref("");
const controlsVisible = ref(true);

// If a sourceFile is provided, fetch the actual source code
if (props.sourceFile) {
  onMounted(async () => {
    try {
      const data = await $fetch<string>(`/api/example-source`, {
        params: { filename: props.sourceFile },
      });
      fetchedCode.value = data;
    } catch {
      fetchedCode.value = `// Failed to load source: ${props.sourceFile}`;
    }
  });
}

const displayCode = computed(() => fetchedCode.value || props.code || "");
</script>

<template>
  <div
    class="group/preview rounded-lg border bg-card overflow-hidden shadow-sm"
  >
    <Tabs v-model="activeTab">
      <!-- Tab bar -->
      <div
        class="flex items-center justify-between border-b bg-muted/40 px-2 h-9"
      >
        <TabsList class="h-7 bg-transparent p-0 gap-0.5">
          <TabsTrigger
            value="preview"
            class="h-6 gap-1 px-2.5 text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Eye class="w-3 h-3" />
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            class="h-6 gap-1 px-2.5 text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <Code2 class="w-3 h-3" />
            Code
          </TabsTrigger>
        </TabsList>

        <div class="flex items-center gap-0.5">
          <button
            class="inline-flex items-center justify-center h-6 w-6 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
            :title="controlsVisible ? 'Collapse controls' : 'Expand controls'"
            @click="controlsVisible = !controlsVisible"
          >
            <PanelTopClose v-if="controlsVisible" class="w-3.5 h-3.5" />
            <PanelTopOpen v-else class="w-3.5 h-3.5" />
          </button>
          <CopyButton :text="displayCode" />
        </div>
      </div>

      <!-- Preview Content -->
      <TabsContent value="preview" class="mt-0" force-mount>
        <div
          v-show="activeTab === 'preview'"
          :class="height || 'h-[400px]'"
          class="relative bg-background overflow-hidden"
        >
          <ClientOnly>
            <div
              class="h-full transition-all duration-200"
              :class="
                controlsVisible
                  ? ''
                  : '[&>div>div:first-child]:!hidden [&>div>.grid:first-child]:!hidden [&>div>.flex.flex-col>*:first-child:not(:last-child)]:!hidden [&>div>.space-y-3>*:first-child]:!hidden [&>div>.space-y-4>*:first-child]:!hidden'
              "
            >
              <slot />
            </div>
            <template #fallback>
              <div
                class="h-full w-full flex items-center justify-center bg-muted/10"
              >
                <div class="flex items-center gap-1.5">
                  <span
                    class="size-1.5 rounded-full bg-muted-foreground/50 animate-pulse"
                  />
                  <span
                    class="size-1.5 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:150ms]"
                  />
                  <span
                    class="size-1.5 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:300ms]"
                  />
                </div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </TabsContent>

      <!-- Code Content -->
      <TabsContent value="code" class="mt-0">
        <div :class="height || 'h-[400px]'" class="overflow-auto bg-muted/10">
          <CodeBlock
            :code="displayCode"
            :language="language || 'vue'"
            :show-copy-button="false"
            class="rounded-none border-0 [&>div:first-child]:hidden"
          />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
