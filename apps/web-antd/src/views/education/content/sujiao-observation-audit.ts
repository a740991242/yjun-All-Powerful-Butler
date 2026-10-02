/** Inspected printed pages mapped to original teaching, practice and actual tasks.
 * This records implemented scope, not a score or final teacher review.
 */
export const sujiaoObservationAudit = {
  isbn: '978-7-5743-1295-1',
  checkedAt: '2026-10-02',
  unit: 'u7',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  pages: [
    {
      page: 78,
      scope: '同一飞机从不同方向观察的单元导入',
      evidence: [
        {
          lesson: 'sj-lower-motion-sequences',
          knowledge: 'sj-lower-motion-sequences-camera',
        },
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-manual-toy',
        },
      ],
      boundary:
        '原创同一三维模型与真实物品观察，不复制原飞机图，不把视图数当实物数。',
    },
    {
      page: 79,
      scope: '茶壶四位置、嘴把可见与侧向左右差异、匹配和发现',
      evidence: [
        {
          lesson: 'sj-lower-viewpoint-jug',
          knowledge: 'sj-lower-viewpoint-jug-observer-A',
        },
        {
          lesson: 'sj-lower-viewpoint-jug',
          knowledge: 'sj-lower-viewpoint-jug-side-order',
        },
        {
          lesson: 'sj-lower-viewpoint-jug',
          knowledge: 'sj-lower-viewpoint-jug-manual-2',
        },
      ],
      boundary: '明确不透明、嘴把相对与固定平视；实物条件改变需重新观察。',
    },
    {
      page: 80,
      scope: '教室前后、物体前后四侧特征、观察位置与视图匹配',
      evidence: [
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-manual-room',
        },
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-manual-toy',
        },
        {
          lesson: 'sj-lower-viewpoint-house',
          knowledge: 'sj-lower-viewpoint-house-observer-C',
        },
      ],
      boundary:
        '原房屋、玩具动物和车辆改为原创盒与自选安全物品；单面盒条件不套用真实斜视。',
    },
    {
      page: 81,
      scope: '接近与离开的远近变化、最先最后、排序与说明',
      evidence: [
        {
          lesson: 'sj-lower-motion-order',
          knowledge: 'sj-lower-motion-order-approach-order',
        },
        {
          lesson: 'sj-lower-motion-order',
          knowledge: 'sj-lower-motion-order-depart-order',
        },
        {
          lesson: 'sj-lower-motion-order',
          knowledge: 'sj-lower-motion-order-manual-0',
        },
      ],
      boundary:
        '原创侧面位置示意代替原火车透视照片，固定参照、持续方向，实际桌面过程独立确认。',
    },
    {
      page: 82,
      scope: '经过、下滑、两车相遇后行驶、固定观察者下模型转动与故事顺序',
      evidence: [
        {
          lesson: 'sj-lower-motion-order',
          knowledge: 'sj-lower-motion-order-pass-order',
        },
        {
          lesson: 'sj-lower-motion-sequences',
          knowledge: 'sj-lower-motion-sequences-order-slide',
        },
        {
          lesson: 'sj-lower-motion-sequences',
          knowledge: 'sj-lower-motion-sequences-order-meet',
        },
        {
          lesson: 'sj-lower-motion-sequences',
          knowledge: 'sj-lower-motion-sequences-order-turn',
        },
        {
          lesson: 'sj-lower-motion-sequences',
          knowledge: 'sj-lower-motion-sequences-manual-2',
        },
      ],
      boundary:
        '桌面模拟不要求真实滑梯/道路；模型只转给定半圈，缺起点或方向不硬判唯一顺序。',
    },
    {
      page: 83,
      scope: '玩具位置匹配、实际书包换位观察、四编号拍摄位置对应视图',
      evidence: [
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-manual-toy',
        },
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-manual-bag',
        },
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-manual-camera',
        },
      ],
      boundary:
        '纸塔/标记盒桌面模拟编号，不需要相机或无人机，不保存真实环境照片；真实物品可见多面。',
    },
    {
      page: 84,
      scope: '后续可能位置、两物体遮挡与左右匹配、三项独立评价反思',
      evidence: [
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-manual-future',
        },
        {
          lesson: 'sj-lower-occlusion',
          knowledge: 'sj-lower-occlusion-observer-A',
        },
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-manual-combined',
        },
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-evaluation-viewpoints',
        },
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-evaluation-sequence',
        },
        {
          lesson: 'sj-lower-observation-review',
          knowledge: 'sj-lower-observation-review-evaluation-careful',
        },
      ],
      boundary:
        '未来位置未给速度与间隔允许不同合理画法；图示盒杯与实物壶杯分开，三项自评null不变能力分数。',
    },
  ],
} as const;
