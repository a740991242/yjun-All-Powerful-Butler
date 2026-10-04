<script setup lang="ts">
import type { ShadowSizeVisual } from './shadow-size';

import { computed } from 'vue';

import { $t } from '#/locales';

import { shadowScenes } from './shadow-size';
const props = defineProps<{ visual: ShadowSizeVisual }>();
const scenes = computed(() => shadowScenes(props.visual));
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" data-shadow-size>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.shadowSizeNotice') }}
    </p>
    <div class="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
      <div
        v-for="scene in scenes"
        :key="scene.label"
        class="min-w-0 rounded-lg border border-border p-2"
      >
        <p class="text-lg font-semibold">{{ scene.label }}</p>
        <div
          class="overflow-x-auto"
          tabindex="0"
          :aria-label="$t('educationLearning.shadowSizeScroll')"
        >
          <svg
            viewBox="0 0 320 170"
            class="block w-full min-w-[200px]"
            role="img"
            :aria-label="
              $t('educationLearning.shadowSizeTitle', {
                label: scene.label,
                position: $t(
                  scene.objectX === 100
                    ? 'educationLearning.shadowSizeNear'
                    : 'educationLearning.shadowSizeFar',
                ),
              })
            "
            :data-shadow-scene="scene.label"
          >
            <path
              :d="`M${scene.lampX} ${scene.centerY} L${scene.screenX} ${scene.centerY - scene.shadowHalf} L${scene.screenX} ${scene.centerY + scene.shadowHalf} Z`"
              fill="hsl(var(--primary) / 0.08)"
              stroke="currentColor"
              stroke-dasharray="4 4"
            />
            <line
              :x1="scene.screenX"
              :x2="scene.screenX"
              y1="30"
              y2="135"
              stroke="currentColor"
              stroke-width="2"
            />
            <line
              :x1="scene.screenX"
              :x2="scene.screenX"
              :y1="scene.centerY - scene.shadowHalf"
              :y2="scene.centerY + scene.shadowHalf"
              stroke="currentColor"
              stroke-width="9"
              data-shadow-strip
            />
            <line
              :x1="scene.objectX"
              :x2="scene.objectX"
              :y1="scene.centerY - scene.objectHalf"
              :y2="scene.centerY + scene.objectHalf"
              stroke="currentColor"
              stroke-width="8"
              data-shadow-object
            />
            <circle
              :cx="scene.lampX"
              :cy="scene.centerY"
              r="6"
              fill="hsl(var(--primary))"
            />
          </svg>
        </div>
        <div
          class="grid grid-cols-3 gap-2 text-center text-lg"
          aria-hidden="true"
        >
          <span>{{ $t('educationLearning.shadowSizeLamp') }}</span>
          <span>{{ $t('educationLearning.shadowSizeObject') }}</span>
          <span>{{ $t('educationLearning.shadowSizeScreen') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
