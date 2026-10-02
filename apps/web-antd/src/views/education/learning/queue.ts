import type { QueueVisual } from './types';

/** An original queue of at most nine people, with an explicit front. Labels identify people,
 * never their rank; rank must be counted from the stated front.
 */
export function isQueueVisual(value: unknown): value is QueueVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const queue = value as Record<string, unknown>;
  return (
    Object.keys(queue).length === 3 &&
    queue.kind === 'queue' &&
    (queue.front === 'left' || queue.front === 'right') &&
    Array.isArray(queue.labels) &&
    queue.labels.length >= 2 &&
    queue.labels.length <= 9 &&
    queue.labels.every(
      (label) =>
        typeof label === 'string' &&
        label.length > 0 &&
        label.length <= 4 &&
        label.trim() === label &&
        !/[\r\n]/u.test(label),
    ) &&
    new Set(queue.labels).size === queue.labels.length
  );
}

export function queuePosition(queue: QueueVisual, label: string) {
  const index = queue.labels.indexOf(label);
  return (() => {
    if (index === -1) return undefined;
    return queue.front === 'left' ? index + 1 : queue.labels.length - index;
  })();
}

export function queueNeighbours(queue: QueueVisual, label: string) {
  const position = queuePosition(queue, label);
  return position === undefined
    ? undefined
    : { before: position - 1, after: queue.labels.length - position };
}
