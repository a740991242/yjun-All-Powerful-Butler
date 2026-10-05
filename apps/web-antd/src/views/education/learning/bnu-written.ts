export interface BnuWrittenVisual {
  kind: 'bnu-written';
  scene:
    | 'add-final'
    | 'add-stage'
    | 'matching'
    | 'practice'
    | 'rods-add'
    | 'rods-sub'
    | 'sub-blank'
    | 'sub-final';
  variant: 'main' | 'review';
}
export interface BnuWrittenPanel {
  id: string;
  kind: 'rods' | 'written';
  operator: '' | '+' | '−';
  rows: [null | number, null | number][];
}
const scenes = new Set([
  'add-final',
  'add-stage',
  'matching',
  'practice',
  'rods-add',
  'rods-sub',
  'sub-blank',
  'sub-final',
]);
export function isBnuWrittenVisual(value: unknown): value is BnuWrittenVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 3 &&
    Object.keys(v).every((k) => ['kind', 'scene', 'variant'].includes(k)) &&
    v.kind === 'bnu-written' &&
    typeof v.scene === 'string' &&
    scenes.has(v.scene) &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
function panel(
  id: string,
  kind: BnuWrittenPanel['kind'],
  operator: BnuWrittenPanel['operator'],
  values: number[],
  result?: [null | number, null | number],
): BnuWrittenPanel {
  return {
    id,
    kind,
    operator,
    rows: values.map((value, index) =>
      index === 2 && result
        ? [...result]
        : [Math.floor(value / 10), value % 10],
    ),
  };
}
/** Fixed source and review stages. Rod scenes use only digits1–4: higher ancient rod forms are not invented by repeating strokes. */
export function bnuWrittenPanels(visual: BnuWrittenVisual): BnuWrittenPanel[] {
  if (!isBnuWrittenVisual(visual))
    throw new Error('educationLearning.invalidRecord');
  const add = visual.variant === 'main' ? [12, 31, 43] : [21, 13, 34];
  const subtract = visual.variant === 'main' ? [34, 22, 12] : [34, 13, 21];
  switch (visual.scene) {
    case 'rods-add': {
      return [panel('1', 'rods', '', add)];
    }
    case 'add-stage': {
      return [
        panel('1', 'written', '+', add, [
          null,
          visual.variant === 'main' ? 3 : 4,
        ]),
      ];
    }
    case 'add-final': {
      return [panel('1', 'written', '+', add)];
    }
    case 'rods-sub': {
      return [panel('1', 'rods', '', subtract)];
    }
    case 'sub-blank': {
      return [panel('1', 'written', '−', subtract, [null, null])];
    }
    case 'sub-final': {
      return [panel('1', 'written', '−', subtract)];
    }
    case 'matching': {
      if (visual.variant === 'main')
        return [
          panel('A', 'rods', '', [23, 21, 44]),
          panel('C', 'written', '−', [33, 21, 12]),
          panel('B', 'rods', '', [33, 21, 12]),
          panel('D', 'written', '+', [23, 21, 44]),
        ];
      return [
        panel('A', 'rods', '', [12, 21, 33]),
        panel('C', 'written', '+', [12, 21, 33]),
        panel('B', 'rods', '', [34, 13, 21]),
        panel('D', 'written', '−', [34, 13, 21]),
      ];
    }
    case 'practice': {
      const values =
        visual.variant === 'main'
          ? [
              [44, 32, 76],
              [54, 23, 31],
              [76, 23, 99],
              [68, 11, 57],
            ]
          : [
              [23, 42, 65],
              [67, 24, 43],
              [52, 36, 88],
              [89, 35, 54],
            ];
      return values.map((v, i) =>
        panel(String(i + 1), 'written', i % 2 === 0 ? '+' : '−', v, [
          null,
          null,
        ]),
      );
    }
  }
}
