<script setup lang="ts">
import { MapPin, Heart } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <header :class="cn('w-full h-16', props.class)">
    <nav class="flex size-full items-center justify-between container">
      <div class="flex items-center gap-4">
        <slot name="left" />
        <NuxtLink
          to="/"
          class="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <MapPin class="size-4" />
          <span class="font-semibold tracking-tight">mapcn-vue</span>
        </NuxtLink>
      </div>
      <div class="flex items-center gap-2 h-4.5">
        <CommandSearch />
        <Separator orientation="vertical" class="hidden md:block" />
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="sm" as-child>
              <a
                href="https://github.com/sponsors/AnoRebel"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Heart class="size-4 text-pink-500" />
                <span class="hidden md:inline font-normal">Sponsor</span>
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sponsor this project</p>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" />
        <GitHubButton />
        <Separator orientation="vertical" />
        <ThemeToggle />
      </div>
    </nav>
  </header>
</template>
