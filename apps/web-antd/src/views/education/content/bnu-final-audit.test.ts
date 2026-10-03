import { describe, expect, it } from 'vitest';

import { bnuUpperBook, bnuUpperSource } from './bnu';
import { bnuFinalAudit } from './bnu-final-audit';

describe('bnu final review source-to-task audit', () => {
  it('covers all inspected final pages while keeping the appendix and unknown identity separate', () => {
    expect(bnuFinalAudit.source).toBe(bnuUpperSource.preview);
    expect(bnuFinalAudit.resourceId).toBe('keben-0061');
    expect(bnuFinalAudit.finalTeacherReview).toBe('not-verified');
    expect(bnuUpperSource.isbn).toBeNull();
    expect(bnuUpperSource.printing).toBeNull();
    const pages = [81, 82, 83, 84, 85, 86, 87];
    expect([...new Set(bnuFinalAudit.activities.map((a) => a.page))]).toEqual(
      pages,
    );
    expect(
      pages.map(
        (page) =>
          bnuFinalAudit.activities.filter((a) => a.page === page).length,
      ),
    ).toEqual([4, 5, 4, 4, 4, 4, 1]);
    for (const page of pages)
      expect(bnuUpperSource.readPrintedPages).toContain(page);
    const annex = bnuFinalAudit.activities.find((a) => a.page === 87);
    expect(annex?.lesson).toBe('bnu-upper-final-position-time');
    expect(annex?.boundary).toContain('不是正式新单元');
    expect(bnuFinalAudit.scope).toContain('不证明全册、下册或全年完成');
  });

  it('anchors each original activity to real steps and separately typed task IDs', () => {
    const unit = bnuUpperBook.units.find((u) => u.id === bnuFinalAudit.unit);
    if (!unit) throw new Error('Missing BNU final unit');
    const sourceKeys = new Set<string>();
    const represented = new Map<string, Set<string>>();
    for (const activity of bnuFinalAudit.activities) {
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
    expect(represented.size).toBe(6);
    for (const lesson of unit.lessons) {
      // A lesson being listed is insufficient: every teaching task must have a source activity or an explicit extension boundary.
      expect([...(represented.get(lesson.id) || [])].toSorted()).toEqual(
        lesson.questions.map((q) => q.id).toSorted(),
      );
    }
  });
});
