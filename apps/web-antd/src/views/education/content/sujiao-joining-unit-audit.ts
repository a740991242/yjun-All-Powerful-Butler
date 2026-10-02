/** Every printed activity page was inspected; source artwork is not bundled. */
export const sujiaoJoiningUnitAudit = {
  isbn: '978-7-5743-1295-1',
  checkedAt: '2026-10-02',
  unit: 'shape-joining',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  pages: [
    {
      page: 32,
      scope: '相同大小片拼图引入，四片完全一样正方形拼不同完整图形',
      evidence: [
        [
          'sj-lower-square-mosaics',
          ['0-shape', '1-shape', '2-shape', '3-shape', 'conserve', 'manual-0'],
        ],
        [
          'sj-lower-triangle-mosaics',
          ['shape-0', 'shape-1', 'shape-2', 'shape-3', 'manual-0'],
        ],
      ],
      boundary:
        '单片类别与整体分开，全部使用指定片数，不剪叠添片；原引入图不补造数量。',
    },
    {
      page: 33,
      scope:
        '更多正方形、合作拼0～9并数片、无拼缝图参考片计数、正方形双对角线分四片',
      evidence: [
        [
          'sj-lower-square-mosaics',
          [
            'digit-0',
            'digit-1',
            'digit-2',
            'digit-3',
            'digit-4',
            'digit-5',
            'digit-6',
            'digit-7',
            'digit-8',
            'digit-9',
            '0-count',
            '1-count',
            '2-count',
            'digit-count',
            'open',
            'manual-1',
            'manual-2',
          ],
        ],
        ['sj-lower-triangle-mosaics', ['cut', 'shape-0', 'manual-0']],
      ],
      boundary:
        '图案表示数字不等于用片数；原创比例不冒称原图，实物合作与安全折剪人工确认。',
    },
    {
      page: 34,
      scope: '四三角片拼不同轮廓、从长方形每次只动一片、更多片创作与参考片数图',
      evidence: [
        [
          'sj-lower-triangle-mosaics',
          [
            'shape-2',
            'shape-3',
            'piece-0',
            'direction-0',
            'piece-1',
            'direction-1',
            'piece-2',
            'direction-2',
            'piece-3',
            'direction-3',
            'count-0',
            'count-1',
            'count-2',
            'count-3',
            'manual-0',
            'manual-1',
            'manual-2',
            'reflection',
          ],
        ],
      ],
      boundary:
        '字母追踪同一片，比较时其余片不变，移动与转向区别；给图计数不限定开放作品。',
    },
    {
      page: 35,
      scope:
        '混合图形照样拼、分类与逐类片数、先计划后制作涂色、故事展览及回顾互评',
      evidence: [
        [
          'sj-lower-mixed-collages',
          [
            '0-rectangle',
            '0-square',
            '0-triangle',
            '0-circle',
            '0-types',
            '1-types',
            '2-types',
            '3-types',
            'plan',
            'story',
            'count',
            'feedback',
            'manual-0',
            'manual-1',
            'manual-2',
            'manual-3',
            'manual-4',
            'art-story',
            'reflection',
            'reflection-digits',
            'reflection-relations',
            'reflection-creation',
          ],
        ],
      ],
      boundary:
        '原创作品含义开放、只数原始材料；实际涂色不以看网页代替，展览征求同意、家庭替代如实标注；回顾null、计划不当完成。',
    },
  ],
  resolvedGaps: [
    {
      activity: '照样制作并实际涂色',
      evidence: ['sj-lower-mixed-collages', 'manual-3'],
    },
    {
      activity: '选作品实际展览',
      evidence: ['sj-lower-mixed-collages', 'manual-4'],
    },
    {
      activity: '数字、图形联系与创作分别回顾',
      evidence: [
        'sj-lower-mixed-collages',
        'reflection-digits',
        'reflection-relations',
        'reflection-creation',
      ],
    },
  ],
  gaps: [],
} as const;
