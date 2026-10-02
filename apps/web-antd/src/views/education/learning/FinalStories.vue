<script setup lang="ts">
import type { FinalStoriesVisual } from './final-stories';

import { computed } from 'vue';

import { Card } from 'ant-design-vue';

import { $t } from '#/locales';

import { finalStoryGroups } from './final-stories';
const props = defineProps<{ visual: FinalStoriesVisual }>();
const groups = computed(() => finalStoryGroups(props.visual));
</script>
<template>
  <div class="flex min-w-0 flex-col gap-3" data-final-stories>
    <p class="text-sm leading-6 text-muted-foreground">
      {{ $t('educationLearning.finalStoriesNotice') }}
    </p>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Card
        v-for="group in groups"
        :key="group.label"
        size="small"
        :data-story-group="group.label"
      >
        <template #title>
          <h3 class="whitespace-normal break-words leading-6">
            {{ $t(`educationLearning.finalStoryGroup_${group.label}`) }}
          </h3>
        </template>
        <svg
          :viewBox="`0 0 360 ${Math.ceil(group.count / 6) * 52 + 16}`"
          class="mx-auto block w-full max-w-sm text-primary"
          role="group"
          :aria-label="$t(`educationLearning.finalStoryGroup_${group.label}`)"
        >
          <g
            v-for="n in group.count"
            :key="n"
            :transform="`translate(${30 + ((n - 1) % 6) * 52} ${30 + Math.floor((n - 1) / 6) * 52})`"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
            fill="hsl(var(--primary) / 0.14)"
            role="img"
            :aria-label="
              $t('educationLearning.finalStoryObject', {
                position: n,
                item: $t(`educationLearning.finalStoryItem_${group.item}`),
                state: $t(
                  n <= group.marked
                    ? 'educationLearning.finalStoryMarked'
                    : 'educationLearning.finalStoryPresent',
                ),
              })
            "
            data-story-object
            :data-story-marked="n <= group.marked"
          >
            <g v-if="group.item === 'fruit'">
              <circle r="15" cy="3" />
              <path d="M0 -12V-18 M0 -15Q14 -24 12 -12Q7 -8 0 -15" />
            </g>
            <g v-else-if="group.item === 'book'">
              <rect x="-17" y="-19" width="34" height="38" rx="3" />
              <path d="M-10 -19V19 M-5 -8H10 M-5 0H10" />
            </g>
            <path
              v-else-if="group.item === 'bottle'"
              d="M-7 -19H7V-10L13 -5V19H-13V-5L-7 -10Z M-7 -14H7 M-13 6H13"
            />
            <g v-else-if="group.item === 'rabbit'">
              <ellipse cx="-7" cy="-11" rx="4" ry="11" />
              <ellipse cx="7" cy="-11" rx="4" ry="11" />
              <ellipse cy="7" rx="16" ry="13" />
              <circle cx="-5" cy="5" r="1" fill="currentColor" />
              <circle cx="5" cy="5" r="1" fill="currentColor" />
              <path d="M-3 11H3" />
            </g>
            <g v-else-if="group.item === 'child'">
              <circle cy="-13" r="7" />
              <path d="M0 -6V9 M-13 1H13 M0 9L-10 20 M0 9L10 20" fill="none" />
            </g>
            <g v-else-if="group.item === 'cake'">
              <rect x="-17" y="-8" width="34" height="27" />
              <path
                d="M-17 5H17 M-17 -8Q-12 -18 -7 -8Q-2 -18 3 -8Q8 -18 13 -8H17"
              />
            </g>
            <g v-else-if="group.item === 'bun'">
              <ellipse cy="4" rx="18" ry="14" />
              <path d="M-8 -2L-3 3 M2 -5L7 0" />
            </g>
            <g v-else-if="group.item === 'duck'">
              <ellipse cx="-2" cy="10" rx="17" ry="10" />
              <circle cx="8" cy="-6" r="10" />
              <path d="M17 -8L24 -3L17 0 M-6 7Q3 1 7 9" />
              <circle cx="10" cy="-8" r="1" fill="currentColor" />
            </g>
            <g v-else>
              <ellipse cy="7" rx="16" ry="10" />
              <circle cx="11" cy="-4" r="8" />
              <path d="M18 -6L24 -2L18 1 M-4 7L-19 -10L3 0 M-13 12L-22 17" />
              <circle cx="12" cy="-6" r="1" fill="currentColor" />
            </g>
            <path
              v-if="n <= group.marked"
              d="M-22 -22L22 22 M-22 22L22 -22"
              class="text-destructive"
              stroke="currentColor"
              stroke-width="3"
              fill="none"
              data-story-cross
            />
          </g>
        </svg>
      </Card>
    </div>
    <p class="text-sm leading-6 text-muted-foreground">
      {{
        $t(
          visual.scene === 'garden'
            ? 'educationLearning.finalStoriesGardenCondition'
            : visual.scene === 'playground'
              ? 'educationLearning.finalStoriesArrivingCondition'
              : 'educationLearning.finalStoriesCountCondition',
        )
      }}
    </p>
  </div>
</template>
