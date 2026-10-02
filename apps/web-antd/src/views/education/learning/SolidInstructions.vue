<script setup lang="ts">
import type { SolidInstructionsVisual } from './solid-instructions';

import { computed } from 'vue';

import { $t } from '#/locales';

import { required } from './required';
import { solidInstructionItems } from './solid-instructions';
import SolidGlyph from './SolidGlyph.vue';

const props = defineProps<{ visual: SolidInstructionsVisual }>();
const items = computed(() => solidInstructionItems(props.visual));
const item = (role: string) =>
  required(items.value.find((p) => p.role === role));
const ground = computed(() =>
  [null, 'back', null, 'left', 'center', 'right', null, 'front', null].map(
    (role) => (role === null ? null : item(role)),
  ),
);
const stack = computed(() =>
  ['upperTop', 'lowerTop', 'center'].map((role) => item(role)),
);
const bridgeLayers = [
  ['leftBall', 'rightBall'],
  ['leftCube', 'rightCube'],
  ['beam'],
  ['leftPillar', 'rightPillar'],
];
</script>
<template>
  <div class="flex min-w-0 flex-col gap-4" data-solid-instructions>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.solidInstructionsNotice') }}
    </p>
    <template v-if="visual.arrangement === 'cross'">
      <section class="rounded-lg border border-border p-3" data-ground-plan>
        <h4 class="mb-3 font-medium">
          {{ $t('educationLearning.solidInstructionsGround') }}
        </h4>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="(piece, index) in ground" :key="index" class="min-w-0">
            <div
              v-if="piece"
              class="flex h-full flex-col items-center rounded border border-border bg-primary/5 p-1"
              :data-piece-label="piece.label"
            >
              <span class="text-center text-sm">
                {{ $t(`educationLearning.solidRole_${piece.role}`) }} ·
                {{ piece.label }}
              </span>
              <svg
                viewBox="0 0 240 180"
                class="w-full max-w-24 text-primary"
                role="img"
                :aria-label="
                  $t('educationLearning.solidInstructionPiece', {
                    label: piece.label,
                    shape: $t(`educationLearning.shape_${piece.shape}`),
                  })
                "
              >
                <SolidGlyph :shape="piece.shape" />
              </svg>
            </div>
          </div>
        </div>
        <p class="mt-3 text-center text-sm">
          {{ $t('educationLearning.solidInstructionsObserver') }}
        </p>
      </section>
      <section class="rounded-lg border border-border p-3" data-center-stack>
        <h4 class="mb-3 font-medium">
          {{ $t('educationLearning.solidInstructionsStack') }}
        </h4>
        <div class="mx-auto flex w-full max-w-48 flex-col gap-2">
          <div
            v-for="piece in stack"
            :key="piece.label"
            class="flex flex-col items-center rounded border border-border bg-primary/5 p-2"
            :data-piece-label="piece.label"
          >
            <span class="text-sm">
              {{ $t(`educationLearning.solidRole_${piece.role}`) }} ·
              {{ piece.label }}
            </span>
            <svg
              viewBox="0 0 240 180"
              class="w-24 text-primary"
              role="img"
              :aria-label="
                $t('educationLearning.solidInstructionPiece', {
                  label: piece.label,
                  shape: $t(`educationLearning.shape_${piece.shape}`),
                })
              "
            >
              <SolidGlyph :shape="piece.shape" />
            </svg>
          </div>
        </div>
        <p class="mt-3 text-sm text-muted-foreground">
          {{
            $t('educationLearning.solidInstructionsSameCenter', {
              label: item('center').label,
            })
          }}
        </p>
      </section>
    </template>
    <section
      v-else
      class="rounded-lg border border-border p-3"
      data-bridge-layers
    >
      <h4 class="mb-3 font-medium">
        {{ $t('educationLearning.solidInstructionsBridge') }}
      </h4>
      <div
        v-for="(layer, index) in bridgeLayers"
        :key="index"
        class="mb-2 grid gap-2"
        :class="layer.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
      >
        <div
          v-for="role in layer"
          :key="role"
          class="flex min-w-0 flex-col items-center rounded border border-border bg-primary/5 p-2"
          :data-piece-label="item(role).label"
        >
          <span class="text-center text-sm">
            {{ $t(`educationLearning.solidRole_${role}`) }} ·
            {{ item(role).label }}
          </span>
          <svg
            viewBox="0 0 240 180"
            class="w-24 max-w-full text-primary"
            role="img"
            :aria-label="
              $t('educationLearning.solidInstructionPiece', {
                label: item(role).label,
                shape: $t(`educationLearning.shape_${item(role).shape}`),
              })
            "
          >
            <SolidGlyph :shape="item(role).shape" />
          </svg>
        </div>
      </div>
      <p class="text-sm text-muted-foreground">
        {{ $t('educationLearning.solidInstructionsBridgeNotice') }}
      </p>
    </section>
  </div>
</template>
