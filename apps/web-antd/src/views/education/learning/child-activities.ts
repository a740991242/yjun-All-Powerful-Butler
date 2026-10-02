import type { ChildActivitiesVisual } from './types';
export type ChildActivity = 'football' | 'hoop' | 'rope' | 'run';
export type ShirtColor = 'blue' | 'green' | 'red';
export interface ActivityChild {
  id: string;
  activity: ChildActivity;
  color: ShirtColor;
}
export const childActivityKinds: ChildActivity[] = [
  'run',
  'football',
  'rope',
  'hoop',
];
export const shirtColors: ShirtColor[] = ['red', 'blue', 'green'];
export function activityChildren(review: boolean): ActivityChild[] {
  const pairs: [ChildActivity, ShirtColor][] = review
    ? [
        ['rope', 'green'],
        ['football', 'red'],
        ['run', 'blue'],
        ['hoop', 'green'],
        ['rope', 'green'],
        ['run', 'green'],
        ['hoop', 'red'],
        ['rope', 'blue'],
        ['football', 'green'],
        ['run', 'green'],
        ['hoop', 'blue'],
        ['rope', 'red'],
      ]
    : [
        ['run', 'red'],
        ['football', 'blue'],
        ['rope', 'green'],
        ['hoop', 'red'],
        ['run', 'blue'],
        ['football', 'red'],
        ['rope', 'red'],
        ['run', 'green'],
        ['hoop', 'blue'],
        ['football', 'green'],
        ['rope', 'blue'],
        ['run', 'red'],
      ];
  return pairs.map(([activity, color], i) => ({
    id: String.fromCodePoint(65 + i),
    activity,
    color,
  }));
}
export function childActivitiesModel(review: boolean): ChildActivitiesVisual {
  return { kind: 'child-activities', variant: review ? 'review' : 'main' };
}
export function isChildActivitiesVisual(
  value: unknown,
): value is ChildActivitiesVisual {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return (
    Object.keys(v).length === 2 &&
    v.kind === 'child-activities' &&
    (v.variant === 'main' || v.variant === 'review')
  );
}
