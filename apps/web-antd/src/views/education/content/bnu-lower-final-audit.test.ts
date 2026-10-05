import { describe, expect, it } from 'vitest';

import { bnuLowerFinalAudit as audit } from './bnu-lower-final-audit';
import { bnuLowerFinalSource as source } from './bnu-lower-final-source';

describe('bNU lower final review activity mapping evidence', () => {
  it('maps every taught source activity once without declaring the full year or source collage counts verified', () => {
    expect(audit.status).toBe('original-teaching-mapped');
    expect(audit.finalTeacherReview).toBe('not-verified');
    expect(audit.taughtPrintedPages).toEqual([90, 91, 92, 93, 94, 95]);
    expect(audit.pendingTeachingPages).toEqual([]);
    expect(audit.activities).toHaveLength(24);
    expect(audit.pendingActivities).toHaveLength(0);
    expect(audit.activities.map((a) => [a.page, a.sourceActivity])).toEqual(
      source.activities.map((a) => [a.page, a.key]),
    );
    expect(audit.pendingActivities).toEqual([]);
    expect(source.geometry.collageCounts).toBeNull();
  });
});
