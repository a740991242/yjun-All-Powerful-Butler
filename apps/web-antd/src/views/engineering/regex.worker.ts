/* A dedicated worker uses postMessage without a Window targetOrigin. */
/* oxlint-disable unicorn/require-post-message-target-origin */
globalThis.addEventListener(
  'message',
  (
    event: MessageEvent<{
      pattern: string;
      flags: string;
      text: string;
      replacement: string;
    }>,
  ) => {
    try {
      const { pattern, flags, text, replacement } = event.data;
      const regex = new RegExp(pattern, flags);
      const matches = [];
      let match: null | RegExpExecArray;
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          index: match.index,
          text: match[0],
          groups: match.slice(1),
          named: match.groups ?? {},
        });
        if (matches.length >= 500 || !regex.global) break;
        if (match[0] === '') {
          const point = text.codePointAt(regex.lastIndex);
          regex.lastIndex +=
            regex.unicode && point !== undefined && point > 65_535 ? 2 : 1;
        }
      }
      globalThis.postMessage({
        matches,
        replaced: text.replace(new RegExp(pattern, flags), replacement),
        truncated: matches.length >= 500,
      });
    } catch (error) {
      globalThis.postMessage({
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
);
