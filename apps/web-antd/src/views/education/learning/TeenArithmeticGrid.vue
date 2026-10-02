<script setup lang="ts">
import type { TeenArithmeticGridVisual } from './teen-arithmetic-grid';

import { computed } from 'vue';

import { $t } from '#/locales';

import {
  teenArithmeticRodState,
  teenArithmeticRows,
} from './teen-arithmetic-grid';
const props = defineProps<{ visual: TeenArithmeticGridVisual }>();
const rows = computed(() => teenArithmeticRows(props.visual.variant));
const rods = computed(() => teenArithmeticRodState(props.visual));
const singles = computed(() => rods.value.start - 10);
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{
        $t(
          visual.display === 'tables'
            ? 'educationLearning.teenArithmeticTableNotice'
            : 'educationLearning.teenArithmeticRodNotice',
        )
      }}
    </p>
    <div
      class="overflow-x-auto rounded-lg border border-border p-2"
      tabindex="0"
      :aria-label="$t('educationLearning.teenArithmeticScroll')"
    >
      <svg
        viewBox="0 0 440 240"
        :style="{ width: '440px', height: '240px' }"
        class="block text-primary"
        role="group"
        :aria-label="
          $t(
            visual.display === 'tables'
              ? 'educationLearning.teenArithmeticTable'
              : 'educationLearning.teenArithmeticRods',
          )
        "
      >
        <g v-if="visual.display === 'tables'">
          <g
            v-for="(row, index) in rows"
            :key="index"
            role="group"
            :aria-label="
              $t('educationLearning.teenArithmeticRow', { row: index + 1 })
            "
          >
            <text
              x="16"
              :y="40 + index * 52"
              font-size="20"
              fill="currentColor"
            >
              {{ row.add[0] }} + {{ row.add[1] }} = □
            </text>
            <text
              x="238"
              :y="40 + index * 52"
              font-size="20"
              fill="currentColor"
            >
              {{ row.subtract[0] }} − {{ row.subtract[1] }} = □
            </text>
          </g>
        </g>
        <g v-else>
          <text x="16" y="24" font-size="20" fill="currentColor">
            {{ rods.start }} {{ rods.operation }} {{ rods.operand }} = □
          </text>
          <g
            role="img"
            :aria-label="$t('educationLearning.teenArithmeticBundle')"
          >
            <rect
              x="28"
              y="64"
              width="18"
              height="150"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              v-for="n in 9"
              :key="n"
              :d="`M28 ${64 + n * 15} h18`"
              stroke="currentColor"
            />
          </g>
          <g
            v-for="n in singles"
            :key="n"
            role="img"
            :aria-label="$t('educationLearning.teenArithmeticSingle')"
          >
            <rect
              :x="64 + (n - 1) * 20"
              y="198"
              width="12"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              v-if="visual.display === 'take' && n > singles - rods.operand"
              :d="`M${60 + (n - 1) * 20} 220 l20 -28`"
              stroke="currentColor"
              stroke-width="2"
            />
          </g>
          <g v-if="visual.display === 'join'">
            <g
              v-for="n in rods.operand"
              :key="n"
              role="img"
              :aria-label="$t('educationLearning.teenArithmeticAdded')"
            >
              <rect
                :x="278 + (n - 1) * 20"
                y="198"
                width="12"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
            </g>
            <ellipse
              :cx="(64 + 278 + (rods.operand - 1) * 20 + 12) / 2"
              cy="206"
              :rx="(278 + (rods.operand - 1) * 20 + 12 - 64) / 2 + 8"
              ry="22"
              fill="none"
              stroke="currentColor"
              stroke-dasharray="4 3"
            />
          </g>
          <path
            v-if="visual.display === 'ten'"
            d="M20 220 L54 58"
            stroke="currentColor"
            stroke-width="2"
          />
        </g>
      </svg>
    </div>
  </div>
</template>
