<script setup lang="ts">
import type { ParadeFramesVisual } from './parade-frames';

import { computed } from 'vue';

import { $t } from '#/locales';

import { paradeFrames } from './parade-frames';
const props = defineProps<{ visual: ParadeFramesVisual }>();
const model = computed(() => paradeFrames(props.visual.variant));
const letters = ['A', 'B', 'C'];
</script>
<template>
  <div
    class="space-y-4"
    role="region"
    :aria-label="$t('educationLearning.paradeTitle')"
  >
    <p class="font-medium">{{ $t('educationLearning.paradeTitle') }}</p>
    <p class="text-sm">
      {{
        $t('educationLearning.paradeCondition', {
          direction: $t(`educationLearning.motionDirection_${model.direction}`),
        })
      }}
    </p>
    <div class="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div
        v-for="(position, i) in model.positions"
        :key="i"
        class="rounded-lg border border-border p-3"
      >
        <p class="mb-2 font-medium">
          {{ $t('educationLearning.motionFrame', { letter: letters[i] }) }}
        </p>
        <div
          class="min-w-0 max-w-full overflow-x-auto"
          tabindex="0"
          :aria-label="$t('educationLearning.diagramScroll')"
        >
          <svg
            viewBox="0 0 300 200"
            class="block w-full h-auto min-w-[300px]"
            role="img"
            :aria-label="
              $t('educationLearning.paradeFrame', {
                letter: letters[i],
                position,
                observer: model.observer,
                direction: $t(
                  `educationLearning.motionDirection_${model.direction}`,
                ),
              })
            "
          >
            <path
              d="M8 125 H292 M8 145 H292"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <g :transform="`translate(${position},0)`" data-parade-float>
              <rect
                x="-40"
                y="97"
                width="80"
                height="29"
                rx="5"
                fill="hsl(var(--primary) / 20%)"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M-26 90 H26 L0 73 Z M-21 71 H21 L0 54 Z"
                fill="hsl(var(--card))"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M0 55 V37 L15 43 L0 49"
                fill="hsl(var(--primary) / 30%)"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M-10 74 V96 H10 V74"
                fill="hsl(var(--card))"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                v-for="x in [-23, 23]"
                :key="x"
                :cx="x"
                cy="129"
                r="7"
                fill="hsl(var(--card))"
                stroke="currentColor"
                stroke-width="2"
              />
            </g>
            <text
              x="150"
              y="25"
              text-anchor="middle"
              fill="currentColor"
              font-size="24"
            >
              {{ model.direction === 'right' ? '→' : '←' }}
            </text>
            <g :transform="`translate(${model.observer},0)`">
              <circle
                cx="0"
                cy="164"
                r="7"
                fill="hsl(var(--card))"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M0 171 V181 M-10 176 H10 M0 181 L-8 193 M0 181 L8 193"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <text x="16" y="185" fill="currentColor" font-size="22">P</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.paradeNotice') }}
    </p>
  </div>
</template>
