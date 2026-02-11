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
  <div class="my-6 w-full">
    <div class="rounded-lg border overflow-hidden overflow-x-auto">
      <Table class="w-full min-w-[600px]">
        <TableHeader>
          <TableRow class="hover:bg-transparent bg-muted/30">
            <TableHead
              class="h-10 px-4 text-xs font-medium whitespace-nowrap w-[120px]"
              >Prop</TableHead
            >
            <TableHead
              class="h-10 px-4 text-xs font-medium whitespace-nowrap w-[180px]"
              >Type</TableHead
            >
            <TableHead
              class="h-10 px-4 text-xs font-medium whitespace-nowrap w-[100px]"
              >Default</TableHead
            >
            <TableHead class="h-10 px-4 text-xs font-medium min-w-[200px]"
              >Description</TableHead
            >
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="prop in props.props" :key="prop.name">
            <TableCell class="px-4 py-3 align-top whitespace-nowrap">
              <DocsCode class="text-[13px]">{{ prop.name }}</DocsCode>
            </TableCell>
            <TableCell class="px-4 py-3 align-top">
              <DocsCode class="text-xs text-muted-foreground break-all">{{
                prop.type
              }}</DocsCode>
            </TableCell>
            <TableCell class="px-4 py-3 align-top whitespace-nowrap">
              <DocsCode class="text-xs text-muted-foreground">
                {{ prop.default ?? "—" }}
              </DocsCode>
            </TableCell>
            <TableCell
              class="px-4 py-3 text-sm text-foreground/70 min-w-[200px] leading-relaxed"
            >
              {{ prop.description }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
