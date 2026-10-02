<script setup lang="ts">
import type { TriangleMoveVisual } from './types';

import { $t } from '#/locales';

import TriangleMosaic from './TriangleMosaic.vue';
defineProps<{ visual: TriangleMoveVisual }>();
</script>
<template>
  <div class="grid min-w-0 gap-4 md:grid-cols-2">
    <section
      v-for="frame in ['before', 'after'] as const"
      :key="frame"
      class="min-w-0"
    >
      <h3 class="mb-3 font-medium">
        {{ $t(`educationLearning.triangleMove_${frame}`) }}
      </h3>
      <TriangleMosaic :visual="visual[frame]" />
    </section>
  </div>
</template>
