/** Printed pages were inspected individually; original examples are separate from source art. */
export const sujiaoPlaneUnitAudit = {
  isbn: '978-7-5743-1295-1',
  checkedAt: '2026-10-02',
  unit: 'u2',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  pages: [
    {
      page: 22,
      scope: '生活中的图形引入',
      evidence: [['sj-lower-plane-recognition', ['manual-0']]],
      boundary: '原封面不补造数量，找安全物品的平整面，物体与纸上轮廓分开。',
    },
    {
      page: 23,
      scope: '描面、认识长方形正方形、积木上继续找面',
      evidence: [
        [
          'sj-lower-plane-recognition',
          ['recognize-0', 'recognize-1', 'face', 'manual-0'],
        ],
        [
          'sj-lower-face-tracing',
          ['classify-0', 'classify-1', 'manual-0', 'manual-1'],
        ],
      ],
      boundary: '平放描图不按透视变形认形状，真实描面独立人工确认。',
    },
    {
      page: 24,
      scope: '三角形圆、生活物体面、找指定轮廓的积木',
      evidence: [
        [
          'sj-lower-plane-recognition',
          ['recognize-2', 'recognize-3', 'face', 'manual-0'],
        ],
        [
          'sj-lower-face-tracing',
          ['classify-6', 'classify-7', 'whole', 'hidden', 'manual-2'],
        ],
      ],
      boundary:
        '选定面不代表全部面，圆柱平整底面与侧面分开，不要求操弄带电插座。',
    },
    {
      page: 25,
      scope: '分类涂色计数、钉点板围图、印不同面与比较种数',
      evidence: [
        [
          'sj-lower-plane-review',
          [
            'count-circle',
            'count-square',
            'count-rectangle',
            'count-triangle',
            'circle-straight',
            'actual-print',
            'manual-0',
            'manual-1',
          ],
        ],
        ['sj-lower-plane-recognition', ['manual-2']],
        [
          'sj-lower-face-tracing',
          ['different-rectangles', 'same-squares', 'manual-1'],
        ],
      ],
      boundary: '描与印分开；材料不同种数不预填，有限直线段不能当真正圆。',
    },
    {
      page: 26,
      scope: '按形状大小比例选片补图并交流',
      evidence: [
        [
          'sj-lower-shape-patches',
          [
            'rectangle-fit',
            'triangle-fit',
            'square-fit',
            'circle-fit',
            'manual-0',
            'manual-1',
            'manual-2',
          ],
        ],
      ],
      boundary: '原创目标、相同比例，课堂自由拼贴与明确仅平移题条件分开。',
    },
    {
      page: 27,
      scope: '制作完全一样、转向重合、匹配、同面两描及钉点板复制',
      evidence: [
        [
          'sj-lower-rotating-patches',
          ['0-fit', '1-fit', '2-fit', '3-fit', 'turn', 'manual-0', 'manual-1'],
        ],
        ['sj-lower-plane-review', ['same-category', 'manual-2']],
      ],
      boundary:
        '同类不等于完全一样，转向不能改变大小，实际制作及交流人工确认。',
    },
    {
      page: 28,
      scope: '一张长方形剪两块完全一样、横竖及相对角剪法、重合检查和再拼',
      evidence: [
        [
          'sj-lower-plane-cutting',
          [
            'shape-horizontal',
            'shape-vertical',
            'shape-diagonal',
            'same',
            'any-rectangle',
            'any-slant',
            'manual-0',
            'manual-2',
          ],
        ],
      ],
      boundary:
        '正方形结果限定长宽关系，相对角不当任意斜线；不冒称正方形学具为原长方形剪片。',
    },
    {
      page: 29,
      scope: '认识平行四边形、改围、正方形剪拼、三片全用和等长小棒',
      evidence: [
        ['sj-lower-plane-cutting', ['parallelogram', 'manual-1', 'manual-2']],
        ['sj-lower-geoboard-shift', ['pair', 'lower', 'manual-0', 'manual-1']],
        [
          'sj-lower-three-piece-join',
          ['all', 'overlap', 'gap', 'manual-0', 'manual-1'],
        ],
        [
          'sj-lower-equal-sticks',
          ['0-sticks', '2-sides', 'methods', 'manual-0', 'manual-1'],
        ],
      ],
      boundary:
        '固定比例和操作规则不推广任意材料；全用片、无空隙重叠，小棒数与边数不同。',
    },
    {
      page: 30,
      scope: '生活中可描指定图、识类、对折两次、指定片拼候选',
      evidence: [
        ['sj-lower-plane-recognition', ['manual-0']],
        [
          'sj-lower-paper-folds',
          [
            'result-0',
            'result-1',
            'result-2',
            'unspecified',
            'manual-0',
            'manual-1',
            'manual-2',
          ],
        ],
        [
          'sj-lower-assembly-candidates',
          [
            '0-fit',
            '1-fit',
            '2-fit',
            '3-fit',
            'manual-0',
            'manual-1',
            'manual-2',
          ],
        ],
      ],
      boundary: '不同纸片折线另核，对折非剪开；原创候选比例独立，不复制附页。',
    },
    {
      page: 31,
      scope: '大小形状规律、两套完整正方形拼组、大小数图、三项评价与改围回顾',
      evidence: [
        [
          'sj-lower-plane-patterns',
          [
            'sizes-0',
            'shapes-0',
            'mixed-0',
            'manual-0',
            'manual-1',
            'manual-2',
          ],
        ],
        [
          'sj-lower-plane-review',
          [
            'piece-total',
            'piece-rectangles',
            'piece-squares',
            'whole-outline',
            'seams',
            'manual-3',
            'manual-4',
            'evaluation-recognition',
            'evaluation-construction',
            'evaluation-observation',
          ],
        ],
        [
          'sj-lower-composite-counting',
          [
            'rectangle-strip-total',
            'square-grid-total',
            'triangle-fan-total',
            'manual-0',
            'manual-1',
            'manual-2',
          ],
        ],
        ['sj-lower-geoboard-shift', ['0-move', '1-move', 'manual-0']],
      ],
      boundary:
        '拼片数与复合轮廓数分开；两套比例为原创，实际纸片人工确认；三项反思各自null、不自动评星。',
    },
  ],
  gaps: [],
} as const;
