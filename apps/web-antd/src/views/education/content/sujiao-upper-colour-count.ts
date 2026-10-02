import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { sujiaoUpperSource as source } from './sujiao-upper-source';

const id = 'sj-upper-colour-count';

function tasks(review: boolean): Question[] {
  const coloured = review ? [4, 1, 5, 2, 3] : [1, 2, 3, 4, 5];
  const targets = review ? [5, 2, 4] : [2, 4, 5];
  const existing = review ? [1, 0, 2] : [1, 1, 3];
  const total = review ? 4 : 5;
  const young = review ? 1 : 2;
  const female = review ? 1 : 2;
  const base = (key: string, prompt: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
  });
  return [
    {
      ...base(
        'full-colour-record',
        `每行各有5个圆。五行涂色数按顺序是${coloured.join('、')}。每行先填涂色数，再填未涂色数，共10个空，按行从上往下记录。`,
      ),
      rule: { kind: 'steps', values: coloured.flatMap((n) => [n, 5 - n]) },
      hint: '每行单独数，涂色与未涂色合起来5个。全部涂色时未涂是0，不是空白。',
      explanation: `各行涂色、未涂依次是${coloured.map((n) => `${n}与${5 - n}`).join('；')}。涂色只改外观，没有新增圆。`,
    },
    {
      ...base(
        'multiple-targets',
        `三个花瓶需要的花数依次${targets.join('、')}，已有花数依次${existing.join('、')}。按瓶顺序填各自还需画几朵，不把不同瓶的缺数合成一个数。`,
      ),
      rule: {
        kind: 'steps',
        values: targets.map((n, i) => n - required(existing[i])),
      },
      hint: '每瓶从已有数量接着数到自己标的目标，达到目标就停。',
      explanation: `分别还需${targets.map((n, i) => n - required(existing[i])).join('、')}朵。不同目标和已有数量要逐一对应。`,
    },
    {
      ...base(
        'already-complete',
        review
          ? '一圈要求4个三角形，已经画了4个，还需添几个？'
          : '一圈要求5个三角形，已经画了5个，还需添几个？',
      ),
      rule: { kind: 'number', value: 0 },
      hint: '已经达到目标，不必再添，0也要明确填写。',
      explanation: '还需添0个；若再添就超过目标，未填不是0。',
    },
    {
      ...base(
        'whole-and-subsets',
        `纸面共有${total}只鸟，其中${young}只幼鸟、${total - young}只成年鸟。成年鸟里面${female}只是母鸟。依次填全部鸟、成年鸟、母鸟的数量。`,
      ),
      rule: { kind: 'steps', values: [total, total - young, female] },
      hint: '母鸟已经包含在成年鸟里；成年鸟已经包含在全部鸟里，不能再加一次。',
      explanation: `分别是${total}、${total - young}、${female}只，题目问哪个集合，就只数那个集合。`,
    },
    {
      ...base(
        'no-double-count',
        `已经数出全部${total}只鸟，又知道其中${female}只是母鸟。全部鸟数应怎么记？`,
      ),
      choices: [
        { id: 'whole', label: `仍是${total}只，母鸟已包含在全部里` },
        { id: 'repeat', label: `记作${total + female}只，把母鸟再加上` },
      ],
      rule: { kind: 'choice', value: 'whole' },
      hint: '看看有没有新增鸟；换分类名字不会增加数量。',
      explanation: '子类是整个集合中的部分，不能重复计数。',
    },
    {
      ...base(
        'bead-comparison',
        review
          ? '计数架两根计数杆，每颗移入计数区的珠都表示1。第一根3颗、第二根5颗，第一根数量比第二根怎样？'
          : '计数架两根计数杆，每颗移入计数区的珠都表示1。第一根3颗、第二根没有珠，第一根数量比第二根怎样？',
      ),
      visual: { kind: 'count', count: 3, other: review ? 5 : 0 },
      choices: [
        { id: 'more', label: '多' },
        { id: 'same', label: '同样多' },
        { id: 'less', label: '少' },
      ],
      rule: { kind: 'choice', value: review ? 'less' : 'more' },
      hint: '这里只按每颗1计数，不使用算盘上珠表示5的位值规则。没有珠表示0。',
      explanation: review ? '3小于5，第一根少。' : '3大于0，第一根多。',
    },
    {
      ...base(
        'colour-keeps-total',
        review
          ? '一行5个圆，把已经涂色的3个改涂另一种颜色，没有添画或擦去圆，这行圆总数怎样？'
          : '一行5个圆，涂其中2个，没有添画或擦去圆，这行圆总数怎样？',
      ),
      choices: [
        { id: 'five', label: '仍是5个' },
        { id: 'painted', label: '只剩涂过色的圆' },
      ],
      rule: { kind: 'choice', value: 'five' },
      hint: '问总数不是问涂色数，涂色不改变圆的个数。',
      explanation: '所有圆都还在，涂色和未涂合起来仍是5。',
    },
    {
      ...base(
        'zero-is-a-number',
        review
          ? '第五行全部5个圆都已涂色。“未涂数”栏留白，能说已经完整记录了吗？'
          : '第一瓶原来0朵花。“已有数”栏留白，能说已经完整记录了吗？',
      ),
      choices: [
        { id: 'no', label: '不能，实际数量0也应明确写0' },
        { id: 'yes', label: '能，空白自动算0' },
      ],
      rule: { kind: 'choice', value: 'no' },
      hint: '没作答与实际没有物品不同。',
      explanation: '空白不等于数量0；须先核实再记录。',
    },
  ];
}

