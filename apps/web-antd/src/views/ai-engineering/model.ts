export const promptFields = [
  'role',
  'task',
  'context',
  'constraints',
  'format',
] as const;
export type PromptField = (typeof promptFields)[number];
export type Prompt = Record<PromptField, string>;
export function composePrompt(values: Prompt, labels: Prompt): string {
  if (!values.task.trim()) return '';
  return promptFields
    .filter((key) => values[key].trim())
    .map((key) => `## ${labels[key]}\n${values[key].trim()}`)
    .join('\n\n');
}
export type CostInput = Record<
  'inputRate' | 'inputTokens' | 'outputRate' | 'outputTokens' | 'requests',
  null | number
>;
export function estimateCost(input: CostInput) {
  for (const [key, value] of Object.entries(input)) {
    if (
      value === null ||
      !Number.isFinite(value) ||
      value < 0 ||
      (['inputTokens', 'outputTokens', 'requests'].includes(key) &&
        !Number.isSafeInteger(value))
    )
      throw new Error('ai.invalid');
  }
  const { inputTokens, outputTokens, inputRate, outputRate, requests } = input;
  if (
    inputTokens === null ||
    outputTokens === null ||
    inputRate === null ||
    outputRate === null ||
    requests === null ||
    requests < 1
  )
    throw new Error('ai.invalid');
  const inputCost = (inputTokens / 1_000_000) * inputRate;
  const outputCost = (outputTokens / 1_000_000) * outputRate;
  const perRequest = inputCost + outputCost;
  const total = perRequest * requests;
  if (!Number.isFinite(total)) throw new Error('ai.invalid');
  return { inputCost, outputCost, perRequest, total };
}
export const workflows = [
  'assistant',
  'rag',
  'automation',
  'evaluation',
] as const;
