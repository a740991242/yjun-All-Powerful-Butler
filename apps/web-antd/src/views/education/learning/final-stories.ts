export interface FinalStoriesVisual {
  kind: 'final-stories';
  scene:
    | 'books'
    | 'bottles'
    | 'fruit'
    | 'garden'
    | 'one-kind'
    | 'playground'
    | 'rabbits';
  variant: 'main' | 'review';
}
export type FinalStoryItem =
  | 'bird'
  | 'book'
  | 'bottle'
  | 'bun'
  | 'cake'
  | 'child'
  | 'duck'
  | 'fruit'
  | 'rabbit';
export interface FinalStoryGroup {
  label: string;
  item: FinalStoryItem;
  count: number;
  marked: number;
}
export function finalStoryGroups(model: FinalStoriesVisual): FinalStoryGroup[] {
  const r = model.variant === 'review';
  const g = (
    label: string,
    item: FinalStoryItem,
    count: number,
    marked = 0,
  ): FinalStoryGroup => ({ label, item, count, marked });
  switch (model.scene) {
    case 'fruit': {
      return [g('left', 'fruit', r ? 4 : 2), g('right', 'fruit', r ? 3 : 5)];
    }
    case 'books': {
      return [g('upper', 'book', r ? 3 : 4), g('lower', 'book', r ? 5 : 6)];
    }
    case 'bottles': {
      return [g('originalTaken', 'bottle', r ? 5 : 4, r ? 2 : 1)];
    }
    case 'rabbits': {
      return [g('originalLeft', 'rabbit', r ? 9 : 10, r ? 3 : 4)];
    }
    case 'playground': {
      return [
        g('originalChildren', 'child', r ? 4 : 5),
        g('arrivingChildren', 'child', r ? 5 : 3),
      ];
    }
    case 'one-kind': {
      return [
        g('cakesEaten', 'cake', r ? 7 : 6, r ? 2 : 3),
        g('otherBuns', 'bun', r ? 3 : 4),
      ];
    }
    case 'garden': {
      return [
        g('water', 'duck', r ? 2 : 4),
        g('grass', 'duck', r ? 4 : 3),
        g('carrots', 'rabbit', 3),
        g('field', 'rabbit', r ? 3 : 2),
        g('perched', 'bird', r ? 4 : 3),
        g('flew', 'bird', 2),
      ];
    }
  }
}
export function isFinalStoriesVisual(
  value: unknown,
): value is FinalStoriesVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const m = value as Record<string, unknown>;
  return (
    Object.keys(m).length === 3 &&
    m.kind === 'final-stories' &&
    (m.variant === 'main' || m.variant === 'review') &&
    typeof m.scene === 'string' &&
    [
      'books',
      'bottles',
      'fruit',
      'garden',
      'one-kind',
      'playground',
      'rabbits',
    ].includes(m.scene)
  );
}
