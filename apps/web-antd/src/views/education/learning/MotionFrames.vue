<script setup lang="ts">
import type { MotionFramesVisual } from './motion-frames';

import { computed } from 'vue';

import { $t } from '#/locales';

import { motionScene } from './motion-frames';
const props = defineProps<{ visual: MotionFramesVisual }>();
const scene = computed(() => motionScene(props.visual));
const letters = ['A', 'B', 'C'];
</script>
<template>
  <div
    class="space-y-4"
    role="region"
    :aria-label="$t('educationLearning.motionTitle')"
  >
    <p class="font-medium">{{ $t('educationLearning.motionTitle') }}</p>
    <p class="text-sm">
      {{
        $t('educationLearning.motionCondition', {
          direction: $t(`educationLearning.motionDirection_${scene.direction}`),
        })
      }}
    </p>
    <div class="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div
        v-for="(position, i) in scene.positions"
        :key="i"
        class="rounded-lg border border-border p-3"
        role="group"
        :aria-label="
          $t('educationLearning.motionFrame', { letter: letters[i] })
        "
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
            viewBox="0 0 300 180"
            class="block w-full h-auto min-w-[300px]"
            role="img"
            :aria-label="
              $t('educationLearning.motionFrameDescription', {
                letter: letters[i],
                direction: $t(
                  `educationLearning.motionDirection_${scene.direction}`,
                ),
                position,
                landmark: scene.landmark,
              })
            "
          >
            <path
              d="M10 157 H290"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <g :transform="`translate(${scene.landmark},0)`">
              <path d="M0 90 V123" stroke="currentColor" stroke-width="2" />
              <rect
                x="-15"
                y="64"
                width="30"
                height="25"
                fill="hsl(var(--card))"
                stroke="currentColor"
                stroke-width="2"
              />
              <text
                x="0"
                y="82"
                text-anchor="middle"
                fill="currentColor"
                font-size="22"
              >
                P
              </text>
            </g>
            <g :transform="`translate(${position},0)`">
              <path
                d="M-20 141 V129 H-13 L-7 116 H9 L16 129 H20 V141 Z"
                fill="hsl(var(--card))"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="-12"
                cy="144"
                r="7"
                fill="hsl(var(--card))"
                stroke="currentColor"
                stroke-width="2"
              />
              <circle
                cx="12"
                cy="144"
                r="7"
                fill="hsl(var(--card))"
                stroke="currentColor"
                stroke-width="2"
              />
              <text
                x="0"
                y="49"
                text-anchor="middle"
                fill="currentColor"
                font-size="24"
              >
                {{ scene.direction === 'right' ? '→' : '←' }}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.motionNotice') }}
    </p>
  </div>
</template>
