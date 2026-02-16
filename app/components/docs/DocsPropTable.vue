<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
}

const props = defineProps<{
  props: PropDef[];
}>();
</script>

<template>
  <div class="my-4 w-full">
    <details class="group rounded-lg border overflow-hidden">
      <summary
        class="flex items-center justify-between cursor-pointer px-4 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors select-none"
      >
        <span class="text-xs font-medium text-muted-foreground">
          {{ props.props.length }}
          {{ props.props.length === 1 ? "prop" : "props" }}
        </span>
        <svg
          class="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div class="overflow-x-auto">
        <Table class="w-full min-w-[600px]">
          <TableHeader>
            <TableRow class="hover:bg-transparent bg-muted/20">
              <TableHead
                class="h-8 px-3 text-xs font-medium whitespace-nowrap w-[120px]"
                >Prop</TableHead
              >
              <TableHead
                class="h-8 px-3 text-xs font-medium whitespace-nowrap w-[160px]"
                >Type</TableHead
              >
              <TableHead
                class="h-8 px-3 text-xs font-medium whitespace-nowrap w-[80px]"
                >Default</TableHead
              >
              <TableHead class="h-8 px-3 text-xs font-medium min-w-[180px]"
                >Description</TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="prop in props.props" :key="prop.name">
              <TableCell class="px-3 py-2 align-top whitespace-nowrap">
                <DocsCode class="text-[12px]">{{ prop.name }}</DocsCode>
              </TableCell>
              <TableCell class="px-3 py-2 align-top">
                <DocsCode class="text-[11px] text-muted-foreground break-all">{{
                  prop.type
                }}</DocsCode>
              </TableCell>
              <TableCell class="px-3 py-2 align-top whitespace-nowrap">
                <DocsCode class="text-[11px] text-muted-foreground">
                  {{ prop.default ?? "—" }}
                </DocsCode>
              </TableCell>
              <TableCell
                class="px-3 py-2 text-[13px] text-foreground/70 min-w-[180px] leading-relaxed"
              >
                {{ prop.description }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </details>
  </div>
</template>
