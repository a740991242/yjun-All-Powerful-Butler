import type { FinalStoriesVisual } from '../learning/final-stories';
import type { Lesson, Question } from '../learning/types';

import { finalStoryGroups } from '../learning/final-stories';
import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-final-stories';
const visual = (
  scene: FinalStoriesVisual['scene'],
  review = false,
): FinalStoriesVisual => ({
  kind: 'final-stories',
  scene,
  variant: review ? 'review' : 'main',
});
function tasks(review: boolean): Question[] {
  const q = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
    scene?: FinalStoriesVisual['scene'],
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    rule,
    hint: '先说已知和所求类别；叉号仍属原量但已不在剩余中，部分合并与真正离开分清，各自写单位。',
    explanation,
    ...(scene ? { visual: visual(scene, review) } : {}),
  });
  const scenes = ['fruit', 'books', 'bottles', 'rabbits'] as const;
  const prompts = [
    '左边/右边/合计，按此顺序填三个数量（个）。',
    '上层/下层/合计，按此顺序填三个数量（本）。',
    '原有/已拿走/仍剩，按此顺序填三个数量（瓶）。',
    '原有/已离开/仍剩，按此顺序填三个数量（只）。',
  ];
  const playground = finalStoryGroups(visual('playground', review));
  const cakes = required(finalStoryGroups(visual('one-kind', review))[0]);
  const buns = required(finalStoryGroups(visual('one-kind', review))[1]);
  const garden = finalStoryGroups(visual('garden', review));
  const count = (label: string) =>
    required(garden.find((g) => g.label === label)).count;
  return [
    ...scenes.map((scene, i) => {
      const gs = finalStoryGroups(visual(scene, review));
      const a = required(gs[0]);
      const values =
        i < 2
          ? [a.count, required(gs[1]).count, a.count + required(gs[1]).count]
          : [a.count, a.marked, a.count - a.marked];
      return q(
        `equation-${scene}`,
        `独立场景${i + 1}，${required(prompts[i])} 两部分场景都属于同一类、没有重叠；减少场景叉号表示已经真的拿走或离开。`,
        { kind: 'steps', values },
        i < 2
          ? `本题${values[0]}+${values[1]}=${values[2]}，合并两不重叠部分，三个空各有指定含义；故事交换两加数也合理，但本题按给定顺序填。`
          : `本题${values[0]}−${values[1]}=${values[2]}，原物包含叉号表示的那部分，叉号不另算物品；不是原物再加取走部分。`,
        scene,
      );
    }),
    q(
      'playground',
      '图中原有孩子和又来的孩子不同，又来的已经加入。先填原有人数，再填又来人数，最后填现在一共人数（人）。',
      {
        kind: 'steps',
        values: [
          required(playground[0]).count,
          required(playground[1]).count,
          required(playground[0]).count + required(playground[1]).count,
        ],
      },
      '两个群体不重复，加入用加法；不能只数又来的，也不能把同人画在两组重复加。',
      'playground',
    ),
    q(
      'one-kind',
      '蛋糕和面包是不同类别，只有带叉的蛋糕被吃掉，面包没拿走。先填原有蛋糕数，再填吃掉蛋糕数，最后填剩余蛋糕数（块），不是所有食物。',
      {
        kind: 'steps',
        values: [cakes.count, cakes.marked, cakes.count - cakes.marked],
      },
      `只问蛋糕：${cakes.count}−${cakes.marked}=${cakes.count - cakes.marked}块，另一类${buns.count}个面包不加入蛋糕算式。`,
      'one-kind',
    ),
    q(
      'all-food',
      '同图若改问现在剩余所有食品有几件（每块蛋糕、每个面包各一件），填剩余两类食品合计；叉号食品已吃掉不计。',
      { kind: 'number', value: cakes.count - cakes.marked + buns.count },
      `剩余蛋糕${cakes.count - cakes.marked}件加面包${buns.count}件，一共${cakes.count - cakes.marked + buns.count}件。所求换了要重新看，不把蛋糕剩余直接当全部。`,
      'one-kind',
    ),
    q(
      'garden-ducks',
      '同一时刻鸭在池中和草地，没有重叠。依次填池中/草地/全部鸭的数量（只），不把兔或鸟加进鸭。',
      {
        kind: 'steps',
        values: [
          count('water'),
          count('grass'),
          count('water') + count('grass'),
        ],
      },
      '两处是静态不重叠部分，合成全部鸭；并未画出某鸭先后从草地进水的过程。',
      'garden',
    ),
    q(
      'garden-rabbits',
      '兔在胡萝卜旁和田里是不同的兔、同一时刻。依次填胡萝卜旁/田里/全部兔的数量（只），不把画胡萝卜的意思当增加兔。',
      {
        kind: 'steps',
        values: [
          count('carrots'),
          count('field'),
          count('carrots') + count('field'),
        ],
      },
      '只按兔的两个部分合计，食物不当兔，动作不同不证明时间上增加或减少。',
      'garden',
    ),
    q(
      'garden-birds',
      '鸟原来全在树上，图中两只已飞走，其余仍在树上，各鸟只出现一次。先填飞走前原有鸟数，再填飞走鸟数，最后填现在仍在树上鸟数（只）。',
      {
        kind: 'steps',
        values: [
          count('perched') + count('flew'),
          count('flew'),
          count('perched'),
        ],
      },
      '原鸟包括当前树上与已飞走两部分，再减真正飞走的；现在树上量与此处所有画出鸟总量不同。',
      'garden',
    ),
    {
      ...q(
        'static-action',
        review
          ? '新图兔在胡萝卜旁/田里，仅凭同一时刻两部分能断言有几只兔刚从田里走来吗？'
          : '同一时刻鸭在水中/草地，只凭这幅两部分图能断言有几只鸭刚从草地进入池中吗？',
        { kind: 'choice', value: 'unknown' },
        '只能知道当前两处数量；若要讲进入的时间变化，需要额外明确前后记录，不能把静态部分直接当事件。',
        'garden',
      ),
      choices: [
        { id: 'unknown', label: '不能，缺少进入前后和具体移动记录' },
        {
          id: 'guess',
          label: review
            ? '能，田里兔数一定是刚走来的数量'
            : '能，草地鸭数就一定是刚进入的数量',
        },
      ],
    },
    {
      ...q(
        'open-many',
        review
          ? '新图鸭在池中2只/草地4只，没有进入过程，哪个自主问题有图中依据？'
          : '同一原创动物图可提出多种有依据的加减问题吗？',
        { kind: 'choice', value: review ? 'parts' : 'many' },
        '可以问合计、另一部分或明示鸟离开后的树上量，所求/类别/时间须明确。自主写不是只抄固定题换名字。',
        'garden',
      ),
      choices: [
        {
          id: review ? 'parts' : 'many',
          label: review
            ? '池中和草地一共有几只鸭？2+4=6只'
            : '可以，已知与所求明确，不能编造未给的时间变化',
        },
        {
          id: review ? 'time' : 'one',
          label: review
            ? '刚从草地进入池中的鸭有几只？说4只'
            : '不可以，只允许一个固定问题',
        },
      ],
    },
    {
      ...q(
        'complete-story',
        review
          ? '只写7只，却没说求哪种动物、已知或问题，这算完整故事与解答吗？'
          : '完整故事与解答需要哪些内容？',
        { kind: 'choice', value: review ? 'incomplete' : 'complete' },
        '真实的已知数量、清楚所求、算式、单位和答句，还要画摆或依据图核对；抄得数或只说加减号不完整。',
      ),
      choices: [
        {
          id: review ? 'incomplete' : 'complete',
          label: review
            ? '不完整，要补类别、已知所求、算式和答句并核对图'
            : '已知与所求、算式、单位、答句及图摆核对',
        },
        {
          id: 'number',
          label: review
            ? '完整，只要有7只这个得数就够'
            : '只写一个得数，不说明类别和问题',
        },
      ],
    },
  ];
}
const manuals: readonly (readonly [
  string,
  FinalStoriesVisual['scene'],
  string,
])[] = [
  [
    'actual-fruit',
    'fruit',
    '实际看左右水果独立图，自己完整讲两不重叠部分合计故事，写已知/所求、算式/单位/答句，画或摆核对；新图再独立讲，不只抄句换名字。',
  ],
  [
    'actual-books',
    'books',
    '实际看上下层书独立图，讲完整合并故事并写算式单位本/答句，画摆核对不漏不重；新图再独立说。水果题完成不能替本题。',
  ],
  [
    'actual-bottles',
    'bottles',
    '实际看原瓶与叉号，讲真正拿走后剩多少的完整故事，写原有/取走/剩余、算式/单位瓶/答句，实物每题复原核对；新图重新讲，移动同瓶换位置不当取走。',
  ],
  [
    'actual-rabbits',
    'rabbits',
    '实际看原兔与叉号，讲兔真正离开后仍剩多少完整故事，写已知/所求/算式/单位只/答句并用纸兔核对；新图再独立讲。未做不能由瓶子题代替。',
  ],
  [
    'actual-playground',
    'playground',
    '实际按原有和新加入不同孩子图讲完整加入故事，画摆分别记录原有/新来/现在及算式单位人答句；新图重新讲，不能重复加同一个孩子。桌面纸人模拟如实记，不需真实到操场。',
  ],
  [
    'actual-one-kind',
    'one-kind',
    '实际蛋糕/面包图先完整说只问蛋糕的取走故事，再换问剩余全部食品，分别画摆写类别/已知所求/算式/相应块或件单位及答句；只取叉号蛋糕不动面包。新图重做，不用所有食物总量当蛋糕。',
  ],
  [
    'actual-open-garden',
    'garden',
    '实际自己从多类动物图先提出至少四个不同加减问题并解答，包含两静态部分合计、求另一部分、明示鸟离开的时间减少；每个写已知/所求、算式、单位只、答句，并描图或摆物核对，向家人讲至少一例。鸭兔未给时间变化不能编作已发生事件；可另明示原创假设并注明不由图得出。保留所有自主作品与帮助，不只抄固定题换名；新图再提不同问题。',
  ],
  [
    'actual-explain',
    'garden',
    '实际展示四独立场景、加入/仅蛋糕/所有食品及自己四动物问题，解释合并不同部分、时间减少和另一部分的不同，核对类别/单位与自己原话；困难/帮助和真实未做如实记，未来计划另列。',
  ],
];
export const sujiaoUpperFinalStoriesLesson: Lesson = {
  id,
  title: '期末故事：四情境与自己的加减问题',
  textbookTitle: '期末复习·数量关系',
  page: 89,
  version: 1,
  status: 'available',
  goal: '完整两合并/两减少图故事及加入、仅一类剩余，原创多类动物图自主问题，已知所求/类别/图式/单位/答句核对。',
  prerequisite:
    '会10以内和十几范围加减，备纸笔/小棒/安全纸卡，家人可以帮读；本站图为原创示意。',
  parentTip: `ISBN ${source.isbn}同版89/91/92页已实际查看。原创四独立水果/书/瓶/兔两合并两减少、加入群体及蛋糕一类取走图，多类鸭兔静态部分与鸟明示离开时间变化分清，不复制教材插画。13客观/9实际人工/1反思，四故事各人工不由一题代替，至少四自主加减问题与解释；每图全部已知物可见，叉号原物保留供核对但不算剩余，不按全部食物答蛋糕。复习换数量和标记，未来计划分开，reflection null，旧ID/快照/备份保持，教师最终审校未核验。`,
  steps: [
    {
      title: '情境一：水果两部分合并',
      text: '左右两组水果各自不重复，先说已知两部分和所求合计，再点图写2+5=7个。加法故事交换两部分先后也合理，练习按题目指定左/右/合计顺序填。新4+3=7重新数，得数相同不证明图没变。',
      visual: visual('fruit'),
      activity:
        '实际完整讲水果故事，画摆核对写已知/所求/算式/单位个和答句，保留主与新图作品。',
    },
    {
      title: '情境二：书的上下层合计',
      text: '上层4本、下层6本为不同的书，共10本。两层是同一类书的不同部分，不能只报层数2或把一本画两次。新上3下5共8本重新数。独立书故事不由水果故事完成替代，单位本也不同。',
      visual: visual('books'),
      activity: '实际讲书故事，画摆独立核对主与新两图，写完整算式单位答句。',
    },
    {
      title: '情境三四：真正拿走或离开',
      text: '瓶子原4瓶，叉号1瓶已拿走，剩3瓶；兔原10只，叉号4只已离开，剩6只。叉号仍画出原物便于核对，不另当物品、不算剩余。两故事各完整讲：原有、取走/离开、剩余及单位。新瓶5取2、新兔9离3重新数；只是移动同一物换位置不减少原数量。',
      visual: visual('bottles'),
      activity:
        '实际两个独立减少故事分别画纸瓶/纸兔，每题初始复原真实取走，写完整图式/单位/答句，新图另做。',
    },
    {
      title: '加入与仅一类剩余，先看问题',
      text: '原5孩子又来3个不同孩子，现在8人，新4又来5得9人，不重复加同人。另一图蛋糕6块和面包4个，只吃3块蛋糕：蛋糕剩3块，而全部食品剩3+4=7件；新7蛋糕吃2和3面包，蛋糕5块、全部8件。问题不同，类别/单位与算式也不同，别把另一类加入蛋糕答案。',
      visual: visual('one-kind'),
      activity:
        '实际分别讲加入故事和蛋糕剩余故事，再换问全部食品，用纸人/食品卡核对并写各自单位；新图重新讲。',
    },
    {
      title: '多类动作图，自主提出问题',
      text: '鸭在池中/草地4和3，兔在胡萝卜旁/田里3和2，都是同一时刻不同部分，没有给鸭进入或兔新增的事件。鸟原来全在树上，其中2只已飞走、3只仍树上，明示原5减2余3的时间变化。可以问两部分合计、另一部分、鸟离开后树上量等多个有依据问题，不把所有类别混加或猜未给的时间变化。每个完整写已知所求、算式、单位只、答句并图摆核对，保留至少四自主问题和自己的解释。',
      visual: visual('garden'),
      activity:
        '实际从主图提出至少四不同加减问题并完整解答，包含合计/另一部分/明示减少；新图鸭2/4、兔3/3、鸟4留2飞再自主提不同问题，帮助与计划如实分开。',
    },
  ],
  questions: [
    ...tasks(false),
    ...manuals.map(([key, scene, prompt]): Question => ({
      id: `${id}-${key}`,
      knowledge: `${id}-${key}`,
      prompt,
      visual: visual(scene),
      rule: { kind: 'manual' },
      hint: '本项独立真实故事/作品完成后确认，未做暂跳，帮助与未来计划分开。',
      explanation: '网页答案不代替实际故事、自主提问与说明。',
    })),
    {
      id: `${id}-actual-textbook`,
      knowledge: `${id}-actual-textbook`,
      prompt:
        '若使用同版教材，实际观察89页四独立图逐一讲两加两减，91页加入孩子与仅蛋糕剩余、92页原多类动物图自主提问，分别记录自己的已知/所求/算式/单位/答句并核对原图。原图与本站原创图数量和画法不同，不能抄本站数到原图，分别保留作品；未有教材原图写待做，不冒原图已做，本站原创可先独立完成。',
      rule: { kind: 'manual' },
      hint: '原教材图实际观察后确认；无教材原图暂跳，与本站原创作品分开。',
      explanation: '链接或本站原创正确不等于原教材图已实际看，未来计划另列。',
    },
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实讲故事或自己提问的一例、类别/时间/单位核对和改正帮助；未做如实说，未来练习计划另列。',
      rule: { kind: 'reflection' },
      hint: '真实与计划分开。',
      explanation: '反思correct null不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '四完整故事及多类自主问题逐项核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷89/91/92页已实际查看。原创七已知情境及新数量/叉号，每物一次，静态与时间变化边界明确，四场景各实际人工及自主多问题，不复制教材插图；教师最终审校未核验。',
  },
};
