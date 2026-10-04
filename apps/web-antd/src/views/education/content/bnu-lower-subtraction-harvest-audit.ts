/** Original activities on page 41; later review pages remain separate. */
export const bnuLowerSubtractionHarvestAudit = {
  resourceId: 'bnu-lower-public-scan-2024',
  source: 'https://keben.szxuexiao.com/html/10761.html',
  checkedAt: '2026-10-05',
  unit: 'u3',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  scope:
    '仅第41页我的收获与问题银行，42～43页巩固应用仍制作中；不证明整单元、全册或全年完成。',
  activities: [
    {
      page: 41,
      sourceActivity: 'plants-methods',
      lesson: 'bnu-lower-subtraction-harvest',
      steps: [1, 2, 3],
      objective: [
        'plant-counts',
        'reverse-difference',
        'unit',
        'shared-species',
        'split-part',
        'split-whole',
        'counter-initial',
        'counter-exchange',
        'counter-remaining',
      ],
      manual: [
        'actual-plants',
        'actual-sticks',
        'actual-line',
        'actual-whole',
        'actual-counter',
      ],
      records: [],
      boundary:
        '种数与具体种类名单分开；原拆减数3/3和拆原数10/3、计数器换十数量守恒各独立。',
    },
    {
      page: 41,
      sourceActivity: 'stories',
      lesson: 'bnu-lower-subtraction-harvest',
      steps: [4],
      objective: ['glove-example', 'parking', 'zero-empty', 'unknown'],
      manual: ['actual-hats', 'actual-parking'],
      records: [],
      boundary:
        '原两图自主问题保持开放，本站帽配手套是额外明示条件；停车单位、完整0和未知分开。',
    },
    {
      page: 41,
      sourceActivity: 'own-question',
      lesson: 'bnu-lower-subtraction-harvest',
      steps: [5],
      objective: ['twenty-path', 'twenty-split'],
      manual: ['actual-twenty', 'actual-own-question'],
      records: ['own-question', 'discovery', 'difficulty', 'plan'],
      boundary:
        '原25−9为超20拓展，本站演示不冒唯一算法；自主提问/发现/困难/计划null，实做不自动确认。',
    },
  ],
} as const;
