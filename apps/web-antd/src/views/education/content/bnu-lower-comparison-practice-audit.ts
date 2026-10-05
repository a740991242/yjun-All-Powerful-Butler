export const bnuLowerComparisonPracticeAudit = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10762.html',
  checkedAt: '2026-10-05',
  unit: 'u4',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  scope:
    '仅54页全部三项练习及明示的新候选/新方向复习；55页起继续制作，不证明全单元或全年。',
  activities: [
    {
      page: 54,
      sourceActivity: 'sports-candidates',
      lesson: 'bnu-lower-comparison-practice',
      steps: [1, 2],
      objective: [
        'run-reference',
        'sports-candidates',
        'long-jump',
        'skipping',
        'not-less',
        'reverse',
        'zero-compatible',
        'threshold',
      ],
      manual: ['actual-sports-mark', 'actual-sports-language'],
      records: [],
      boundary:
        '两个条件和圈勾分别完成，参照反向改变多/少；88符合项数0不当未填，定性词限本情境。',
    },
    {
      page: 54,
      sourceActivity: 'age-candidates',
      lesson: 'bnu-lower-comparison-practice',
      steps: [3],
      objective: [
        'age-reference',
        'age-candidate',
        'close-not-equal',
        'age-real',
      ],
      manual: ['actual-age'],
      records: [],
      boundary:
        '原37和39候选不冒家庭真实调查，差不多不相等，不补通用年龄阈值。',
    },
    {
      page: 54,
      sourceActivity: 'sort-four-scores',
      lesson: 'bnu-lower-comparison-practice',
      steps: [4, 5],
      objective: [
        'score-original',
        'sorted-scores',
        'top-group',
        'second-group',
        'last-group',
        'comparison-sign',
      ],
      manual: ['actual-score-cards', 'actual-score-explain'],
      records: ['own-method', 'discovery', 'difficulty', 'plan'],
      boundary:
        '全部四卡保留组名分数对应，高到低与前页升序分清；实做/开放记录/未来计划独立。',
    },
  ],
} as const;
