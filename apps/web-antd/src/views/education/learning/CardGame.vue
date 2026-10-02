<script setup lang="ts">
import type { CardGameState, CardGameVisual } from './types';

import { computed, ref } from 'vue';

import { Button, RadioButton, RadioGroup } from 'ant-design-vue';

import { $t } from '#/locales';

import { hasTen, initialCardGame, replayCardGame } from './card-game';

const props = defineProps<{
  visual: CardGameVisual;
  state?: CardGameState;
  interactive: boolean;
}>();
const emit = defineEmits<{ change: [state: CardGameState] }>();
const error = ref(false);
const state = computed(() => props.state ?? initialCardGame());
const board = computed(() => replayCardGame(props.visual, state.value));
function update(next: CardGameState) {
  if (!props.interactive) return;
  if (!replayCardGame(props.visual, next)) {
    error.value = true;
    return;
  }
  error.value = false;
  emit('change', next);
}
function select(id: number) {
  const selected = state.value.selected.includes(id)
    ? state.value.selected.filter((n) => n !== id)
    : [...state.value.selected, id];
  update({ ...state.value, selected });
}
function draw() {
  update({
    ...state.value,
    selected: [],
    actions: [...state.value.actions, { type: 'draw' }],
  });
}
function claim() {
  update({
    ...state.value,
    selected: [],
    actions: [
      ...state.value.actions,
      {
        type: 'claim',
        player: state.value.claimer,
        ids: [...state.value.selected],
      },
    ],
  });
}
function finish() {
  update({
    ...state.value,
    selected: [],
    actions: [...state.value.actions, { type: 'finish' }],
  });
}
</script>
<template>
  <div v-if="board" class="flex min-w-0 flex-col gap-4">
    <p>
      {{
        $t(
          visual.mode === 'pair'
            ? 'educationLearning.cardPairRule'
            : 'educationLearning.cardMultiRule',
        )
      }}
    </p>
    <p>
      {{
        $t('educationLearning.cardScore', {
          first: board.scores[0],
          second: board.scores[1],
          drawn: board.draws,
        })
      }}
    </p>
    <div
      class="flex min-h-20 gap-2 overflow-x-auto p-2"
      :aria-label="$t('educationLearning.cardRow')"
    >
      <Button
        v-for="(card, index) in board.cards"
        :key="card.id"
        class="shrink-0 !h-16 !min-w-12"
        :type="state.selected.includes(card.id) ? 'primary' : 'default'"
        :aria-pressed="state.selected.includes(card.id)"
        :aria-label="
          $t('educationLearning.cardLabel', {
            position: index + 1,
            value: card.value,
          })
        "
        :disabled="!interactive || board.ended"
        @click="select(card.id)"
      >
        {{ card.value === 1 ? 'A / 1' : card.value }}
      </Button>
      <p v-if="!board.cards.length" class="text-muted-foreground">
        {{ $t('educationLearning.cardEmpty') }}
      </p>
    </div>
    <template v-if="interactive && !board.ended">
      <div class="flex flex-wrap items-center gap-3">
        <Button
          class="max-w-full !h-auto !min-h-11 !whitespace-normal"
          :disabled="board.draws >= 18"
          @click="draw"
        >
          {{
            $t('educationLearning.cardDraw', { player: (board.draws % 2) + 1 })
          }}
        </Button>
        <RadioGroup
          :value="state.claimer"
          :aria-label="$t('educationLearning.cardClaimer')"
          @update:value="(value) => update({ ...state, claimer: value })"
        >
          <RadioButton class="!h-11 !leading-[42px]" :value="0">
            {{ $t('educationLearning.cardPlayer', { player: 1 }) }}
          </RadioButton>
          <RadioButton class="!h-11 !leading-[42px]" :value="1">
            {{ $t('educationLearning.cardPlayer', { player: 2 }) }}
          </RadioButton>
        </RadioGroup>
        <Button
          type="primary"
          class="max-w-full !h-auto !min-h-11 !whitespace-normal"
          :disabled="state.selected.length < 2"
          @click="claim"
        >
          {{ $t('educationLearning.cardClaim') }}
        </Button>
        <Button
          class="max-w-full !h-auto !min-h-11 !whitespace-normal"
          :disabled="board.draws !== 18 || hasTen(board.cards, visual.mode)"
          @click="finish"
        >
          {{ $t('educationLearning.cardFinish') }}
        </Button>
      </div>
    </template>
    <p v-if="board.lastClaim" role="status">
      {{ $t('educationLearning.cardTaken', { count: board.lastClaim }) }}
    </p>
    <p v-if="error" role="alert" class="text-destructive">
      {{ $t('educationLearning.cardInvalid') }}
    </p>
    <p v-if="board.ended" role="status">
      {{
        board.scores[0] === board.scores[1]
          ? $t('educationLearning.cardTie')
          : $t('educationLearning.cardWinner', {
              player: board.scores[0] > board.scores[1] ? 1 : 2,
            })
      }}
    </p>
    <Button
      v-if="interactive"
      class="max-w-full self-start !h-auto !min-h-11 !whitespace-normal"
      @click="update(initialCardGame())"
    >
      {{ $t('educationLearning.cardRestart') }}
    </Button>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.cardNotice') }}
    </p>
  </div>
</template>
