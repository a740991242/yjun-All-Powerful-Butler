<script lang="ts" setup>
import type { BnuFinalClassificationVisual } from './bnu-final-classification';

import { computed } from 'vue';

import { $t } from '#/locales';

import {
  bnuFinalAnimals,
  bnuFinalClassificationObjects,
} from './bnu-final-classification';
import SolidGlyph from './SolidGlyph.vue';
const props = defineProps<{ visual: BnuFinalClassificationVisual }>();
const animals = computed(() =>
  props.visual.scene === 'objects'
    ? []
    : bnuFinalAnimals(props.visual.scene, props.visual.variant),
);
const objects = computed(() =>
  bnuFinalClassificationObjects(props.visual.variant),
);
const colors = {
  red: '#dc4c55',
  orange: '#dd842e',
  brown: '#a57853',
  yellow: '#d2ae24',
  blue: '#416bca',
  multi: 'hsl(var(--primary))',
};
</script>
<template>
  <figure
    class="space-y-4 text-xl leading-8"
    data-bnu-final-classification
    :data-classification-scene="visual.scene"
  >
    <figcaption class="font-medium">
      {{ $t(`educationLearning.finalClassificationTitle_${visual.scene}`) }}
    </figcaption>
    <ol
      v-if="visual.scene !== 'objects'"
      class="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      <li
        v-for="card in animals"
        :key="card.label"
        class="min-w-0 rounded-lg border border-border p-3"
        :data-animal-card="card.label"
        :data-animal-name="card.name"
      >
        <p class="break-words">
          {{ card.label }} ·
          {{ $t(`educationLearning.finalAnimal_${card.name}`) }}
        </p>
        <span
          class="my-3 block text-center text-5xl leading-loose"
          aria-hidden="true"
        >
          {{ card.icon }}
        </span>
      </li>
    </ol>
    <ol v-else class="grid grid-cols-2 gap-3 lg:grid-cols-3">
      <li
        v-for="card in objects"
        :key="card.label"
        class="min-w-0 rounded-lg border border-border p-3"
        :data-classification-object="card.label"
        :data-object-shape="card.shape"
        :data-object-size="card.size"
      >
        <p class="break-words">
          {{ card.label }} ·
          {{ $t(`educationLearning.finalClassObject_${card.name}`) }}
        </p>
        <svg
          viewBox="0 0 240 170"
          class="mt-3 w-full"
          :style="{ color: colors[card.color] }"
          role="img"
          :aria-label="
            $t('educationLearning.finalClassificationObject', {
              label: card.label,
              name: $t(`educationLearning.finalClassObject_${card.name}`),
              feature: $t(`educationLearning.finalFeature_${card.shape}`),
              size: $t(`educationLearning.finalClassSize_${card.size}`),
            })
          "
        >
          <g
            :transform="
              card.size === 'small' ? 'translate(48 34) scale(0.6)' : undefined
            "
          >
            <SolidGlyph
              :shape="card.shape"
              :fill="
                card.color === 'multi'
                  ? 'hsl(var(--primary) / 0.12)'
                  : `${colors[card.color]}33`
              "
            />
            <g v-if="card.color === 'multi'" stroke-width="3" fill="none">
              <path d="M120 20 C165 45 165 125 120 150" stroke="#dc4c55" />
              <path d="M55 85 H185" stroke="#d2ae24" />
              <path d="M120 20 C75 45 75 125 120 150" stroke="#416bca" />
            </g>
          </g>
        </svg>
      </li>
    </ol>
    <p class="text-base leading-7 text-muted-foreground">
      {{
        $t(
          visual.scene === 'objects'
            ? 'educationLearning.finalClassificationObjectsNotice'
            : 'educationLearning.finalClassificationAnimalsNotice',
        )
      }}
    </p>
  </figure>
</template>
