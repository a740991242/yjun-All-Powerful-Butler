<script lang="ts" setup>
import type { EchartsUIType, ECOption } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
const props = defineProps<{ options: ECOption }>();
const chart = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chart);
onMounted(() => renderEcharts(props.options));
watch(
  () => props.options,
  (value) => renderEcharts(value),
  { deep: true },
);
</script>
<template><EchartsUI ref="chart" class="h-80 w-full" /></template>
