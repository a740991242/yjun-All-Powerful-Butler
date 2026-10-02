<script setup lang="ts">
import type { EstimateDotsState, EstimateDotsVisual } from './estimate-dots';

import { computed } from 'vue';

import { Button, FormItem, InputNumber } from 'ant-design-vue';

import { $t } from '#/locales';

import {
  estimateDots,
  estimateDotsMaximum,
  initialEstimateDots,
  isEstimateDotsState,
} from './estimate-dots';
const props = defineProps<{
  visual: EstimateDotsVisual;
  state?: EstimateDotsState;
  interactive?: boolean;
}>();
const emit = defineEmits<{ change: [state: EstimateDotsState] }>();
const dots = computed(() => estimateDots(props.visual.variant));
const current = computed(() =>
  isEstimateDotsState(props.state) &&
  props.state.variant === props.visual.variant
    ? props.state
    : initialEstimateDots(props.visual.variant),
);
function update(patch: Partial<EstimateDotsState>) {
  if (props.interactive) emit('change', { ...current.value, ...patch });
}
</script>
<template>
  <div class="space-y-4">
    <p class="text-muted-foreground">
      {{ $t('educationLearning.estimateReference') }}
    </p>
    <svg
      viewBox="0 0 300 242"
      class="mx-auto block w-full max-w-sm"
      role="group"
      :aria-label="$t('educationLearning.estimatePicture')"
    >
      <rect
        x="6"
        y="6"
        width="288"
        height="36"
        rx="8"
        fill="none"
        stroke="currentColor"
        stroke-dasharray="4 3"
      />
      <circle
        v-for="(dot, i) in dots"
        :key="i"
        :cx="dot.x"
        :cy="dot.y"
        r="7"
        fill="currentColor"
        class="text-primary"
        role="img"
        :aria-label="
          $t(
            dot.reference
              ? 'educationLearning.estimateReferenceDot'
              : 'educationLearning.estimateDot',
          )
        "
      />
    </svg>
    <div
      v-if="interactive"
      class="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <FormItem
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :label="$t('educationLearning.estimateFirst')"
        class="mb-0 min-w-0"
      >
        <InputNumber
          :value="current.estimate ?? undefined"
          :disabled="current.locked"
          :min="0"
          :max="estimateDotsMaximum(visual.variant)"
          :precision="0"
          class="min-h-11 !w-full"
          :aria-label="$t('educationLearning.estimateFirst')"
          @update:value="
            (estimate) =>
              update({
                estimate: typeof estimate === 'number' ? estimate : null,
              })
          "
        />
      </FormItem>
      <FormItem
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
        :label="$t('educationLearning.estimateCounted')"
        class="mb-0 min-w-0"
      >
        <InputNumber
          :value="current.counted ?? undefined"
          :disabled="!current.locked"
          :min="0"
          :max="estimateDotsMaximum(visual.variant)"
          :precision="0"
          class="min-h-11 !w-full"
          :aria-label="$t('educationLearning.estimateCounted')"
          @update:value="
            (counted) =>
              update({ counted: typeof counted === 'number' ? counted : null })
          "
        />
      </FormItem>
      <Button
        :disabled="current.locked || current.estimate === null"
        class="h-auto min-h-11 !whitespace-normal py-2"
        @click="update({ locked: true })"
      >
        {{ $t('educationLearning.estimateLock') }}
      </Button>
      <p class="text-muted-foreground">
        {{ $t('educationLearning.estimateKeep') }}
      </p>
    </div>
    <p v-if="current.locked" class="text-muted-foreground">
      {{ $t('educationLearning.estimateSaved', { value: current.estimate }) }}
    </p>
  </div>
</template>
