<script setup lang="ts">
import type { MotionSequencesVisual } from './motion-sequences';

import { computed } from 'vue';

import { $t } from '#/locales';

import {
  meetingPositions,
  motionSequenceFrames,
  planeNoseDirection,
  planeTurnAngle,
  projectedPlane,
  slidePosition,
} from './motion-sequences';
const props = defineProps<{ visual: MotionSequencesVisual }>();
const frames = computed(() => motionSequenceFrames(props.visual));
const letters = ['A', 'B', 'C'];
function description(time: number, letter: string) {
  const visual = props.visual;
  if (visual.scene === 'slide') {
    const [x, y] = slidePosition(visual, time);
    return $t('educationLearning.sequenceSlideFrame', { letter, x, y });
  }
  if (visual.scene === 'meet') {
    const [one, two] = meetingPositions(visual, time);
    return $t('educationLearning.sequenceMeetFrame', {
      letter,
      one,
      two,
      direction: $t(
        `educationLearning.motionDirection_${visual.variant === 'main' ? 'right' : 'left'}`,
      ),
    });
  }
  return $t('educationLearning.sequenceTurnFrame', {
    letter,
    direction: $t(
      `educationLearning.sequenceNose_${planeNoseDirection(visual, time)}`,
    ),
  });
}
</script>
<template>
  <div
    class="flex min-w-0 flex-col gap-4"
    role="region"
    :aria-label="$t(`educationLearning.sequenceTitle_${visual.scene}`)"
  >
    <p class="font-medium">
      {{ $t(`educationLearning.sequenceTitle_${visual.scene}`) }}
    </p>
    <p class="text-sm">
      {{
        $t(
          `educationLearning.sequenceCondition_${visual.scene}_${visual.variant}`,
        )
      }}
    </p>
    <div class="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div
        v-for="(time, i) in frames"
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
            viewBox="0 0 300 190"
            class="block w-full text-foreground h-auto min-w-[300px]"
            role="img"
            :aria-label="description(time, letters[i]!)"
          >
            <g v-if="visual.scene === 'slide'" aria-hidden="true">
              <path
                :d="
                  visual.variant === 'main'
                    ? 'M50 35 L230 155'
                    : 'M250 35 L70 155'
                "
                fill="none"
                stroke="currentColor"
                stroke-width="8"
              />
              <path
                :d="
                  visual.variant === 'main'
                    ? 'M50 35 V169 H260'
                    : 'M250 35 V169 H40'
                "
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <g
                :transform="`translate(${slidePosition(visual, time).join(' ')})`"
              >
                <circle
                  cy="-13"
                  r="13"
                  fill="hsl(var(--card))"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <text
                  y="-9"
                  text-anchor="middle"
                  font-size="22"
                  fill="currentColor"
                >
                  1
                </text>
              </g>
              <text
                :x="visual.variant === 'main' ? 90 : 200"
                y="100"
                font-size="30"
                fill="currentColor"
              >
                {{ visual.variant === 'main' ? '↘' : '↙' }}
              </text>
            </g>
            <g v-else-if="visual.scene === 'meet'" aria-hidden="true">
              <path
                d="M10 60 H290 M10 120 H290"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <g
                v-for="(x, car) in meetingPositions(visual, time)"
                :key="car"
                :transform="`translate(${x} ${car === 0 ? 45 : 105})`"
              >
                <rect
                  x="-19"
                  y="-14"
                  width="38"
                  height="22"
                  rx="5"
                  :fill="
                    car === 0 ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--card))'
                  "
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle cx="-12" cy="12" r="4" fill="currentColor" />
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <text
                  y="2"
                  text-anchor="middle"
                  font-size="22"
                  fill="currentColor"
                >
                  {{ car + 1 }}
                </text>
                <text
                  y="-22"
                  text-anchor="middle"
                  font-size="26"
                  fill="currentColor"
                >
                  {{ (car === 0) === (visual.variant === 'main') ? '→' : '←' }}
                </text>
              </g>
            </g>
            <g v-else aria-hidden="true">
              <ellipse
                cx="150"
                cy="158"
                rx="65"
                ry="14"
                fill="hsl(var(--card))"
                stroke="currentColor"
                stroke-width="2"
              />
              <path d="M150 99 V155" stroke="currentColor" stroke-width="4" />
              <polygon
                v-for="(surface, j) in projectedPlane(
                  planeTurnAngle(visual, time),
                )"
                :key="j"
                :points="surface.points"
                :fill="
                  surface.part === 'body'
                    ? 'hsl(var(--card))'
                    : 'hsl(var(--primary) / 0.4)'
                "
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t(`educationLearning.sequenceNotice_${visual.scene}`) }}
    </p>
  </div>
</template>
