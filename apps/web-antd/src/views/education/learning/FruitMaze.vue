<script setup lang="ts">
import type { FruitMazeVisual } from './fruit-maze';

import { computed } from 'vue';

import { $t } from '#/locales';

import { fruitMazeCells } from './fruit-maze';

const props = defineProps<{ visual: FruitMazeVisual }>();
const cells = computed(() => fruitMazeCells(props.visual.variant));
</script>

<template>
  <div class="space-y-4">
    <p class="text-xl leading-8">
      {{ $t('educationLearning.fruitMazeNotice') }}
    </p>
    <div
      class="grid grid-cols-4 gap-1"
      role="group"
      :aria-label="$t('educationLearning.fruitMazeTitle')"
    >
      <div
        v-for="cell in cells"
        :key="cell.index"
        class="min-h-24 rounded border p-1 text-center"
        :class="cell.label === null ? 'bg-muted' : 'bg-card'"
      >
        <template v-if="cell.label !== null">
          <div class="font-mono text-2xl leading-8">{{ cell.label }}</div>
          <div
            v-if="cell.label === 'A' || cell.label === 'L'"
            class="text-xl leading-8"
          >
            {{
              $t(
                cell.label === 'A'
                  ? 'educationLearning.fruitMazeEntry'
                  : 'educationLearning.fruitMazeExit',
              )
            }}
          </div>
          <div
            class="flex min-h-6 flex-wrap justify-center gap-1"
            :aria-label="
              $t('educationLearning.fruitMazeCount', { count: cell.fruit })
            "
          >
            <span
              v-for="n in cell.fruit"
              :key="n"
              aria-hidden="true"
              class="inline-block h-5 w-5 rounded-full border-2 border-current bg-orange-400"
            ></span>
            <span v-if="cell.fruit === 0" aria-hidden="true" class="text-xl">
              0
            </span>
          </div>
        </template>
        <span v-else class="text-xl leading-8">
          {{ $t('educationLearning.fruitMazeWall') }}
        </span>
      </div>
    </div>
  </div>
</template>
