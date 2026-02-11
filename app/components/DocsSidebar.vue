<script setup lang="ts">
import { useRoute } from "#imports";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { docsNavigation } from "~/utils/docs-navigation";

const route = useRoute();
const { setOpenMobile } = useSidebar();
</script>

<template>
  <Sidebar
    class="sticky top-16 h-[calc(100svh-9.5rem)] border-none bg-transparent **:data-[sidebar=sidebar]:bg-transparent"
    :style="{ '--sidebar-width': '12rem' }"
  >
    <SidebarContent class="pt-8 no-scrollbar overflow-x-hidden">
      <SidebarGroup
        v-for="group in docsNavigation"
        :key="group.title"
        class="px-1"
      >
        <SidebarGroupLabel
          class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80"
        >
          {{ group.title }}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in group.items" :key="item.href">
              <SidebarMenuButton
                as-child
                :is-active="route.path === item.href"
                class="data-[active=true]:bg-accent data-[active=true]:border-accent 3xl:fixed:w-full 3xl:fixed:max-w-48 relative h-[30px] overflow-visible border border-transparent text-[0.8rem] text-muted-foreground font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md"
              >
                <NuxtLink :to="item.href" @click="setOpenMobile(false)">
                  <component :is="item.icon" class="size-4" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
