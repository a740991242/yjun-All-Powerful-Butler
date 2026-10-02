<script setup lang="ts">
import type { MathStoryVisual } from './math-story';

import { computed } from 'vue';

import { $t } from '#/locales';

import { mathStoryFacts } from './math-story';
const props = defineProps<{ visual: MathStoryVisual }>();
const facts = computed(() => mathStoryFacts(props.visual.variant));
const panels = computed(() => [
  { event: 'initial', quantity: facts.value.initial },
  { event: 'borrow', quantity: facts.value.borrowed },
  { event: 'return', quantity: facts.value.returned },
  { event: 'record', quantity: null },
]);
</script>
<template>
  <div
    role="region"
    :aria-label="$t('educationLearning.mathStoryTitle')"
    class="space-y-3"
  >
    <p class="font-medium">{{ $t('educationLearning.mathStoryTitle') }}</p>
    <p class="text-sm leading-6">
      {{ $t('educationLearning.mathStoryConditions', { shelf: facts.shelf }) }}
    </p>
    <div class="grid gap-3 sm:grid-cols-2">
      <section
        v-for="(panel, index) in panels"
        :key="panel.event"
        class="rounded-xl border border-border bg-card p-3"
        :aria-label="
          $t('educationLearning.mathStoryFrame', { frame: index + 1 })
        "
      >
        <h3 class="font-medium">
          {{ $t('educationLearning.mathStoryFrame', { frame: index + 1 }) }}
        </h3>
        <svg
          viewBox="0 0 240 125"
          class="mx-auto block w-full max-w-xs"
          aria-hidden="true"
        >
          <rect
            x="16"
            y="25"
            width="76"
            height="82"
            rx="3"
            fill="hsl(var(--muted))"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M16 66H92 M26 38V60 M38 38V60 M50 38V60 M62 38V60 M74 38V60"
            stroke="currentColor"
            stroke-width="3"
          />
          <circle
            cx="192"
            cy="34"
            r="14"
            fill="hsl(var(--card))"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M180 60Q192 50 204 60L210 100H174Z M180 68L155 82 M204 68L219 82"
            fill="hsl(var(--primary) / 0.15)"
            stroke="currentColor"
            stroke-width="2"
          />
          <template v-if="panel.event === 'borrow' || panel.event === 'return'">
            <rect
              x="110"
              y="44"
              width="28"
              height="32"
              rx="2"
              fill="hsl(var(--card))"
              stroke="currentColor"
              stroke-width="2"
            />
            <path d="M116 51H132 M116 58H132" stroke="currentColor" />
            <path
              v-if="panel.event === 'borrow'"
              d="M100 95H153L146 88M153 95L146 102"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
            <path
              v-else
              d="M153 95H100L107 88M100 95L107 102"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
            />
          </template>
          <template v-else-if="panel.event === 'record'">
            <rect
              x="109"
              y="32"
              width="42"
              height="55"
              rx="3"
              fill="hsl(var(--card))"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M118 46H140 M118 57H140 M118 68H140"
              stroke="currentColor"
              stroke-width="2"
            />
          </template>
        </svg>
        <p class="leading-7">
          {{
            $t(`educationLearning.mathStory_${panel.event}`, {
              quantity: panel.quantity,
              shelf: facts.shelf,
            })
          }}
        </p>
      </section>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ $t('educationLearning.mathStoryDrawingNotice') }}
    </p>
  </div>
</template>
