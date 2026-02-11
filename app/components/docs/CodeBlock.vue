<script setup lang="ts">
import { ref, onMounted } from "vue";
import { highlightCode } from "~~/lib/highlight";
import CopyButton from "./CopyButton.vue";

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
    showCopyButton?: boolean;
  }>(),
  {
    language: "vue",
    showCopyButton: true,
  },
);

const highlighted = ref("");

onMounted(async () => {
  highlighted.value = await highlightCode(props.code, props.language);
});
</script>

<template>
  <div class="w-full rounded-lg border overflow-hidden">
    <div
      v-if="showCopyButton"
      class="flex items-center justify-end border-b bg-muted/30 px-2 h-9"
    >
      <CopyButton :text="code" />
    </div>
    <div class="overflow-x-auto w-full">
      <div
        class="p-4 text-sm bg-muted/20 min-w-full [&_pre]:bg-transparent! [&_code]:bg-transparent! [&_pre]:m-0! [&_pre]:p-0! [&_pre]:overflow-x-auto!"
        v-html="highlighted"
      />
    </div>
  </div>
</template>
