<script setup lang="ts">
import type { SolidRecomposeVisual } from './solid-recompose';

import { computed } from 'vue';

import { $t } from '#/locales';

import { solidPieceLayers, solidRecomposeData } from './solid-recompose';
import SolidRecomposeDiagram from './SolidRecomposeDiagram.vue';
const props = defineProps<{ visual: SolidRecomposeVisual }>();
const data = computed(() => solidRecomposeData(props.visual));
const counting = computed(() => props.visual.scene.startsWith('count-'));
</script>
<template>
  <div class="flex min-w-0 flex-col gap-4" data-solid-recompose>
    <p class="text-sm leading-6 text-muted-foreground">
      {{
        $t(
          visual.scene.startsWith('pair-')
            ? 'educationLearning.pairRecomposeInstruction'
            : 'educationLearning.recomposeInstruction',
        )
      }}
    </p>
    <section>
      <p class="mb-2 font-medium">
        {{
          $t(
            counting
              ? 'educationLearning.recomposeWork'
              : 'educationLearning.recomposeInput',
          )
        }}
      </p>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          v-for="piece in data.input"
          :key="piece.id"
          class="rounded-lg border border-border p-3"
        >
          <p class="text-center font-medium">{{ piece.id }}</p>
          <SolidRecomposeDiagram
            :piece="piece"
            :label="$t('educationLearning.recomposePiece', { id: piece.id })"
          />
          <div
            v-if="counting"
            class="flex flex-col gap-2"
            data-recompose-layers
          >
            <p class="text-sm leading-6 text-muted-foreground">
              {{ $t('educationLearning.recomposeLayers') }}
            </p>
            <div
              v-for="(layer, i) in solidPieceLayers(piece)"
              :key="i"
              class="rounded border border-border p-2"
              :data-recompose-layer="i + 1"
            >
              <p class="text-sm">
                {{ $t('educationLearning.recomposeLayer', { layer: i + 1 }) }}
              </p>
              <svg
                viewBox="0 0 240 150"
                class="mx-auto w-full max-w-60 text-primary"
                role="img"
                :aria-label="
                  $t('educationLearning.recomposeLayer', { layer: i + 1 })
                "
                data-layer-diagram
              >
                <rect
                  v-for="cell in layer"
                  :key="`${cell[0]}-${cell[1]}`"
                  :x="32 + cell[0] * 40"
                  :y="80 - cell[1] * 40"
                  width="36"
                  height="36"
                  fill="hsl(var(--primary) / 0.12)"
                  stroke="currentColor"
                  stroke-width="2"
                  data-layer-cell
                />
                <text
                  x="120"
                  y="140"
                  text-anchor="middle"
                  font-size="16"
                  fill="currentColor"
                >
                  {{ $t('educationLearning.recomposeFront') }}
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-if="data.choices.length">
      <p class="mb-2 font-medium">
        {{ $t('educationLearning.recomposeChoices') }}
      </p>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          v-for="(group, i) in data.choices"
          :key="i"
          class="rounded-lg border border-border p-3"
          :data-recompose-choice="String.fromCodePoint(65 + i)"
        >
          <p class="text-center font-medium">
            {{ String.fromCodePoint(65 + i) }}
          </p>
          <div
            class="grid gap-2"
            :class="group.length > 1 ? 'grid-cols-2' : 'grid-cols-1'"
          >
            <SolidRecomposeDiagram
              v-for="piece in group"
              :key="piece.id"
              :piece="piece"
              :label="$t('educationLearning.recomposePiece', { id: piece.id })"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
