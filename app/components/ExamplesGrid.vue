<script setup lang="ts">
import AnalyticsExample from './examples/AnalyticsExample.vue'
import TrailExample from './examples/TrailExample.vue'
import FlyToExample from './examples/FlyToExample.vue'
import EVChargingExample from './examples/EVChargingExample.vue'
import TrendingExample from './examples/TrendingExample.vue'
import DeliveryExample from './examples/DeliveryExample.vue'
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-fade-in delay-400">
    <AnalyticsExample />
    <TrailExample />
    <FlyToExample />
    <EVChargingExample />
    <TrendingExample />
    <DeliveryExample />
  </div>
</template>
