<script setup lang="ts">
import type { BnuComicVisual } from './bnu-comic';

import { computed } from 'vue';

import { $t } from '#/locales';

import { bnuComicDuckCounts, bnuComicFacts } from './bnu-comic';
const props = defineProps<{ visual: BnuComicVisual }>();
const facts = computed(() => bnuComicFacts(props.visual.variant));
const counts = computed(() => bnuComicDuckCounts(props.visual.variant));
const events = computed(() =>
  props.visual.scene === 'milk'
    ? ['need', 'pay', 'change', 'home']
    : ['start', 'arrive', 'leave', 'question'],
);
const caption = (event: string) =>
  $t(`educationLearning.comic_${event}`, facts.value);
</script>
<template>
  <figure
    data-bnu-comic
    :data-comic-scene="visual.scene"
    :data-comic-variant="visual.variant"
    class="m-0 min-w-0 rounded-xl border border-border bg-card p-2 sm:p-4"
  >
    <figcaption class="mb-3 text-xl font-semibold leading-8">
      {{ $t(`educationLearning.comicTitle_${visual.scene}`) }}
    </figcaption>
    <p class="mb-3 text-xl leading-8">
      {{ $t('educationLearning.comicOrder') }}
    </p>
    <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <section
        v-for="(event, index) in events"
        :key="event"
        :data-comic-panel="index + 1"
        class="min-w-0 rounded-lg border border-border p-1 sm:p-3"
      >
        <h3 class="mb-2 text-xl font-semibold leading-8">
          {{ $t('educationLearning.comicFrame', { frame: index + 1 }) }}
        </h3>
        <svg
          width="192"
          height="144"
          viewBox="0 0 192 144"
          class="mx-auto block max-w-none text-foreground"
          role="img"
          :aria-label="caption(event)"
        >
          <template v-if="visual.scene === 'ducks' && index < 3">
            <g
              v-for="duck in counts[index]"
              :key="duck"
              data-comic-duck
              :transform="`translate(${20 + ((duck - 1) % 4) * 46}, ${28 + Math.floor((duck - 1) / 4) * 48})`"
            >
              <ellipse
                cx="0"
                cy="12"
                rx="14"
                ry="9"
                fill="hsl(var(--primary) / 0.15)"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="8"
                cy="1"
                r="7"
                fill="hsl(var(--card))"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M14 0L20 3L14 5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle cx="10" cy="0" r="1.5" fill="currentColor" />
            </g>
            <path
              v-if="index === 1"
              d="M18 122H170L160 114M170 122L160 130"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              v-if="index === 2"
              d="M170 122H18L28 114M18 122L28 130"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
          </template>
          <template v-else-if="event === 'change' || event === 'question'">
            <rect
              x="36"
              y="24"
              width="120"
              height="96"
              rx="14"
              fill="hsl(var(--muted))"
              stroke="currentColor"
              stroke-width="2"
            />
            <text
              x="96"
              y="89"
              text-anchor="middle"
              font-size="48"
              fill="currentColor"
            >
              ?
            </text>
          </template>
          <template v-else>
            <path
              v-if="event === 'home' || event === 'need'"
              d="M24 68L96 20L168 68M40 60V122H152V60M82 122V84H110V122"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              v-else
              d="M20 100H172M26 100V123M166 100V123"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              data-comic-carton
              d="M77 48L88 30H104L115 48V100H77ZM77 48H115M88 30V48"
              fill="hsl(var(--card))"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M87 66H105M87 77H105"
              stroke="currentColor"
              stroke-width="2"
            />
          </template>
        </svg>
        <p class="mt-2 text-xl leading-8">{{ caption(event) }}</p>
      </section>
    </div>
    <p class="mt-3 text-xl leading-8 text-muted-foreground">
      {{
        $t(
          visual.scene === 'milk'
            ? 'educationLearning.comicMilkNotice'
            : 'educationLearning.comicDuckNotice',
        )
      }}
      {{
        $t(
          visual.variant === 'main'
            ? 'educationLearning.comicMainNotice'
            : 'educationLearning.comicReviewNotice',
        )
      }}
    </p>
  </figure>
</template>
