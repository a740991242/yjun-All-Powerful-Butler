<script setup lang="ts">
import { computed, ref } from 'vue';

import { Alert, Button, Select, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

import { caterpillarTurn } from './bnu-caterpillar';
const current = ref(0);
const card = ref(4);
const turns = ref<NonNullable<ReturnType<typeof caterpillarTurn>>[]>([]);
const options = Array.from({ length: 8 }, (_, n) => ({
  value: n + 1,
  label: String(n + 1),
}));
const filled = computed(() => Math.min(current.value, 10));
function play() {
  const turn = caterpillarTurn(current.value, card.value);
  if (!turn) return;
  current.value = turn.after;
  turns.value = [...turns.value, turn];
}
function reset() {
  current.value = 0;
  card.value = 4;
  turns.value = [];
}
</script>
<template>
  <section
    class="caterpillar-tool flex flex-col gap-4 text-xl leading-8"
    :aria-label="$t('educationLearning.caterpillarTitle')"
  >
    <Alert :message="$t('educationLearning.caterpillarNotice')" type="info" />
    <p class="text-xl" aria-live="polite">
      {{ $t('educationLearning.caterpillarCount', { number: current }) }}
    </p>
    <div
      class="flex flex-wrap gap-2"
      :aria-label="$t('educationLearning.caterpillarBody')"
    >
      <span
        v-for="n in 10"
        :key="n"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-border text-xl"
        :class="n <= filled ? 'bg-primary text-primary-foreground' : 'bg-card'"
      >
        {{ n <= filled ? '●' : '○' }}
      </span>
    </div>
    <Tag
      v-if="current > 10"
      color="orange"
      class="!whitespace-normal !text-xl !leading-8"
    >
      {{
        $t('educationLearning.caterpillarOverflow', { number: current - 10 })
      }}
    </Tag>
    <Alert
      v-if="current === 10"
      type="success"
      :message="$t('educationLearning.caterpillarSuccess')"
    />
    <p v-else>
      {{
        $t(
          current > 10
            ? 'educationLearning.caterpillarTake'
            : 'educationLearning.caterpillarAdd',
        )
      }}
    </p>
    <div class="flex flex-wrap items-end gap-3">
      <div class="flex flex-col gap-2">
        <label for="bnu-caterpillar-card">
          {{ $t('educationLearning.caterpillarCard') }}
        </label>
        <Select
          id="bnu-caterpillar-card"
          v-model:value="card"
          :options="options"
          :disabled="current === 10"
          class="w-28"
        >
          <template #option="{ label }">
            <span class="inline-flex min-h-11 items-center text-xl">
              {{ label }}
            </span>
          </template>
        </Select>
      </div>
      <Button
        class="!min-h-11 !h-auto !whitespace-normal !py-2 !text-xl"
        type="primary"
        :disabled="current === 10"
        @click="play"
      >
        {{ $t('educationLearning.caterpillarPlay') }}
      </Button>
      <Button
        class="!min-h-11 !h-auto !whitespace-normal !py-2 !text-xl"
        @click="reset"
      >
        {{ $t('educationLearning.caterpillarReset') }}
      </Button>
    </div>
    <ol
      v-if="turns.length > 0"
      class="flex flex-col gap-2"
      :aria-label="$t('educationLearning.caterpillarHistory')"
    >
      <li v-for="(turn, index) in turns" :key="index">
        {{ index + 1 }}. {{ turn.before }}
        {{ turn.action === 'add' ? '+' : '−' }} {{ turn.card }} =
        {{ turn.after }}
      </li>
    </ol>
  </section>
</template>

<style scoped>
.caterpillar-tool :deep(.ant-select-selector) {
  height: 44px;
}

.caterpillar-tool :deep(.ant-select-selection-item) {
  font-size: 20px;
  line-height: 42px;
}

.caterpillar-tool :deep(.ant-alert-message) {
  font-size: 20px;
  line-height: 32px;
}
</style>
