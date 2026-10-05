/** All three inspected activities on printed page 57. */
export const bnuLowerHarvestAudit = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  unit: 'u4',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  scope:
    '仅第57页我的收获与问题银行；第58～59页另行制作，不证明全册或全年完成。',
  activities: [
    {
      page: 57,
      sourceActivity: 'heartbeat-counters-comparison',
      lesson: 'bnu-lower-harvest',
      steps: [1, 2, 3],
      objective: [
        'counts',
        'counter-digits',
        'descending',
        'most',
        'unit',
        'age-not-counts',
        'tens95',
        'ones95',
        'beads95',
        'compare-method',
        'not-health-rule',
        'site-zero',
      ],
      manual: [
        'actual-four-counters',
        'actual-four-records',
        'actual-comparisons',
      ],
      records: [],
      boundary:
        '年龄/共同一分钟/次数与数位/材料件数分清，本站90的0另明示，不推健康结论。',
    },
    {
      page: 57,
      sourceActivity: 'eighty-five-representations',
      lesson: 'bnu-lower-harvest',
      steps: [4, 5],
      objective: [
        'eighty-five',
        'tens85',
        'ones85',
        'beads85',
        'decomposition',
        'symbols',
        'symbol-count',
        'symbol-convention',
      ],
      manual: [
        'actual-original85',
        'actual-own85-a',
        'actual-own85-b',
        'actual-explain85',
      ],
      records: ['own85-a', 'own85-b'],
      boundary:
        '85表示值与13材料分清；图例原未知与本站明确约定分开，两个自主表示开放。',
    },
    {
      page: 57,
      sourceActivity: 'open-question-bank',
      lesson: 'bnu-lower-harvest',
      steps: [6],
      objective: [],
      manual: ['actual-question-talk', 'actual-revisit'],
      records: ['own-question', 'own-idea', 'discovery', 'difficulty', 'plan'],
      boundary:
        '自主提问/理由/发现困难开放null，实际交流与未来计划分开，不统一是非评分。',
    },
  ],
} as const;
