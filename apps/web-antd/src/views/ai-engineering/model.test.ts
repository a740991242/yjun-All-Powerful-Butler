import { describe, expect, it } from 'vitest';

import { composePrompt, estimateCost } from './model';
describe('aI local tools', () => {
  it('keeps input and output prices separate and scales by request count', () => {
    const input = {
      inputTokens: 1000,
      outputTokens: 500,
      inputRate: 1,
      outputRate: 2,
      requests: 100,
    };
    expect(estimateCost(input)).toEqual({
      inputCost: 0.001,
      outputCost: 0.001,
      perRequest: 0.002,
      total: 0.2,
    });
    expect(estimateCost({ ...input, inputRate: 0, outputRate: 0 }).total).toBe(
      0,
    );
    for (const invalid of [
      { inputTokens: null },
      { requests: 0 },
      { requests: 1.5 },
      { inputRate: -1 },
      { outputRate: Infinity },
      { inputTokens: Number.NaN },
      { outputTokens: 2 ** 53 },
      { inputRate: Number.MAX_VALUE, requests: Number.MAX_SAFE_INTEGER },
    ]) {
      expect(() => estimateCost({ ...input, ...invalid })).toThrow(
        'ai.invalid',
      );
    }
  });
  it('requires an objective and preserves user content without executing templates', () => {
    const values = {
      role: ' reviewer ',
      task: '',
      context: '',
      constraints: '',
      format: '',
    };
    const labels = {
      role: 'Role',
      task: 'Task',
      context: 'Context',
      constraints: 'Constraints',
      format: 'Format',
    };
    expect(composePrompt(values, labels)).toBe('');
    expect(
      composePrompt({ ...values, task: 'Review {{code}}\nKeep $1' }, labels),
    ).toBe('## Role\nreviewer\n\n## Task\nReview {{code}}\nKeep $1');
  });
});
