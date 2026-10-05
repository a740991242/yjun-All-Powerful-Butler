<script setup lang="ts">
import type { BnuPatternDesignVisual } from './bnu-pattern-design';

import { computed } from 'vue';

import { $t } from '#/locales';

import {
  bnuPatternDesignCards,
  bnuPatternDesignDots,
} from './bnu-pattern-design';
const props = defineProps<{ visual: BnuPatternDesignVisual }>();
const cards = computed(() => bnuPatternDesignCards(props.visual));
const dots = computed(() => bnuPatternDesignDots(props.visual));
</script>
<template>
  <figure
    data-bnu-pattern-design
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t('educationLearning.patternDesignTitle') }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{
        $t(
          visual.scene === 'dot-grid'
            ? 'educationLearning.patternDesignDots'
            : 'educationLearning.patternDesignCompare',
        )
      }}
    </p>
    <div v-if="cards.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div
        v-for="card in cards"
        :key="card.label"
        :data-design-card="card.label"
        class="flex flex-col items-center rounded-lg border border-border p-3"
      >
        <p class="mb-2 text-xl font-semibold leading-8">{{ card.label }}</p>
        <svg
          width="144"
          height="144"
          viewBox="0 0 144 144"
          class="block max-w-none text-foreground"
          role="img"
          :aria-label="
            $t('educationLearning.patternDesignCard', {
              label: card.label,
              points: card.points
                .map((p) => `(${p[0].toFixed(2)}, ${p[1].toFixed(2)})`)
                .join(' → '),
            })
          "
        >
          <polygon
            :points="card.points.map((p) => p.join(',')).join(' ')"
            fill="hsl(var(--primary) / 0.12)"
            stroke="currentColor"
            stroke-width="2.5"
          />
          <polyline
            v-if="card.seam.length"
            :points="card.seam.map((p) => p.join(',')).join(' ')"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-dasharray="4 3"
          />
        </svg>
      </div>
    </div>
    <svg
      v-else
      width="192"
      height="192"
      viewBox="0 0 192 192"
      class="mx-auto block max-w-none text-foreground"
      role="img"
      :aria-label="$t('educationLearning.patternDesignGridAria')"
    >
      <circle
        v-for="(point, i) in dots"
        :key="i"
        :cx="point[0]"
        :cy="point[1]"
        r="2.5"
        fill="currentColor"
      />
    </svg>
    <p class="mb-0 mt-3 text-xl leading-8 text-muted-foreground">
      {{ $t('educationLearning.patternDesignNotice') }}
    </p>
  </figure>
</template>
