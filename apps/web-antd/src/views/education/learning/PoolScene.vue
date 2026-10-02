<script lang="ts" setup>
import type { PoolSceneVisual } from './types';

import { computed } from 'vue';

import { $t } from '#/locales';

import { poolPeople } from './pool-scene';
const props = defineProps<{ visual: PoolSceneVisual }>();
const people = computed(() => poolPeople(props.visual.variant === 'review'));
const locations = ['pool', 'deck'] as const;
const ringColors = { red: '#dc2626', blue: '#2563eb', none: 'transparent' };
</script>
<template>
  <div class="flex min-w-0 flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.poolSceneNotice') }}
    </p>
    <section
      v-for="place in locations"
      :key="place"
      class="min-w-0 rounded-xl border border-border p-3"
      :class="place === 'pool' ? 'bg-primary/5' : 'bg-muted/30'"
    >
      <h4 class="mb-3 font-semibold">
        {{ $t(`educationLearning.poolPlace_${place}`) }}
      </h4>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3">
        <div
          v-for="person in people.filter((p) => p.place === place)"
          :key="person.id"
          class="min-w-0 rounded-lg border border-border bg-card p-2"
        >
          <p class="text-center text-sm font-medium">
            {{ person.id }} ·
            {{ $t(`educationLearning.poolRole_${person.role}`) }}
          </p>
          <svg
            viewBox="0 0 120 110"
            width="120"
            height="110"
            class="block h-auto w-full text-primary"
            role="img"
            :aria-label="
              $t('educationLearning.poolPerson', {
                letter: person.id,
                role: $t(`educationLearning.poolRole_${person.role}`),
                place: $t(`educationLearning.poolPlace_${person.place}`),
                ring: $t(`educationLearning.poolRing_${person.ring}`),
              })
            "
          >
            <g
              fill="hsl(var(--primary) / 0.12)"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            >
              <circle cx="60" cy="25" :r="person.role === 'adult' ? 13 : 11" />
              <path
                d="M60 40V78M60 51L35 64M60 51L85 64M60 78L45 96M60 78L75 96"
              />
            </g>
            <ellipse
              v-if="person.ring !== 'none'"
              cx="60"
              cy="70"
              rx="33"
              ry="14"
              fill="none"
              :stroke="ringColors[person.ring]"
              stroke-width="7"
            />
            <path
              v-if="place === 'pool'"
              d="M9 101Q20 94 31 101T53 101T75 101T97 101T119 101"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          <p class="text-center text-sm">
            {{ $t(`educationLearning.poolRing_${person.ring}`) }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
