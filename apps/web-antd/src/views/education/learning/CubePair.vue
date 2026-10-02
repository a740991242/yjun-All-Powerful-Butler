<script setup lang="ts">
import type { CubePairVisual } from './cube-pair';

import { computed } from 'vue';

import { $t } from '#/locales';

import { cubePairData, cubePairJoin } from './cube-pair';
import CubePairDiagram from './CubePairDiagram.vue';
import { required } from './required';
const props = defineProps<{ visual: CubePairVisual }>();
const data = computed(() => cubePairData(props.visual.variant));
const pair = computed(() => {
  if (props.visual.display === 'candidates') return null;
  const ids = props.visual.display.slice(-2).toUpperCase();
  return { first: required(ids[0]), second: required(ids[1]) };
});
const joined = computed(() =>
  pair.value
    ? required(
        cubePairJoin(props.visual.variant, pair.value.first, pair.value.second),
      )
    : null,
);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" data-cube-pair>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.cubePairInstruction') }}
    </p>
    <section class="rounded-lg border border-border p-3" data-cube-pair-target>
      <h4 class="font-medium">{{ $t('educationLearning.cubePairTarget') }}</h4>
      <CubePairDiagram
        :groups="[data.target]"
        :label="$t('educationLearning.cubePairTargetLabel')"
      />
    </section>
    <div
      v-if="!joined"
      class="grid gap-3 sm:grid-cols-2"
      data-cube-pair-candidates
    >
      <section
        v-for="group in data.groups"
        :key="group.id"
        class="min-w-0 rounded-lg border border-border p-3"
        :data-candidate="group.id"
      >
        <h4 class="font-medium">
          {{ $t('educationLearning.cubePairGroup', { id: group.id }) }}
        </h4>
        <CubePairDiagram
          :groups="[group.cells]"
          :label="$t('educationLearning.cubePairGroupLabel', { id: group.id })"
        />
      </section>
    </div>
    <section
      v-else-if="joined && pair"
      class="rounded-lg border border-border p-3"
      data-cube-pair-joined
    >
      <h4 class="font-medium">
        {{
          $t('educationLearning.cubePairJoined', {
            first: pair.first,
            second: pair.second,
          })
        }}
      </h4>
      <CubePairDiagram
        :groups="joined"
        :label="
          $t('educationLearning.cubePairJoinedLabel', {
            first: pair.first,
            second: pair.second,
          })
        "
      />
      <p class="text-sm leading-6">
        {{ $t('educationLearning.cubePairJoinNotice') }}
      </p>
    </section>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.cubePairPhysicalNotice') }}
    </p>
  </div>
</template>
