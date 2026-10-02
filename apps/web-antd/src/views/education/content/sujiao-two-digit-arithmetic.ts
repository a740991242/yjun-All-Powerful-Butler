import type { Lesson, Question } from '../learning/types';

import { sujiaoLowerSource as source } from './sujiao-lower-source';

function pack(tens: boolean): Lesson {
  const id = tens ? 'sj-lower-two-digit-tens' : 'sj-lower-two-digit-ones';
  function tasks(review: boolean): Question[] {
    const a = (() => {
      if (tens) return review ? 46 : 35;
      return review ? 64 : 47;
    })();
    const b = (() => {
      if (tens) return review ? 30 : 20;
      return review ? 3 : 2;
    })();
    const place = tens ? '十位' : '个位';
    const unchanged = tens ? '个位' : '十位';
    const unit = tens ? '十' : '一';
    const part = tens ? Math.floor(a / 10) * 10 : a % 10;
    const rest = a - part;
    const number = (
      key: string,
      prompt: string,
      value: number,
      explanation: string,
    ): Question => ({
      id: `${id}-${review ? 'r' : 'q'}-${key}`,
      knowledge: `${id}-${key}`,
      prompt,
      rule: { kind: 'number', value },
      hint: `把${a}拆成整十和个位，先计算同单位的数量，再合起来。`,
      explanation,
    });
    const choice = (
      key: string,
      prompt: string,
      choices: string[],
      value: string,
      explanation: string,
    ): Question => ({
      id: `${id}-${review ? 'r' : 'q'}-${key}`,
      knowledge: `${id}-${key}`,
      prompt,
      choices: choices.map((label, i) => ({ id: String(i), label })),
      rule: { kind: 'choice', value },
      hint: `看加减的${b}表示几个${unit}，不是只看写了几个数字。`,
      explanation,
    });
    const add = number(
      'add',
      `${a}＋${b}＝多少？`,
      a + b,
      `${part}＋${b}＝${part + b}，再加${rest}，得到${a + b}。`,
    );
    add.visual = {
      kind: 'digit-counter',
      tens: Math.floor(a / 10),
      ones: a % 10,
    };
    const subtract = number(
      'subtract',
      `${a}－${b}＝多少？`,
      a - b,
      `${part}－${b}＝${part - b}，再加${rest}，得到${a - b}。`,
    );
    subtract.visual = {
      kind: 'digit-counter',
      tens: Math.floor(a / 10),
      ones: a % 10,
    };
    return [
      add,
      subtract,
      choice(
        'unit',
        `${a}＋${b}，${b}应该和哪个数位上的数量合起来？`,
        ['十位', '个位'],
        tens ? '0' : '1',
        `${b}表示${b / (tens ? 10 : 1)}个${unit}，与${place}上的同单位数量相加。`,
      ),
      number(
        'first-add',
        `按拆数方法算${a}＋${b}：先算${part}＋${b}，这一步得多少？`,
        part + b,
        `这是中间结果${part + b}，还要加保留的${rest}，不能当成最后总数。`,
      ),
      number(
        'first-subtract',
        `按拆数方法算${a}－${b}：先算${part}－${b}，这一步得多少？`,
        part - b,
        `中间结果${part - b}加上保留的${rest}才是${a - b}。`,
      ),
      choice(
        'unchanged',
        `计算${a}＋${b}和${a}－${b}，在本题范围内哪个数位上的数字不变？`,
        ['十位', '个位', '两个数位都不变'],
        tens ? '1' : '0',
        `${unchanged}数字不变，${place}分别增加或减少；本课${tens ? '加减整十数' : '限定不进位加、不退位减'}，不能推广为所有加减法。`,
      ),
      tens
        ? number(
            'reverse',
            `${b}＋${a}＝多少？`,
            a + b,
            `相加调换顺序，总数仍是${a + b}；不能因此调换减法顺序。`,
          )
        : number(
            'zero',
            `${rest + b}－${b}＝多少？个位全部减完时也要保留数位。`,
            rest,
            `${b}－${b}＝0，${rest}＋0＝${rest}，个位0不能省略。`,
          ),
      choice(
        'compare',
        `不逐个重算，${a}＋${b}与${a}－${b}相比，前者怎样？`,
        ['大于后者', '等于后者', '小于后者'],
        '0',
        `同一个起始数，增加${b}与减少${b}不同，前者更大。`,
      ),
      number(
        'join',
        `原有${a}张贴纸，又收到${b}张，现在共有多少张？`,
        a + b,
        `把原有和新增合起来，${a}＋${b}＝${a + b}（张）。`,
      ),
      number(
        'leave',
        `原有${a}张贴纸，送出${b}张，还剩多少张？`,
        a - b,
        `从原有数量中去掉送出的，${a}－${b}＝${a - b}（张）。`,
      ),
      number(
        'missing-part',
        `两次共收集${a + b}张贴纸，第一次收集${b}张，第二次收集多少张？`,
        a,
        `总数减去已知部分，${a + b}－${b}＝${a}（张）。`,
      ),
      choice(
        'mistake',
        `有人算${a}＋${b}时，先得到${part + b}就停止了。该怎样核对？`,
        [`还要加上保留的${rest}`, '直接把中间结果当总数', '把两个数写在一起'],
        '0',
        `拆数计算要把保留的${rest}合回来；珠子的颗数也不是所表示的总数。`,
      ),
    ];
  }
  return {
    id,
    title: tens
      ? '两位数加减整十数：同单位计算'
      : '两位数加减一位数：不进位与不退位',
    textbookTitle: '两位数加、减整十数和一位数',
    page: tens ? 58 : 60,
    version: 1,
    status: 'preparing',
    goal: tens
      ? '理解整十数改变十位数量，用拆数和计数器说明加减，解决合并、剩余与求另一部分的问题。'
      : '在个位够减、相加不满十的条件下，先计算个位，再合回整十，区分中间结果和总数。',
    prerequisite:
      '认识两位数的十位与个位，会计算同单位的加减；准备纸笔、成捆小棒或计数器。',
    parentTip: `依据实际读到的印刷${tens ? '58～59' : '60～61'}页活动范围，原创例子和练习，不打包原图。图中每颗十位珠表示10、个位珠表示1，静态原图不显示运算结果；实际摆拨由家长观察确认。${tens ? '结果限定100以内，不用珠子总颗数代替数值。' : '本课仅不进位加、不退位减，不以十位不变概括其它加减法。'}`,
    steps: tens
      ? [
          {
            title: '先分清加的是几个十',
            text: '35是3个十和5个一，20是2个十。35＋20先合并3个十与2个十，再保留5个一，得到55；不把20当2个一。',
            visual: { kind: 'digit-counter', tens: 3, ones: 5 },
            activity: '实际摆3捆与5根，再增加2捆，每捆10根；说明增加的是20根。',
          },
          {
            title: '减整十数，只取走对应的十',
            text: '35－20取走2个十，留下1个十和5个一，是15。可以先算30－20＝10，再算10＋5＝15，不能忘掉原有5个一。',
            visual: { kind: 'digit-counter', tens: 3, ones: 5 },
            activity: '实际从3捆5根中取走2捆，逐项核对剩下的捆和散根。',
          },
          {
            title: '记录中间一步与最后得数',
            text: '35＋20可以记录30＋20＝50，50＋5＝55；35－20记录30－20＝10，10＋5＝15。中间的50与10都不是最后总数。这里个位数字不变，十位增加或减少。',
            activity: '在纸上完整写两步，再口述每步的单位与保留部分。',
          },
          {
            title: '看清问的是总数还是剩余',
            text: '原有35张，又收到20张，求合并总数用加法；原有35张，送出20张，求剩余用减法。若共55张，第一次20张，求第二次则用55－20。先说明数量关系再计算，不看关键词机械套式。',
            activity: '画两段纸条表示已知部分与总数，分别说明三个问题。',
          },
          {
            title: '换一组数核对方法',
            text: '46＋30先算40＋30＝70，再加6得76；46－30先算40－30＝10，再加6得16。相加可换顺序，但减法不能用30－46代替46－30。本课范围内个位保留，不说明任何运算都不变。',
            visual: { kind: 'digit-counter', tens: 4, ones: 6 },
            activity: '实际换成4捆6根，演示加、减3捆并独立写出算式。',
          },
        ]
      : [
          {
            title: '加一位数先合个位',
            text: '42是4个十和2个一。42＋5先算2＋5＝7，再算40＋7＝47。个位相加不足10，不需换捆，不能把5加到十位。',
            visual: { kind: 'digit-counter', tens: 4, ones: 2 },
            activity: '实际摆4捆2根再添5根，分别数捆与散根。',
          },
          {
            title: '个位够减才直接取散根',
            text: '42－2先算2－2＝0，再算40＋0＝40。个位0仍占位，不能只写4。本课减法从散根中直接取走，个位不够减的情形另学，不能继续沿用十位不变。',
            visual: { kind: 'digit-counter', tens: 4, ones: 2 },
            activity: '实际取走2根，保留4捆，写40并说明个位0。',
          },
          {
            title: '比较加法与减法的拆数',
            text: '47＋2先算7＋2＝9，再合40得到49；47－2先算7－2＝5，再合40得到45。两题都先计算个位，操作方向不同。十位40不能忘掉，中间9或5不是总数。',
            visual: { kind: 'digit-counter', tens: 4, ones: 7 },
            activity: '从4捆7根分别添、取2根，每次重新从原数开始。',
          },
          {
            title: '对比整十数和一位数',
            text: '42＋20得62，而42＋5得47。20是2个十，5是5个一，同单位计算的位置不同。不进位加和不退位减里十位不变，不能把这个条件省掉。',
            activity: '纸面分别标注两个加数表示几个十或几个一。',
          },
          {
            title: '用数量关系选运算',
            text: '47张贴纸又收到2张，求总数用47＋2；送出2张，求剩余用47－2。共49张，其中一份2张，另一份49－2＝47。不能把两个数直接拼起来，也不能用珠子颗数替代数值。',
            activity: '实际画图口述合并、剩余和求另一部分的区别。',
          },
        ],
    questions: [
      ...tasks(false),
      ...[
        tens
          ? '实际从3捆5根演示增加2捆和取走2捆，每次从原数重新开始，并核对每捆10根。'
          : '实际从4捆2根演示添5根；再重新摆4捆2根并取走2根，写出47和40并解释个位0。',
        tens
          ? '实际拨计数器或画双杆，分别说明35＋20与35－20改变十位、保留个位。'
          : '实际用计数器或画双杆说明47＋2与47－2，指出不进位、不退位的条件。',
        '实际在纸上写出两步拆数计算，再画图或口述一个合并、一个剩余问题；解释单位与中间结果。',
      ].map((prompt, index): Question => ({
        id: `${id}-manual-${index}`,
        knowledge: `${id}-manual-${index}`,
        prompt,
        rule: { kind: 'manual' },
        hint: '实际完成后由家长独立确认，尚未完成可暂时跳过。',
        explanation: '静态图和网页得分不自动确认实际摆拨、书写或口述。',
      })),
      {
        id: `${id}-reflection`,
        knowledge: `${id}-reflection`,
        prompt:
          '你怎样判断先计算哪个数位？写下一个容易混淆的地方或待核对的问题。',
        rule: { kind: 'reflection' },
        hint: '记录真实想法，可以多种表达。',
        explanation: '开放反思不评分，不能代替实际活动。',
      },
    ],
    reviewQuestions: tasks(true),
    review: {
      date: source.checkedAt,
      reviewer: '已读运算活动范围核验',
      notes: `ISBN ${source.isbn}印刷${tens ? '58～59' : '60～61'}页，原创教学；复习更换数值，版次印次未知，未声称整单元完成。`,
    },
  };
}
export const sujiaoTwoDigitTensDraft = pack(true);
export const sujiaoTwoDigitOnesDraft = pack(false);
