<script lang="ts" setup>
import type { BnuFinalSolidsVisual, FinalRobotPiece } from './bnu-final-solids';

import { computed } from 'vue';

import { $t } from '#/locales';

import {
  bnuFinalMaterials,
  bnuFinalObjects,
  bnuFinalRobot,
} from './bnu-final-solids';
import SolidGlyph from './SolidGlyph.vue';
const props = defineProps<{ visual: BnuFinalSolidsVisual }>();
const objects = computed(() => bnuFinalObjects(props.visual.variant));
const materials = computed(() => bnuFinalMaterials(props.visual.variant));
const pieces = computed(() => bnuFinalRobot(props.visual.variant));
function transform(piece: FinalRobotPiece) {
  const { x, y, width, height } = piece;
  const rotation = piece.rotate
    ? `rotate(${piece.rotate} ${x + width / 2} ${y + height / 2}) `
    : '';
  return `${rotation}translate(${x} ${y}) scale(${width / 100} ${height / 100})`;
}
function fill(piece: FinalRobotPiece) {
  if (piece.base) return '#ed926c';
  if (piece.shape === 'cylinder') return '#8ed7ed';
  if (piece.shape === 'sphere') return '#f5a5c8';
  return '#f1e48d';
}
</script>

<template>
  <figure
    class="space-y-4 text-xl leading-8"
    data-bnu-final-solids
    :data-final-scene="visual.scene"
  >
    <figcaption class="font-medium">
      {{ $t(`educationLearning.finalSolidsTitle_${visual.scene}`) }}
    </figcaption>
    <ol
      v-if="visual.scene === 'objects'"
      class="grid grid-cols-2 gap-3 lg:grid-cols-3"
    >
      <li
        v-for="item in objects"
        :key="item.position"
        class="min-w-0 rounded-lg border border-border p-3"
        :data-life-object="item.position"
      >
        <p>
          {{ item.position }} ·
          {{ $t(`educationLearning.finalLife_${item.name}`) }}
        </p>
        <svg
          viewBox="0 0 240 170"
          class="mt-3 w-full text-primary"
          role="img"
          :aria-label="
            $t('educationLearning.finalLifeFigure', {
              position: item.position,
              name: $t(`educationLearning.finalLife_${item.name}`),
              feature: $t(`educationLearning.finalFeature_${item.shape}`),
            })
          "
        >
          <SolidGlyph :shape="item.shape" />
        </svg>
      </li>
    </ol>
    <div v-else-if="visual.scene === 'materials'" class="space-y-4">
      <section
        v-for="group in materials"
        :key="group.label"
        class="rounded-lg border border-border p-3"
        :data-material-group="group.label"
      >
        <h4 class="mb-3 font-medium">
          {{
            $t('educationLearning.finalMaterialGroup', { label: group.label })
          }}
        </h4>
        <ol class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <li
            v-for="piece in group.shapes"
            :key="piece.label"
            class="rounded-lg border border-border p-2"
            :data-material-piece="piece.label"
            :data-material-shape="piece.shape"
          >
            <p>{{ piece.label }}</p>
            <svg
              viewBox="0 0 240 170"
              class="w-full text-primary"
              role="img"
              :aria-label="
                $t('educationLearning.finalMaterialPiece', {
                  label: piece.label,
                  feature: $t(`educationLearning.finalFeature_${piece.shape}`),
                })
              "
            >
              <g
                v-if="piece.shape === 'roof'"
                fill="hsl(var(--primary) / 0.12)"
                stroke="currentColor"
                stroke-width="3"
                stroke-linejoin="round"
              >
                <path
                  d="M40 140 L115 35 L175 140 Z M115 35 L155 15 L215 120 L175 140 M40 140 L80 120 M175 140 L215 120"
                />
              </g>
              <SolidGlyph v-else :shape="piece.shape" />
            </svg>
          </li>
        </ol>
      </section>
    </div>
    <ol
      v-else-if="visual.scene === 'stability'"
      class="grid gap-3 lg:grid-cols-3"
    >
      <li
        v-for="plan in ['A', 'B', 'C']"
        :key="plan"
        class="rounded-lg border border-border p-3"
        :data-stability-plan="plan"
      >
        <p>{{ $t('educationLearning.finalStabilityPlan', { label: plan }) }}</p>
        <svg
          viewBox="0 0 240 260"
          class="mx-auto mt-3 w-full max-w-60 text-primary"
          role="img"
          :aria-label="$t(`educationLearning.finalStability_${plan}`)"
        >
          <g
            fill="hsl(var(--primary) / 0.12)"
            stroke="currentColor"
            stroke-width="3"
            stroke-linejoin="round"
          >
            <rect x="25" y="224" width="190" height="20" />
            <g v-if="plan === 'A'">
              <path
                d="M55 152 V211 C55 228 85 228 85 211 V152 M155 152 V211 C155 228 185 228 185 211 V152"
              />
              <ellipse cx="70" cy="152" rx="15" ry="7" />
              <ellipse cx="170" cy="152" rx="15" ry="7" />
              <rect x="40" y="132" width="160" height="20" />
              <path d="M75 132 L120 78 L165 132 Z" />
            </g>
            <g v-else-if="plan === 'B'">
              <path d="M105 174 V215 C105 228 135 228 135 215 V174" />
              <ellipse cx="120" cy="174" rx="15" ry="7" />
              <rect x="55" y="154" width="130" height="20" />
              <circle cx="120" cy="133" r="21" />
              <rect x="55" y="92" width="130" height="20" />
              <path d="M75 92 L120 38 L165 92 Z" />
            </g>
            <g v-else>
              <rect x="55" y="183" width="40" height="41" />
              <circle cx="75" cy="164" r="19" />
              <rect x="150" y="145" width="40" height="39" />
              <rect x="150" y="184" width="40" height="40" />
              <rect x="40" y="125" width="165" height="20" />
              <rect x="101" y="88" width="38" height="37" />
              <path d="M75 88 L120 34 L165 88 Z" />
            </g>
          </g>
        </svg>
      </li>
    </ol>
    <div v-else class="rounded-lg border border-border p-3">
      <svg
        viewBox="0 0 360 400"
        class="mx-auto w-full max-w-md"
        role="img"
        :aria-label="$t('educationLearning.finalRobotFigure')"
        data-final-robot
      >
        <g
          v-for="piece in pieces"
          :key="piece.label"
          :transform="transform(piece)"
          :fill="fill(piece)"
          stroke="#273b4a"
          stroke-width="2"
          :data-robot-piece="piece.label"
          :data-robot-shape="piece.shape"
          role="img"
          :aria-label="
            $t('educationLearning.finalRobotPiece', {
              label: piece.label,
              feature: $t(`educationLearning.finalFeature_${piece.shape}`),
            })
          "
        >
          <g v-if="piece.shape === 'cube' || piece.shape === 'cuboid'">
            <path
              d="M5 24 H75 V95 H5 Z M5 24 L25 4 H95 L75 24 M75 95 L95 75 V4"
            />
            <path d="M75 24 V95" fill="none" />
          </g>
          <g
            v-else-if="
              piece.shape === 'cylinder' && piece.direction === 'horizontal'
            "
          >
            <path d="M15 18 H85 C99 18 99 82 85 82 H15" />
            <ellipse cx="15" cy="50" rx="10" ry="32" />
          </g>
          <g v-else-if="piece.shape === 'cylinder'">
            <path d="M18 15 V85 C18 99 82 99 82 85 V15" />
            <ellipse cx="50" cy="15" rx="32" ry="10" />
          </g>
          <g v-else>
            <circle cx="50" cy="50" r="45" />
            <path
              d="M33 22 Q14 44 27 65"
              fill="none"
              stroke="#ffffff"
              stroke-width="3"
            />
          </g>
        </g>
        <g
          data-robot-paint
          fill="#566676"
          stroke="#273b4a"
          stroke-width="2"
          :aria-label="$t('educationLearning.finalRobotPaint')"
          role="img"
        >
          <circle cx="166" cy="145" r="6" />
          <circle cx="195" cy="145" r="6" />
          <path d="M163 163 Q181 188 200 163" fill="none" />
        </g>
        <path
          v-if="visual.variant === 'review'"
          d="M80 378 H280"
          fill="none"
          stroke="hsl(var(--border))"
          stroke-width="2"
        />
      </svg>
      <p class="mt-3 text-base text-muted-foreground">
        {{ $t('educationLearning.finalRobotPaint') }}
      </p>
    </div>
    <p class="text-base leading-7 text-muted-foreground">
      {{ $t(`educationLearning.finalSolidsNotice_${visual.scene}`) }}
    </p>
  </figure>
</template>
