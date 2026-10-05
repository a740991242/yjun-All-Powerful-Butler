<script setup lang="ts">
import type { BnuTangramVisual, TangramPoint } from './bnu-tangram';

import { computed, nextTick, ref, watch } from 'vue';

import { $t } from '#/locales';

import { bnuTangramHeight, bnuTangramPieces } from './bnu-tangram';

const props = defineProps<{ visual: BnuTangramVisual }>();
const pieces = computed(() => bnuTangramPieces(props.visual));
const height = computed(() => bnuTangramHeight(props.visual));
const scrollRegion = ref<HTMLDivElement | null>(null);
watch(
  () => [props.visual.scene, props.visual.variant],
  async () => {
    await nextTick();
    const region = scrollRegion.value;
    if (!region) return;
    const left = Math.min(
      ...pieces.value.flatMap((piece) =>
        piece.points.map(([x]) =>
          props.visual.variant === 'review' ? 360 - x : x,
        ),
      ),
    );
    // Keep the fixed common scale; start narrow views at the actual pieces.
    region.scrollLeft = Math.max(0, left - 20);
  },
  { immediate: true, flush: 'post' },
);
function coordinate([x, y]: TangramPoint) {
  return props.visual.variant === 'review'
    ? `(${360 - x}, ${height.value - y})`
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
    data-bnu-tangram
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t('educationLearning.tangramDiagram') }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t(`educationLearning.tangram_${visual.variant}`) }}
    </p>
    <div
      ref="scrollRegion"
      data-tangram-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.tangramScroll')"
      class="overflow-x-auto rounded-lg border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      @keydown="scrollWithKeyboard"
    >
      <svg
        :viewBox="`0 0 360 ${height}`"
        :width="360"
        :height="height"
        class="block max-w-none text-foreground"
        role="img"
        :aria-label="$t('educationLearning.tangramAria')"
      >
        <g
          :transform="
            visual.variant === 'review'
              ? `rotate(180 180 ${height / 2})`
              : undefined
          "
        >
          <g
            v-for="piece in pieces"
            :key="piece.id"
            :data-tangram-piece="piece.id"
          >
            <title>
              {{
                $t('educationLearning.tangramPiece', {
                  id: piece.id,
                  points: piece.points.map(coordinate).join(' → '),
                })
              }}
            </title>
            <polygon
              :points="piece.points.map((p) => p.join(',')).join(' ')"
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
              {{ piece.id }}
            </text>
          </g>
        </g>
      </svg>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.tangramScroll') }}
    </p>
    <p class="mb-0 text-xl leading-8 text-muted-foreground">
      {{ $t('educationLearning.tangramNotice') }}
    </p>
  </figure>
</template>
