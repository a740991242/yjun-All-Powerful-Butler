<script setup lang="ts">
import type { BnuBuildingVisual } from './bnu-building';

import { computed } from 'vue';

import { $t } from '#/locales';

import { bnuBuildingLayers } from './bnu-building';
import SolidGlyph from './SolidGlyph.vue';
const props = defineProps<{ visual: BnuBuildingVisual }>();
const layers = computed(() => bnuBuildingLayers(props.visual));
</script>
<template>
  <section
    class="flex min-w-0 flex-col gap-4 text-xl leading-8"
    data-bnu-building
    :data-building-scene="visual.scene"
    :aria-label="$t('educationLearning.bnuBuildingTitle')"
  >
    <p>{{ $t('educationLearning.bnuBuildingNotice') }}</p>
    <p class="font-medium">
      {{ $t(`educationLearning.bnuBuildingScene_${visual.scene}`) }}
    </p>
    <div
      v-for="layer in layers"
      :key="layer.level"
      class="rounded-lg border border-border p-3"
      :data-building-level="layer.level"
    >
      <h4 class="mb-3 font-medium">
        {{ $t('educationLearning.bnuBuildingLevel', { level: layer.level }) }}
      </h4>
      <div
        class="grid gap-3"
        :class="layer.pieces.length === 2 ? 'grid-cols-2' : 'grid-cols-1'"
      >
        <div
          v-for="piece in layer.pieces"
          :key="piece.label"
          class="flex min-w-0 flex-col items-center gap-2 rounded-lg border border-border bg-card p-2"
          :data-building-label="piece.label"
          :data-building-shape="piece.shape"
        >
          <p>
            {{ piece.label }} ·
            {{ $t(`educationLearning.bnuBuildingSide_${piece.side}`) }}
          </p>
          <svg
            viewBox="0 0 240 180"
            class="h-24 w-32 max-w-full text-primary"
            role="img"
            :aria-label="
              $t('educationLearning.bnuBuildingPiece', {
                label: piece.label,
                shape: $t(`educationLearning.shape_${piece.shape}`),
                placement: $t(
                  piece.upright
                    ? 'educationLearning.bnuBuildingUpright'
                    : 'educationLearning.bnuBuildingShown',
                ),
              })
            "
          >
            <g
              :transform="
                piece.upright
                  ? 'translate(120 85) rotate(-90) scale(0.7) translate(-120 -85)'
                  : undefined
              "
            >
              <SolidGlyph :shape="piece.shape" />
            </g>
          </svg>
          <p v-if="piece.upright" class="text-center">
            {{ $t('educationLearning.bnuBuildingUpright') }}
          </p>
        </div>
      </div>
    </div>
    <p>{{ $t('educationLearning.bnuBuildingGround') }}</p>
  </section>
</template>
