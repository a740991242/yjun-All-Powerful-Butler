<script lang="ts" setup>
import type { BnuFinalColorVisual } from './bnu-final-color';

import { computed } from 'vue';

import { $t } from '#/locales';

import { bnuFinalColorCards } from './bnu-final-color';
const props = defineProps<{ visual: BnuFinalColorVisual }>();
const cards = computed(() => bnuFinalColorCards(props.visual.variant));
</script>

<template>
  <figure class="space-y-3" data-bnu-final-color>
    <figcaption class="text-xl font-medium">
      {{ $t('educationLearning.finalColorTitle') }}
    </figcaption>
    <ol class="grid grid-cols-2 gap-3 lg:grid-cols-3">
      <li
        v-for="card in cards"
        :key="card.id"
        :data-region="card.id"
        class="flex min-h-20 flex-col justify-center rounded-lg border border-border p-3"
        :aria-label="
          $t('educationLearning.finalColorCard', {
            position: card.position,
            expression: card.expression,
          })
        "
      >
        <span class="text-base text-muted-foreground">
          {{
            $t('educationLearning.finalColorRegion', {
              position: card.position,
            })
          }}
        </span>
        <span class="text-2xl font-semibold">{{ card.expression }}</span>
      </li>
    </ol>
    <p class="text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.finalColorNotice') }}
    </p>
  </figure>
</template>
