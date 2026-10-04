import { describe, expect, it } from 'vitest';

import { bnuLowerBook, bnuLowerSource } from './bnu-lower';
import { bnuLowerUnitTwoAudit } from './bnu-lower-unit-two-audit';

describe('bnu lower unit two source-to-task audit', () => {
  it('covers printed pages 18–23 without claiming the rest of the book or teacher review', () => {
    expect(bnuLowerUnitTwoAudit.source).toBe(bnuLowerSource.secondUnitPreview);
    expect(bnuLowerUnitTwoAudit.resourceId).toBe('bnu-lower-public-scan-2024');
    expect(bnuLowerUnitTwoAudit.finalTeacherReview).toBe('not-verified');
    expect(bnuLowerSource.isbn).toBeNull();
    expect(bnuLowerSource.printing).toBeNull();
    const pages = Array.from({ length: 6 }, (_, i) => i + 18);
    expect([
      ...new Set(bnuLowerUnitTwoAudit.activities.map((a) => a.page)),
    ]).toEqual(pages);
    expect(
      pages.map(
        (page) =>
          bnuLowerUnitTwoAudit.activities.filter((a) => a.page === page).length,
      ),
    ).toEqual([2, 3, 3, 5, 2, 3]);
    for (const page of pages)
      expect(bnuLowerSource.readPrintedPages).toContain(page);
    expect(bnuLowerUnitTwoAudit.scope).toContain('不证明后续单元、全册、全年');
  });

  it('anchors each original activity to real steps and separately typed task IDs', () => {
    const unit = bnuLowerBook.units.find(
      (u) => u.id === bnuLowerUnitTwoAudit.unit,
    );
    if (!unit) throw new Error('Missing BNU lower second unit');
    const sourceKeys = new Set<string>();
    const represented = new Map<string, Set<string>>();
    for (const activity of bnuLowerUnitTwoAudit.activities) {
      const key = `${activity.page}:${activity.sourceActivity}`;
      expect(sourceKeys.has(key), key).toBe(false);
      sourceKeys.add(key);
      expect(activity.scope.length).toBeGreaterThan(0);
      expect(activity.boundary.length).toBeGreaterThan(0);
      const lesson = unit.lessons.find((l) => l.id === activity.lesson);
      if (!lesson) throw new Error(`Missing audit lesson ${activity.lesson}`);
      expect(lesson.status).toBe('available');
      for (const step of activity.steps) {
        expect(Number.isInteger(step)).toBe(true);
        expect(step).toBeGreaterThan(0);
        expect(step).toBeLessThanOrEqual(lesson.steps.length);
      }
      const ids = represented.get(lesson.id) || new Set<string>();
      for (const kind of ['objective', 'manual', 'records'] as const) {
        const suffixes: readonly string[] = activity[kind];
        expect(new Set(suffixes).size).toBe(suffixes.length);
        for (const suffix of suffixes) {
          const id = `${lesson.id}-${suffix}`;
          const task = lesson.questions.find((q) => q.id === id);
          if (!task) throw new Error(`Dangling source activity ${key}: ${id}`);
          if (kind === 'manual') expect(task.rule.kind, id).toBe('manual');
          else if (kind === 'records')
            expect(task.rule.kind, id).toBe('reflection');
          else
            expect(['manual', 'reflection'], id).not.toContain(task.rule.kind);
          ids.add(id);
        }
      }
      expect(activity.manual.length, key).toBeGreaterThan(0);
      represented.set(lesson.id, ids);
    }
    expect(represented.size).toBe(3);
    for (const lesson of unit.lessons.filter((l) => l.status === 'available')) {
      // A lesson being listed is insufficient: every teaching task must have a source activity or an explicit extension boundary.
      expect([...(represented.get(lesson.id) || [])].toSorted()).toEqual(
        lesson.questions.map((q) => q.id).toSorted(),
      );
    }
  });
});
