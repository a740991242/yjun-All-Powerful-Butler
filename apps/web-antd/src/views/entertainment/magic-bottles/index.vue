<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { useElementSize, useFullscreen } from '@vueuse/core';
import { Alert, Button, message, Space, Spin } from 'ant-design-vue';

import { $t } from '#/locales';

defineOptions({ name: 'MagicBottles' });

const GAME_URL = 'https://a740991242.github.io/yjun-color-water-sort-game/';
const container = ref<HTMLElement>();
const viewport = ref<HTMLElement>();
const { height, width } = useElementSize(viewport);
// 游戏自身在矮视口中会遮住底排瓶子，保留至少 640px 逻辑高度并等比缩放。
const frameStyle = computed(() => {
  const scale = Math.min(1, height.value / 640) || 1;
  return {
    height: `${height.value / scale}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    width: `${width.value / scale}px`,
  };
});
const frameKey = ref(0);
const loading = ref(true);
const slowLoading = ref(false);
const { isFullscreen, isSupported, toggle } = useFullscreen(container);
let loadingTimer: ReturnType<typeof setTimeout> | undefined;

function startLoading() {
  clearTimeout(loadingTimer);
  loading.value = true;
  slowLoading.value = false;
  loadingTimer = setTimeout(() => {
    loading.value = false;
    slowLoading.value = true;
  }, 20_000);
}

function handleLoad() {
  clearTimeout(loadingTimer);
  loading.value = false;
  slowLoading.value = false;
}

function reloadGame() {
  startLoading();
  frameKey.value += 1;
}

async function toggleFullscreen() {
  try {
    await toggle();
  } catch {
    message.info($t('tools.game.fullscreenError'));
  }
}

startLoading();
onUnmounted(() => clearTimeout(loadingTimer));
</script>

<template>
  <Page auto-content-height>
    <section
      ref="container"
      class="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card"
      :aria-label="$t('tools.game.region')"
    >
      <div
        class="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3"
      >
        <div class="flex items-center gap-2">
          <IconifyIcon
            icon="lucide:flask-conical"
            class="size-5 text-primary"
          />
          <h1 class="text-base font-semibold">{{ $t('tools.menu.game') }}</h1>
          <span class="hidden text-sm text-muted-foreground sm:inline">{{
            $t('tools.game.tagline')
          }}</span>
        </div>
        <Space wrap>
          <Button @click="reloadGame">
            <template #icon><IconifyIcon icon="lucide:rotate-cw" /></template>
            {{ $t('tools.game.reload') }}
          </Button>
          <Button :href="GAME_URL" target="_blank" rel="noopener noreferrer">
            <template #icon>
              <IconifyIcon icon="lucide:external-link" />
            </template>
            {{ $t('tools.game.open') }}
          </Button>
          <Button v-if="isSupported" type="primary" @click="toggleFullscreen">
            <template #icon>
              <IconifyIcon
                :icon="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'"
              />
            </template>
            {{
              isFullscreen ? $t('tools.game.exit') : $t('tools.game.fullscreen')
            }}
          </Button>
        </Space>
      </div>
      <Alert
        v-if="slowLoading"
        class="m-3"
        type="info"
        show-icon
        :message="$t('tools.game.slow')"
        closable
        @close="slowLoading = false"
      />
      <div ref="viewport" class="relative min-h-0 flex-1 overflow-hidden">
        <iframe
          :key="frameKey"
          :src="GAME_URL"
          :style="frameStyle"
          :title="$t('tools.game.frameTitle')"
          class="block size-full border-0"
          allow="autoplay; fullscreen"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
          @load="handleLoad"
        ></iframe>
        <div
          v-if="loading"
          class="pointer-events-none absolute inset-0 flex items-center justify-center bg-card/90"
          role="status"
          :aria-label="$t('tools.game.loadingLabel')"
        >
          <Spin size="large" />
          <span class="ml-3 text-muted-foreground">{{
            $t('tools.game.loading')
          }}</span>
        </div>
      </div>
    </section>
  </Page>
</template>
