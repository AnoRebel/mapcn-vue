<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
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
const isMounted = ref(false);

async function highlight() {
  if (!isMounted.value || !props.code) {
    highlighted.value = "";
    return;
  }
  try {
    highlighted.value = await highlightCode(props.code, props.language);
  } catch {
    // Fallback: show raw code in a <pre> block if shiki fails
    const escaped = props.code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    highlighted.value = `<pre><code>${escaped}</code></pre>`;
  }
}

onMounted(() => {
  isMounted.value = true;
  highlight();
});

// Re-highlight when code changes (e.g. fetched source code arriving late)
watch(
  () => props.code,
  () => {
    if (isMounted.value) highlight();
  },
);
</script>

<template>
  <div class="w-full rounded-lg border overflow-hidden">
    <div
      v-if="showCopyButton"
      class="flex items-center justify-end border-b bg-muted/30 px-2 h-8"
    >
      <CopyButton :text="code" />
    </div>
    <div class="overflow-x-auto w-full">
      <div
        v-if="highlighted"
        class="p-3 text-[13px] leading-relaxed bg-muted/20 min-w-full [&_pre]:bg-transparent! [&_code]:bg-transparent! [&_pre]:m-0! [&_pre]:p-0! [&_pre]:overflow-x-auto!"
        v-html="highlighted"
      />
      <div v-else-if="code" class="p-3 text-[13px] leading-relaxed bg-muted/20">
        <pre
          class="bg-transparent! m-0! p-0! overflow-x-auto"
        ><code class="bg-transparent!">{{ code }}</code></pre>
      </div>
      <div v-else class="p-3 text-sm text-muted-foreground italic">
        No code available
      </div>
    </div>
  </div>
</template>
