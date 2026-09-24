import { ref } from 'vue';

import { message } from 'ant-design-vue';

import { $t } from '#/locales';
export function useOutput() {
  let revision = 0;
  const output = ref('');
  const error = ref('');
  const detail = ref('');
  function clear() {
    revision++;
    output.value = '';
    error.value = '';
    detail.value = '';
  }
  async function run(action: () => Promise<string> | string) {
    clear();
    const current = revision;
    try {
      const value = await action();
      if (current === revision) output.value = value;
    } catch (caughtError) {
      if (current !== revision) return;
      const text =
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError);
      error.value = text.startsWith('engineering.')
        ? text
        : 'engineering.invalid';
      detail.value = text.startsWith('engineering.') ? '' : text;
    }
  }
  return { output, error, detail, clear, run };
}
export async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    message.success($t('engineering.copied'));
  } catch {
    message.error($t('engineering.copyError'));
  }
}
export function download(name: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: 'application/json' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
