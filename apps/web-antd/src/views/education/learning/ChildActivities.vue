<script lang="ts" setup>
import type { ChildActivitiesVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { activityChildren } from './child-activities';
const props = defineProps<{ visual: ChildActivitiesVisual }>();
const children = computed(() =>
  activityChildren(props.visual.variant === 'review'),
);
// Shirt colours are literal teaching data and have written equivalents.
const colors = { red: '#dc2626', blue: '#2563eb', green: '#16a34a' };
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.childActivitiesNotice') }}
    </p>
    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div
        v-for="child in children"
        :key="child.id"
        class="min-w-0 rounded-lg border border-border p-2"
      >
        <p class="text-center text-sm font-medium">
          {{ child.id }} ·
          {{ $t(`educationLearning.childActivity_${child.activity}`) }}
        </p>
        <svg
          viewBox="0 0 120 125"
          width="120"
          height="125"
          class="block h-auto w-full text-primary"
          role="img"
          :aria-label="
            $t('educationLearning.activityChild', {
              letter: child.id,
              activity: $t(`educationLearning.childActivity_${child.activity}`),
              color: $t(`educationLearning.shirtColor_${child.color}`),
            })
          "
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <g v-if="child.activity === 'run'">
              <circle cx="67" cy="22" r="10" />
              <path
                d="M62 36L51 70L34 79L40 98M51 70L73 85L92 77M59 43L79 50L91 39M59 43L41 41L33 56"
              />
              <path
                d="M55 38L67 42L59 66L47 62Z"
                :fill="colors[child.color]"
                :stroke="colors[child.color]"
              />
            </g>
            <g v-else>
              <circle cx="56" cy="23" r="10" />
              <path d="M56 36V74M56 46L32 63M56 46L80 62" />
              <path
                v-if="child.activity === 'football'"
                d="M56 74L40 99M56 74L72 89L86 87"
              />
              <path
                v-else-if="child.activity === 'rope'"
                d="M56 74L44 95M56 74L67 95"
              />
              <path v-else d="M56 74L44 105M56 74L69 105" />
              <path
                d="M49 40H63L66 68H46Z"
                :fill="colors[child.color]"
                :stroke="colors[child.color]"
              />
            </g>
            <g v-if="child.activity === 'football'">
              <circle cx="94" cy="94" r="12" />
              <path d="M90 90L98 90L101 97L94 102L87 97Z" />
            </g>
            <path
              v-else-if="child.activity === 'rope'"
              d="M31 62C1 1 113 1 81 62C110 118 5 118 31 62"
              stroke-dasharray="4 2"
            />
            <ellipse
              v-else-if="child.activity === 'hoop'"
              cx="94"
              cy="82"
              rx="15"
              ry="26"
            />
          </g>
        </svg>
        <p class="text-center text-sm">
          {{ $t(`educationLearning.shirtColor_${child.color}`) }}
        </p>
      </div>
    </div>
  </div>
</template>
