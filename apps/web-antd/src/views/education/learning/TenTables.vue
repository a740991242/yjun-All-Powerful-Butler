<script setup lang="ts">
import type { TenTablesVisual } from './ten-tables';

import { computed } from 'vue';

import { $t } from '#/locales';

import { tenArithmeticRows, tenTableRows, tenTableSymbols } from './ten-tables';
const props = defineProps<{ visual: TenTablesVisual }>();
const rows = computed(() => tenTableRows(props.visual));
const arithmetic = computed(() => tenArithmeticRows(props.visual));
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" data-ten-tables>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.tenTablesNotice') }}
    </p>
    <template v-if="visual.display !== 'add-sub'">
      <div
        class="overflow-x-auto pb-2"
        tabindex="0"
        :aria-label="$t('educationLearning.tenTablesScroll')"
        data-ten-table-scroll
      >
        <div class="flex w-max flex-col gap-3">
          <div
            v-for="(left, i) in rows"
            :key="i"
            class="flex items-center gap-3"
            :data-ten-table-row="i + 1"
          >
            <span class="w-16 shrink-0 text-sm">
              {{ $t('educationLearning.tenTablesRow', { row: i + 1 }) }}
            </span>
            <svg
              viewBox="0 0 360 60"
              class="h-16 w-96 shrink-0 text-primary"
              role="img"
              :aria-label="
                $t('educationLearning.tenTablesDiagram', {
                  row: i + 1,
                  symbols: tenTableSymbols(left),
                })
              "
              data-ten-table-diagram
            >
              <path
                v-if="visual.display === 'five-chains'"
                d="M4 30 H356"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <g
                v-for="n in 10"
                :key="n"
                :data-ten-table-group="n <= left ? 'A' : 'B'"
              >
                <circle
                  :cx="18 + (n - 1) * 36"
                  cy="30"
                  r="13"
                  :fill="n <= left ? 'currentColor' : 'hsl(var(--card))'"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle
                  v-if="n > left"
                  :cx="18 + (n - 1) * 36"
                  cy="30"
                  r="8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1"
                />
              </g>
            </svg>
            <span
              v-if="visual.display === 'nine-rows'"
              class="shrink-0 font-mono"
            >
              {{ left }} + □ = □
            </span>
          </div>
        </div>
      </div>
      <p class="text-sm leading-6 text-muted-foreground">
        {{ $t('educationLearning.tenTablesLegend') }}
      </p>
    </template>
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <section class="rounded-lg border border-border p-3" data-ten-add-table>
        <p class="mb-2 font-medium">
          {{ $t('educationLearning.tenTablesAdd') }}
        </p>
        <p
          v-for="(n, i) in arithmetic.add"
          :key="i"
          class="py-2 font-mono"
          :data-ten-equation="i + 1"
        >
          {{ n }} + □ = 10
        </p>
      </section>
      <section class="rounded-lg border border-border p-3" data-ten-sub-table>
        <p class="mb-2 font-medium">
          {{ $t('educationLearning.tenTablesSubtract') }}
        </p>
        <p
          v-for="(n, i) in arithmetic.subtract"
          :key="i"
          class="py-2 font-mono"
          :data-ten-equation="i + 1"
        >
          10 − {{ n }} = □
        </p>
      </section>
    </div>
  </div>
</template>
