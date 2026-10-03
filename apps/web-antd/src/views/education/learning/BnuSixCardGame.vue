<script setup lang="ts">
import { computed, ref } from 'vue';

import { Alert, Button } from 'ant-design-vue';

import { $t } from '#/locales';

import {
  drawSixCard,
  newSixCardRound,
  sixCardStatus,
  sixCardTotal,
  stopSixCard,
} from './bnu-six-card-game';
const round = ref(newSixCardRound());
const total = computed(() => sixCardTotal(round.value));
const status = computed(() => sixCardStatus(round.value));
function draw() {
  const next = drawSixCard(
    round.value,
    Math.floor(Math.random() * round.value.deck.length),
  );
  if (next) round.value = next;
}
function stop() {
  round.value = stopSixCard(round.value);
}
function reset() {
  round.value = newSixCardRound();
}
</script>
<template>
  <section
    class="six-card-tool flex flex-col gap-4 text-xl leading-8"
    :aria-label="$t('educationLearning.sixCardTitle')"
  >
    <Alert type="info" :message="$t('educationLearning.sixCardNotice')" />
    <p aria-live="polite">
      {{
        $t('educationLearning.sixCardSummary', {
          count: round.hand.length,
          total,
        })
      }}
    </p>
    <p>
      {{
        $t('educationLearning.sixCardRemaining', { count: round.deck.length })
      }}
    </p>
    <ol
      v-if="round.hand.length"
      class="flex flex-wrap gap-3"
      :aria-label="$t('educationLearning.sixCardHand')"
    >
      <li
        v-for="(card, index) in round.hand"
        :key="card.id"
        class="flex min-h-20 min-w-16 flex-col items-center justify-center rounded-lg border border-border bg-card p-3"
      >
        <span class="text-xl text-muted-foreground">
          {{ $t('educationLearning.sixCardOrdinal', { number: index + 1 }) }}
        </span>
        <span class="text-3xl">{{ card.value }}</span>
      </li>
    </ol>
    <Alert
      v-if="status === 'out'"
      type="warning"
      :message="$t('educationLearning.sixCardOut')"
    />
    <Alert
      v-else-if="status === 'finished'"
      type="success"
      :message="$t('educationLearning.sixCardFinished')"
    />
    <p v-else>{{ $t('educationLearning.sixCardActive') }}</p>
    <div class="flex flex-wrap gap-3">
      <Button
        class="!h-auto !min-h-11 !whitespace-normal !py-2 !text-xl"
        type="primary"
        :disabled="status !== 'active'"
        @click="draw"
      >
        {{ $t('educationLearning.sixCardDraw') }}
      </Button>
      <Button
        class="!h-auto !min-h-11 !whitespace-normal !py-2 !text-xl"
        :disabled="status !== 'active'"
        @click="stop"
      >
        {{ $t('educationLearning.sixCardStop') }}
      </Button>
      <Button
        class="!h-auto !min-h-11 !whitespace-normal !py-2 !text-xl"
        @click="reset"
      >
        {{ $t('educationLearning.sixCardReset') }}
      </Button>
    </div>
  </section>
</template>
<style scoped>
.six-card-tool :deep(.ant-alert-message) {
  font-size: 20px;
  line-height: 32px;
}
</style>