export const sujiaoUpperColourCountLesson: Lesson = {
  id,
  title: '数与画：拨珠、分类、完整涂格与补图',
  textbookTitle: '认识0～5·想想做做与练习',
  page: 15,
  version: 1,
  status: 'available',
  goal: '实际拨珠表示0～5，分别数整体与子类；完成五列涂格、五行涂与未涂记录，以及多个不同目标的补图。',
  prerequisite:
    '认识0～5；准备纸笔、安全色笔及每颗表示1的儿童计数架。没有计数架可先做纸笔部分，拨珠任务保留待做。',
  parentTip: `对应ISBN ${source.isbn}印刷13、15、19、22～23页已读活动范围。本站点图、数量和鸟群分类均为原创。计数架只数移入明确计数区的珠，备用区不计，不套用传统算盘上珠5、下珠1规则。实际涂、画、拨与口述分别人工确认，网页答对不代表已经动手；未来计划另记。`,
  steps: [
    {
      title: '每颗计数珠表示1',
      text: '选一根能移动珠子的儿童计数杆，约定一端为计数区，另一端放备用珠，两个区域有间隔。先将计数区清空表示0，再逐颗移入1、2、3、4、5颗，每次只数计数区。珠子移动位置不等于创造新珠。',
      activity:
        '实际表示0～5，每次恢复计数区空，再拨指定数量、读数、写数；另用两根杆摆3与0、2与4、2与2，实际配对比较。',
    },
    {
      title: '全部、成年与母鸟分别数',
      text: '画5只鸟，先标2只幼鸟、3只成年鸟，再在成年鸟中标2只母鸟、1只公鸟。全部是5，成年是3，母鸟是2。母鸟在成年鸟里面，成年鸟在全部里面，不能把5与2再加当全部。',
      activity:
        '实际画图圈出全部与成年范围，母鸟在成年范围内标记，分别逐一点数，说哪些已经包含。允许用自画简单符号，分类标签要明确。',
    },
    {
      title: '五列按标签完整涂格',
      text: '在纸上画五列，每列5个方格，下方依次标1、2、3、4、5。按各列标签，从下往上分别涂1、2、3、4、5格。涂到要求的数量就停，不能把整列都涂完。涂格只是表示数量，没有减少原格数。',
      activity:
        '实际画25格并完成五列涂色，每列逐格核对涂色数与标签，向家人说明。',
    },
    {
      title: '每行既记涂色，也记未涂',
      text: '另画五行，每行5个圆。第一至第五行分别涂1、2、3、4、5个。旁边画两栏，逐行记录涂色数和未涂数：1与4、2与3、3与2、4与1、5与0。每行两个数合起来5，不同的行各自重新数。',
      activity:
        '实际涂完全部五行，并填全十个记录；第五行未涂数明确写0，不能留空。',
    },
    {
      title: '按不同目标分别补图',
      text: '自己画三个花瓶，分别标需要2、4、5朵，先画1、1、3朵，再补到各自目标。另画三个独立圆圈，每圈要求5个三角形，先画0、2、4个，再分别补齐。补画数与最后总数不同，每图独立检查。',
      activity:
        '实际完成六幅图，保留补前数、补画数与最后数，向家人解释哪幅要补得更多。别把未来想画的确认成已做。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-beads',
        '用每颗表示1的儿童计数架，约定计数区与备用区。实际分别拨出0～5，每次先恢复计数区空，再拨、读、写；两根杆分别摆3与0、2与4、2与2，配对比较并写三个符号。没有学具暂跳，不能用网页点数确认已经拨珠。',
      ],
      [
        'actual-subsets',
        '实际自画5只鸟，标2幼鸟和3成年鸟，成年里面2母鸟和1公鸟。圈出全部及成年范围，再在成年里面标母鸟，分别数5、3、2并说明已包含，不再把母鸟加入全部。请家人查看实际图与表达。',
      ],
      [
        'actual-columns',
        '实际画五列，每列5格，标签1～5，从下往上涂对应格数。五列全部完成，逐列数涂色格，核对标签并解释涂色不改变每列原来5格。',
      ],
      [
        'actual-rows',
        '另实际画五行各5圆，依次涂1～5个。逐行填写涂色与未涂两栏十个数，全部涂色行的未涂栏写0，每行两部分合回5检查。',
      ],
      [
        'actual-completion',
        '实际自画三瓶：目标2、4、5，先有1、1、3，逐瓶补齐；再画三圈各目标5个三角形，先有0、2、4，分别补齐。保留六图，记录原有、补画、最后数并实际向家人解释。没有动手或交流如实暂跳，未来计划不是已完成。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '实际完成后再记录，未做暂跳；网页判分不替代拨珠、画涂、纸笔和表达。',
      explanation: '人工查看真实操作与作品，确认完成不等于自动评为已掌握。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '已读0～5实际操作范围核验',
    notes: `ISBN ${source.isbn}第13、15、19、22～23页，原创任务。复习换行顺序、补图目标及已有数、鸟群数量和计数区比较。最终教师审校未核验，不将本课声明成完整单元。`,
  },
};
