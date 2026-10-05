<script setup lang="ts">
import type { BnuFoldOneVisual, FoldOnePoint } from './bnu-fold-one';

import { computed } from 'vue';

import { $t } from '#/locales';

import { bnuFoldOnePieces } from './bnu-fold-one';
const props = defineProps<{ visual: BnuFoldOneVisual }>();
const pieces = computed(() => bnuFoldOnePieces(props.visual));
const letter = (index: number) => String.fromCodePoint(65 + index);
function coordinate([x, y]: FoldOnePoint) {
  return props.visual.variant === 'review'
    ? `(${360 - x}, ${280 - y})`
    : `(${x}, ${y})`;
}
function scrollWithKeyboard(event: KeyboardEvent) {
  if (
    event.target !== event.currentTarget ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return;
  const node = event.currentTarget;
  if (
    !(node instanceof HTMLElement) ||
    !['ArrowLeft', 'ArrowRight'].includes(event.key)
  )
    return;
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  if (
    node.scrollWidth <= node.clientWidth ||
    (direction > 0
      ? node.scrollLeft + node.clientWidth >= node.scrollWidth
      : node.scrollLeft <= 0)
  )
    return;
  event.preventDefault();
  event.stopPropagation();
  node.scrollBy({ left: direction * 120, behavior: 'auto' });
}
</script>
<template>
  <figure
    data-bnu-fold-one
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t(`educationLearning.bnuFold_${visual.scene}`) }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t(`educationLearning.bnuFold_${visual.variant}`) }}
    </p>
    <div
      data-bnu-fold-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.bnuFoldScroll')"
      @keydown="scrollWithKeyboard"
      class="overflow-x-auto rounded-lg border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <svg
        viewBox="0 0 360 280"
        class="block h-[280px] w-[360px] max-w-none text-foreground"
        role="img"
        :aria-label="$t('educationLearning.bnuFoldDiagram')"
      >
        <g
          :transform="
            visual.variant === 'review' ? 'rotate(180 180 140)' : undefined
          "
        >
          <g
            v-for="(piece, index) in pieces"
            :key="index"
            :data-fold-piece="letter(index)"
          >
            <title>
              {{
                piece.curved
                  ? $t('educationLearning.bnuFoldCurvedPiece', {
                      letter: letter(index),
                      points: piece.arc
                        ? `${coordinate(piece.arc.start)} → ${coordinate(piece.arc.end)}`
                        : '',
                      radius: piece.arc?.radius,
                      side: $t(
                        piece.arc?.sweep === 1
                          ? 'educationLearning.bnuFoldAbove'
                          : 'educationLearning.bnuFoldBelow',
                      ),
                    })
                  : $t('educationLearning.bnuFoldStraightPiece', {
                      letter: letter(index),
                      points: piece.polygon?.map(coordinate).join(' → '),
                    })
              }}
            </title>
            <path
              :d="piece.path"
              fill="hsl(var(--primary) / 0.12)"
              stroke="currentColor"
              stroke-width="2.5"
            />
            <text
              :x="piece.label[0]"
              :y="piece.label[1]"
              :transform="
                visual.variant === 'review'
                  ? `rotate(180 ${piece.label[0]} ${piece.label[1]})`
                  : undefined
              "
              fill="currentColor"
              font-size="20"
              text-anchor="middle"
              dominant-baseline="middle"
              aria-hidden="true"
            >
              {{ letter(index) }}
            </text>
          </g>
        </g>
      </svg>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.bnuFoldScroll') }}
    </p>
    <p class="mb-0 text-xl leading-8 text-muted-foreground">
      {{ $t('educationLearning.bnuFoldNotice') }}
    </p>
  </figure>
</template>
