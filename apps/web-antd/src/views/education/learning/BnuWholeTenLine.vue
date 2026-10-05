<script setup lang="ts">
import type { BnuPineconeLineVisual } from './bnu-pinecone-line';
import type { BnuWholeTenLineVisual } from './bnu-whole-ten-line';

import { computed, useId } from 'vue';

import { $t } from '#/locales';

import { bnuPineconeLine } from './bnu-pinecone-line';
import { bnuWholeTenLine } from './bnu-whole-ten-line';
import { required } from './required';
const props = defineProps<{
  visual: BnuPineconeLineVisual | BnuWholeTenLineVisual;
}>();
const line = computed(() =>
  props.visual.kind === 'bnu-pinecone-line'
    ? bnuPineconeLine(props.visual)
    : bnuWholeTenLine(props.visual),
);
const titleKey = computed(
  () =>
    `educationLearning.${props.visual.kind === 'bnu-pinecone-line' ? 'bnuPineLine' : 'bnuTenLine'}_${props.visual.scene}`,
);
const markerId = `bnu-ten-arrow-${useId()}`;
function x(n: number) {
  const ticks = line.value.ticks;
  const minimum = required(ticks[0]);
  const maximum = required(ticks.at(-1));
  return 48 + (864 * (n - minimum)) / (maximum - minimum);
}
const curve = computed(
  () =>
    `M${x(line.value.start)} 100 Q${(x(line.value.start) + x(line.value.end)) / 2} 24 ${x(line.value.end)} 100`,
);
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
    data-bnu-ten-line
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t(titleKey) }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t('educationLearning.bnuTenLineLegend') }}
    </p>
    <div
      data-bnu-ten-scroll
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
        :aria-label="$t(titleKey)"
      >
        <defs>
          <marker
            :id="markerId"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="10"
            markerHeight="10"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10Z" fill="currentColor" />
          </marker>
        </defs>
        <path d="M48 118H912" stroke="currentColor" stroke-width="2" />
        <g v-for="n in line.ticks" :key="n" data-bnu-ten-tick>
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
        <path
          data-bnu-ten-arrow
          role="img"
          :aria-label="
            $t(`educationLearning.bnuTenLineArrow_${visual.scene}`, {
              start: line.start,
              jump: line.jump,
              end: line.end,
            })
          "
          :d="curve"
          :data-start="line.start"
          :data-end="line.end"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          :marker-end="`url(#${markerId})`"
          class="text-primary"
        />
        <text
          data-bnu-ten-jump
          :x="(x(line.start) + x(line.end)) / 2"
          y="42"
          text-anchor="middle"
          font-size="20"
          fill="currentColor"
        >
          {{ line.operation }}{{ line.jump }}
        </text>
      </svg>
    </div>
    <p class="mt-3 text-xl leading-8">
      {{ $t('educationLearning.bnuTenLineScroll') }}
    </p>
    <p class="mb-0 mt-3 text-base leading-7 text-muted-foreground">
      {{ $t('educationLearning.bnuTenLineNotice') }}
    </p>
  </figure>
</template>
