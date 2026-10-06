<script lang="ts" setup>
import type { BnuFinalPositionVisual } from './bnu-final-position';

import { computed } from 'vue';

import { $t } from '#/locales';

import {
  bnuFinalAnnexCards,
  bnuFinalClockCards,
  bnuFinalFlower,
  bnuFinalPositionItems,
} from './bnu-final-position';
import Clock from './Clock.vue';
const props = defineProps<{ visual: BnuFinalPositionVisual }>();
const slots = computed(() => bnuFinalFlower(props.visual.variant));
const items = computed(() => bnuFinalPositionItems(props.visual.variant));
const clocks = computed(() => bnuFinalClockCards(props.visual.variant));
const cards = computed(() => bnuFinalAnnexCards(props.visual.variant));
const flowerDescription = computed(() => {
  const name =
    props.visual.scene === 'flower-filled'
      ? 'finalFlowerFilled'
      : 'finalFlower';
  const variant = props.visual.variant === 'main' ? 'Main' : 'Review';
  return $t(`educationLearning.${name}${variant}`);
});
const colors = { yellow: '#eab308', blue: '#38bdf8', green: '#84cc16' };
const star =
  'M0 -22 L6 -7 L22 -7 L10 4 L15 21 L0 11 L-15 21 L-10 4 L-22 -7 L-6 -7 Z';
</script>
<template>
  <figure
    class="space-y-4 text-xl leading-8"
    data-bnu-final-position
    :data-position-scene="visual.scene"
  >
    <figcaption class="font-medium">
      {{ $t(`educationLearning.finalPositionTitle_${visual.scene}`) }}
    </figcaption>
    <div
      v-if="visual.scene.startsWith('flower')"
      class="min-w-0 max-w-full overflow-x-auto"
      tabindex="0"
      :aria-label="$t('educationLearning.diagramScroll')"
    >
      <svg
        viewBox="0 0 300 300"
        class="mx-auto w-full max-w-md text-primary h-auto min-w-[300px]"
        role="img"
        :aria-label="flowerDescription"
      >
        <path
          d="M150 60 V240 M60 150 H240"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <g
          fill="hsl(var(--primary) / 0.15)"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle
            v-for="[x, y] in [
              [138, 138],
              [162, 138],
              [138, 162],
              [162, 162],
            ]"
            :key="`${x}-${y}`"
            :cx="x"
            :cy="y"
            r="15"
          />
          <circle cx="150" cy="150" r="9" />
        </g>
        <g
          v-for="slot in slots"
          :key="slot.label"
          :transform="`translate(${slot.x} ${slot.y})`"
          :data-flower-slot="slot.label"
          :data-flower-sample="slot.sample ? 'yes' : 'no'"
        >
          <rect
            x="-36"
            y="-32"
            width="72"
            height="64"
            rx="8"
            fill="hsl(var(--card))"
            stroke="currentColor"
            stroke-width="2"
          />
          <g
            v-if="slot.sample || visual.scene === 'flower-filled'"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            :data-flower-shape="slot.shape"
          >
            <path v-if="slot.shape === 'star'" :d="star" />
            <rect
              v-else-if="slot.shape === 'square'"
              x="-20"
              y="-20"
              width="40"
              height="40"
            />
            <circle v-else-if="slot.shape === 'circle'" r="21" />
            <path v-else d="M0 -22 L-24 21 H24 Z" />
          </g>
          <text
            v-else
            text-anchor="middle"
            y="7"
            font-size="22"
            fill="currentColor"
          >
            {{ slot.label }}
          </text>
        </g>
      </svg>
    </div>
    <div
      v-else-if="visual.scene === 'items'"
      class="overflow-x-auto pb-2"
      data-position-scroll
    >
      <ol class="grid min-w-[560px] grid-cols-4 gap-3">
        <li
          v-for="item in items"
          :key="item.label"
          class="min-w-0 rounded-lg border border-border p-3"
          :data-position-item="item.label"
          :data-position-name="item.name"
          :data-position-row="item.row"
          :data-position-column="item.column"
        >
          <p class="break-words">
            {{ item.label }} ·
            {{ $t(`educationLearning.finalPositionObject_${item.name}`) }}
          </p>
          <span
            class="my-3 block text-center text-4xl leading-loose"
            aria-hidden="true"
          >
            {{ item.icon }}
          </span>
        </li>
      </ol>
    </div>
    <ol v-else-if="visual.scene === 'clocks'" class="grid gap-4 sm:grid-cols-2">
      <li
        v-for="card in clocks"
        :key="card.label"
        class="min-w-0 rounded-lg border border-border p-3"
        :data-final-clock="card.label"
      >
        <p class="mb-3 font-medium">
          {{ $t('educationLearning.finalClockCard', { label: card.label }) }}
        </p>
        <Clock :visual="card.clock" />
      </li>
    </ol>
    <ol v-else class="grid grid-cols-3 gap-3">
      <li
        v-for="card in cards"
        :key="card.label"
        class="min-w-0 rounded-lg border border-border p-2"
        :data-annex-card="card.label"
        :data-annex-shape="card.shape"
        :data-annex-color="card.color"
      >
        <p>{{ card.label }}</p>
        <svg
          viewBox="0 0 100 100"
          class="w-full"
          role="img"
          :aria-label="
            $t('educationLearning.finalAnnexCard', {
              label: card.label,
              color: $t(`educationLearning.finalAnnexColor_${card.color}`),
              feature: $t(`educationLearning.shape_${card.shape}`),
            })
          "
        >
          <g :fill="colors[card.color]" stroke="#334155" stroke-width="2.5">
            <circle v-if="card.shape === 'circle'" cx="50" cy="50" r="39" />
            <rect
              v-else-if="card.shape === 'square'"
              x="13"
              y="13"
              width="74"
              height="74"
            />
            <path v-else d="M50 12 L10 86 H90 Z" />
          </g>
        </svg>
      </li>
    </ol>
    <p class="text-base leading-7 text-muted-foreground">
      {{ $t(`educationLearning.finalPositionNotice_${visual.scene}`) }}
    </p>
  </figure>
</template>
