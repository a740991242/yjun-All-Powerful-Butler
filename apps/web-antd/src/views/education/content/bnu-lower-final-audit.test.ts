import { describe, expect, it } from 'vitest';

import { bnuLowerFinalAudit as audit } from './bnu-lower-final-audit';
import { bnuLowerFinalSource as source } from './bnu-lower-final-source';

describe('bNU lower final review partial delivery evidence', () => {
  it('maps every taught source activity once and keeps all later activities pending', () => {
    expect(audit.status).toBe('partial-original-teaching');
    expect(audit.finalTeacherReview).toBe('not-verified');
    expect(audit.taughtPrintedPages).toEqual([90, 91, 92]);
    expect(audit.pendingTeachingPages).toEqual([93, 94, 95]);
    expect(audit.activities).toHaveLength(13);
    expect(audit.pendingActivities).toHaveLength(11);
    expect(audit.activities.map((a) => [a.page, a.sourceActivity])).toEqual(
      source.activities.filter((a) => a.page <= 92).map((a) => [a.page, a.key]),
    );
    expect(audit.pendingActivities).toEqual(
      source.activities.filter((a) => a.page >= 93),
    );
    expect(source.geometry.collageCounts).toBeNull();
  });
});
