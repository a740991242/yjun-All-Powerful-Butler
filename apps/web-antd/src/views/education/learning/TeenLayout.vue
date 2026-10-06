<script setup lang="ts">
import type { TeenLayoutVisual } from './teen-layout';

import { computed } from 'vue';

import { $t } from '#/locales';

import { teenLayoutPoints, teenRooms } from './teen-layout';
const props = defineProps<{ visual: TeenLayoutVisual }>();
const points = computed(() => teenLayoutPoints(props.visual));
const rooms = computed(() => teenRooms(props.visual.variant));
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3">
    <p class="text-sm text-muted-foreground">
      {{
        $t(
          visual.display === 'rooms'
            ? 'educationLearning.teenRoomNotice'
            : 'educationLearning.teenDotNotice',
        )
      }}
    </p>
    <div
      class="overflow-x-auto rounded-lg border border-border p-2"
      tabindex="0"
      :aria-label="$t('educationLearning.teenLayoutScroll')"
    >
      <svg
        viewBox="0 0 360 220"
        :style="{ width: '360px', height: '220px' }"
        class="block text-primary"
        role="group"
        :aria-label="$t(`educationLearning.teenLayout_${visual.display}`)"
      >
        <g v-if="visual.display !== 'rooms'">
          <circle
            v-for="(p, index) in points"
            :key="index"
            :cx="p.x"
            :cy="p.y"
            r="7"
            :fill="visual.display === 'triangle' ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            role="img"
            :aria-label="
              $t('educationLearning.teenDotLabel', {
                row: p.row,
                column: p.column,
              })
            "
          />
        </g>
        <g v-else>
          <g
            v-for="room in rooms"
            :key="room.number"
            role="group"
            :aria-label="
              $t('educationLearning.teenRoomLabel', {
                row: $t(`educationLearning.teenRoom_${room.row}`),
                column: room.column,
                label: room.visible
                  ? String(room.number)
                  : $t('educationLearning.teenRoomBlank'),
                guest: room.guest ?? '',
              })
            "
          >
            <rect
              :x="room.x"
              :y="room.y"
              width="28"
              height="64"
              rx="3"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <text
              v-if="room.guest"
              :x="room.x + 14"
              :y="room.y + 24"
              text-anchor="middle"
              font-size="22"
              fill="currentColor"
            >
              {{ room.guest }}
            </text>
            <text
              :x="room.x + 14"
              :y="room.y + 52"
              text-anchor="middle"
              font-size="22"
              fill="currentColor"
            >
              {{ room.visible ? room.number : '□' }}
            </text>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>
