<script setup lang="ts">
import type { BnuTwoJumpLineVisual } from './bnu-two-jump-line';

import { computed, useId } from 'vue';

import { $t } from '#/locales';

import { bnuTwoJumpLine } from './bnu-two-jump-line';
import { required } from './required';
const props = defineProps<{ visual: BnuTwoJumpLineVisual }>();
const line = computed(() => bnuTwoJumpLine(props.visual));
const markerId = `bnu-two-arrow-${useId()}`;
function x(n: number) {
  const ticks = line.value.ticks;
  const minimum = required(ticks[0]);
  const maximum = required(ticks.at(-1));
  return 48 + (864 * (n - minimum)) / (maximum - minimum);
}
function curve(from: number, to: number, index: number) {
  return `M${x(from)} 100 Q${(x(from) + x(to)) / 2} ${index === 0 ? 24 : 64} ${x(to)} 100`;
}
function scrollWithKeyboard(event: KeyboardEvent) {
  if (
    event.target !== event.currentTarget ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return;
  const n = event.currentTarget;
  if (
    !(n instanceof HTMLElement) ||
    !['ArrowLeft', 'ArrowRight'].includes(event.key)
  )
    return;
  const d = event.key === 'ArrowRight' ? 1 : -1;
  if (
    n.scrollWidth <= n.clientWidth ||
    (d > 0 ? n.scrollLeft + n.clientWidth >= n.scrollWidth : n.scrollLeft <= 0)
  )
    return;
  event.preventDefault();
  event.stopPropagation();
  n.scrollBy({ left: d * 144, behavior: 'auto' });
}
</script>
<template>
  <figure
    data-bnu-two-line
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t(`educationLearning.bnuTwoLine_${visual.scene}`) }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t('educationLearning.bnuTwoLineLegend') }}
    </p>
    <div
      data-bnu-two-scroll
      role="region"
      tabindex="0"
      :aria-label="$t('educationLearning.bnuTenLineScroll')"
      @keydown="scrollWithKeyboard"
      class="overflow-x-auto scroll-auto rounded-lg border border-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <svg
        viewBox="0 0 960 210"
        class="h-[210px] w-[960px] shrink-0"
        role="group"
        :aria-label="$t(`educationLearning.bnuTwoLine_${visual.scene}`)"
      >
        <defs>
          <marker
            :id="markerId"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10Z" fill="currentColor" />
          </marker>
        </defs>
        <path d="M48 118H912" stroke="currentColor" stroke-width="2" />
        <g v-for="n in line.ticks" :key="n" data-bnu-two-tick>
          <path
            :d="`M${x(n)} 110V126`"
            stroke="currentColor"
            stroke-width="2"
          />
          <text
            :x="x(n)"
            y="159"
            text-anchor="middle"
            font-size="20"
            fill="currentColor"
          >
            {{ n }}
          </text>
        </g>
        <g
          v-for="(segment, index) in line.segments"
          :key="index"
          data-bnu-two-segment
        >
          <path
            data-bnu-two-arrow
            role="img"
            :aria-label="
              $t(`educationLearning.bnuTwoArrow_${visual.scene}_${index}`, {
                start: segment.from,
                jump: segment.jump,
                end: segment.to,
                lower: line.finalRange[0],
                upper: line.finalRange[1],
              })
            "
            :data-start="segment.from"
            :data-end="segment.to"
            :data-jump="segment.jump"
            :d="curve(segment.from, segment.to, index)"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            :marker-end="`url(#${markerId})`"
            class="text-primary"
          />
          <text
            data-bnu-two-jump
            :x="(x(segment.from) + x(segment.to)) / 2"
            :y="index === 0 ? 42 : 66"
            text-anchor="middle"
            font-size="20"
            fill="currentColor"
          >
            {{ line.operation }}{{ segment.jump }}
          </text>
        </g>
      </svg>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.bnuTenLineScroll') }}
    </p>
    <p class="mb-0 mt-3 text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.bnuTwoLineNotice') }}
    </p>
  </figure>
</template>
