<script setup lang="ts">
import type { RegroupSticksVisual } from './regroup-sticks';

import { computed } from 'vue';

import { $t } from '#/locales';

import { regroupStickGroups } from './regroup-sticks';
const props = defineProps<{ visual: RegroupSticksVisual }>();
const groups = computed(() => regroupStickGroups(props.visual));
</script>
<template>
  <div
    class="space-y-3"
    role="region"
    :aria-label="$t('educationLearning.regroupPicture')"
  >
    <p class="font-medium">
      {{
        $t(`educationLearning.regroup_${visual.operation}_${visual.stage}`, {
          amount: visual.amount,
        })
      }}
    </p>
    <p class="text-muted-foreground">
      {{ $t('educationLearning.regroupNotice') }}
    </p>
    <svg
      viewBox="0 0 360 220"
      class="mx-auto block w-full max-w-lg"
      role="group"
      :aria-label="$t('educationLearning.regroupPicture')"
    >
      <line
        x1="176"
        y1="12"
        x2="176"
        y2="180"
        stroke="currentColor"
        stroke-width="1"
      />
      <g role="group" :aria-label="$t('educationLearning.regroupBundles')">
        <g
          v-for="n in groups.bundles"
          :key="n"
          role="img"
          :aria-label="$t('educationLearning.regroupBundle')"
          :transform="`translate(${10 + ((n - 1) % 3) * 54}, ${12 + Math.floor((n - 1) / 3) * 55})`"
        >
          <rect
            width="46"
            height="45"
            rx="5"
            fill="none"
            stroke="currentColor"
          />
          <line
            v-for="stick in 10"
            :key="stick"
            :x1="4 + (stick - 1) * 4.2"
            :x2="4 + (stick - 1) * 4.2"
            y1="5"
            y2="40"
            stroke="currentColor"
            stroke-width="2"
            class="text-primary"
          />
        </g>
        <text
          v-if="groups.bundles === 0"
          x="85"
          y="100"
          fill="currentColor"
          text-anchor="middle"
        >
          0
        </text>
      </g>
      <g role="group" :aria-label="$t('educationLearning.regroupLoose')">
        <line
          v-for="n in groups.loose"
          :key="n"
          :x1="193 + ((n - 1) % 9) * 18"
          :x2="193 + ((n - 1) % 9) * 18"
          :y1="24 + Math.floor((n - 1) / 9) * 65"
          :y2="68 + Math.floor((n - 1) / 9) * 65"
          stroke="currentColor"
          stroke-width="4"
          class="text-primary"
          role="img"
          :aria-label="$t('educationLearning.regroupSingle')"
        />
        <text
          v-if="groups.loose === 0"
          x="264"
          y="100"
          fill="currentColor"
          text-anchor="middle"
        >
          0
        </text>
      </g>
      <text
        x="85"
        y="207"
        fill="currentColor"
        text-anchor="middle"
        font-size="14"
      >
        {{ $t('educationLearning.regroupBundles') }}
      </text>
      <text
        x="264"
        y="207"
        fill="currentColor"
        text-anchor="middle"
        font-size="14"
      >
        {{ $t('educationLearning.regroupLoose') }}
      </text>
    </svg>
  </div>
</template>
