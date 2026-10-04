<script lang="ts" setup>
import type { BnuAroundNumbersVisual } from './bnu-around-numbers';

import { computed } from 'vue';

import { $t } from '#/locales';

import { aroundNumberMarkers } from './bnu-around-numbers';
const props = defineProps<{ visual: BnuAroundNumbersVisual }>();
const markers = computed(() => aroundNumberMarkers(props.visual));
</script>

<template>
  <figure
    class="space-y-3"
    data-bnu-around-numbers
    :data-scene="visual.scene"
    :data-variant="visual.variant"
  >
    <figcaption class="text-xl font-medium">
      {{ $t(`educationLearning.aroundNumbersTitle_${visual.scene}`) }}
    </figcaption>
    <p class="text-xl leading-8">
      {{ $t(`educationLearning.aroundNumbersLegend_${visual.scene}`) }}
    </p>
    <div
      class="overflow-x-auto rounded-lg border border-border p-3"
      tabindex="0"
      :aria-label="$t('educationLearning.aroundNumbersScroll')"
      data-around-scroll
    >
      <svg
        :viewBox="`0 0 420 ${visual.scene === 'circles' ? 280 : 155}`"
        class="w-full min-w-[420px] text-primary"
        role="img"
        :aria-label="$t(`educationLearning.aroundNumbersTitle_${visual.scene}`)"
      >
        <template v-for="marker in markers" :key="marker.index">
          <circle
            v-if="marker.shape === 'circle'"
            :cx="marker.x"
            :cy="marker.y"
            :r="marker.size"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            data-around-marker="circle"
            role="img"
            :aria-label="
              $t('educationLearning.aroundNumbersMarker_circle', {
                position: marker.index + 1,
              })
            "
          />
          <polygon
            v-else
            :points="`${marker.x},${marker.y - marker.size} ${marker.x - marker.size},${marker.y + marker.size} ${marker.x + marker.size},${marker.y + marker.size}`"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            :data-around-marker="marker.size === 18 ? 'large' : 'small'"
            role="img"
            :aria-label="
              $t(
                marker.size === 18
                  ? 'educationLearning.aroundNumbersMarker_large'
                  : 'educationLearning.aroundNumbersMarker_small',
                { position: marker.index + 1 },
              )
            "
          />
        </template>
      </svg>
    </div>
    <p class="text-xl leading-8 text-muted-foreground" data-around-hint>
      {{ $t('educationLearning.aroundNumbersScroll') }}
    </p>
    <p class="text-base leading-7 text-muted-foreground">
      {{ $t(`educationLearning.aroundNumbersNotice_${visual.variant}`) }}
    </p>
  </figure>
</template>
