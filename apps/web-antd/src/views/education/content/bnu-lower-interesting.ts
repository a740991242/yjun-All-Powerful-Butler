import type { Lesson } from '../learning/types';

export const bnuLowerInterestingLesson: Lesson = {
  id: 'bnu-lower-interesting',
  textbookTitle: '有趣的算式',
  title: '逆序加数、两组八行规律与全部缺数',
  page: 70,
  version: 1,
  status: 'available',
  goal: '完整对应70～71六原活动，探索和44/99逆序两位加数、两组八行及八道缺数，实际填写交流并记录自己的发现。',
  prerequisite: '能按十与个位计算百以内不进位加法、不退位减法。',
  parentTip:
    '原两整页实际核对；开放找式接受全部合法解，22可重复作加数，04不算两位数。后四行原空白，本站指定延续条件明确标注，自己的发现开放。十实做人工、五原话null，计划独立；旧ID/版本/schema1保持，未知版印与最终教师试用如实，不以学校作为前置。',
  review: {
    date: '2026-10-05',
    reviewer: '70～71两整页、全部行与缺数核对',
    notes: '六原活动对应，最终教师试用未核验。',
  },
  steps: [
    {
      title: '先看两组有趣算式',
      text: '原12+21=33、23+32=55。每组两个两位数交换十位和个位，结果十位与个位相同。本课给定都不进位；不能据此说任意交换数位的两数相加都不进位。',
      activity: '分别实际读两算式并指数位。',
    },
    {
      title: '找和为44的算式',
      text: '要求两个加数都是两位数，互换十位和个位，和为44。13+31、22+22都满足；31+13也满足。相同的22可以出现两次，04不是两位数。网页接受三种有序加数组合，不只认一个示例。',
      activity: '自己真实找出满足条件的算式并解释。',
    },
    {
      title: '写三个和为99的算式',
      text: '原示例18+81、45+54、36+63都得99。自己写三道不同的完整算式，各两个加数数位互换；两数顺序相反属于另一道书写算式，不能反复复制完全相同的式子。',
      activity: '真实在纸上写三式，核对每式条件并交流。',
    },
    {
      title: '加法八行按本站指定规律',
      text: '原练1左边前三行11+11、12+21、13+31，第四行给14，后四行全空。本站明确第一加数每行增加1、第二加数互换数位，填完八行到18+81；后四行这个延续条件由本站给出，不说原书只有这一种发现。字母A～Q依行从左到右填写。',
      activity: '实际完成原纸面八行；说明自己采用的规律。',
      visual: {
        kind: 'bnu-interesting',
        scene: 'addition',
        variant: 'main',
      },
    },
    {
      title: '把加法发现说完整',
      text: '按指定延续，和依次22、33、44、55、66、77、88、99，每行增加11。第一加数个位增1、第二加数十位增1，合起来增加1个一和1个十。发现用自己的原话记，不只背答案。',
      activity: '实际指每行并说明数位和增加量。',
    },
    {
      title: '减法八行按本站指定规律',
      text: '原右边22−11、33−21、44−31，第四行给55，后四行全空。本站明确被减数每行增加11、减数每行增加10，延续到99−81；字母A～Q逐行填。此条件明示，不给未限原题补造唯一答案。',
      activity: '实际完成原纸面八行并写采用的规律。',
      visual: {
        kind: 'bnu-interesting',
        scene: 'subtraction',
        variant: 'main',
      },
    },
    {
      title: '减法结果怎样变',
      text: '22−11=11、33−21=12，到99−81=18。被减数每次增加11、减数每次增加10，差每次增加1；不把加法的每次增加11照搬到减法结果。',
      activity: '分别比较两行，实际解释差的变化。',
    },
    {
      title: '八道缺数全部填',
      text: '原练2是1+空=12、12+空=23、23+空=34、34+空=45，及45到56、56到67、67到78、78到89。每道缺数均11，先十位添1个十、个位添1个一；不只填第一道。',
      activity: '在原纸面填全部八空，逐式检查。',
      visual: {
        kind: 'bnu-interesting',
        scene: 'eleven',
        variant: 'main',
      },
    },
    {
      title: '发现和真操作分别记录',
      text: '纸面、交流和自己的发现分别如实记录。可以提出另一组合法条件；网页答案正确不证明真实纸笔或讨论已做。个人发现开放记录，未做可说明。',
      activity: '如实记录三个规律的实际发现。',
    },
    {
      title: '零与下一次计划',
      text: '本站另给11−11=0，已知没有不同于空格未填。下一次准备做的算式独立记为计划，不当完成。',
      activity: '分别保存实际已做与未来准备做。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-interesting-examples',
      knowledge: 'bnu-lower-interesting',
      prompt: '原两算式12+21、23+32，依次填两个和。',
      rule: {
        kind: 'steps',
        values: [33, 55],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '12+21=33，23+32=55。',
    },
    {
      id: 'bnu-lower-interesting-example-digits',
      knowledge: 'bnu-lower-interesting',
      prompt: '原第一组12与21，依次填第一数十位/个位、第二数十位/个位。',
      rule: {
        kind: 'steps',
        values: [1, 2, 2, 1],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '十位与个位互换。',
    },
    {
      id: 'bnu-lower-interesting-reverse-meaning',
      knowledge: 'bnu-lower-interesting',
      prompt: '本课两加数有什么特征？',
      rule: {
        kind: 'choice',
        value: '十位与个位互相交换',
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '12与21、23与32的数位互换；不概括任何情况都无进位。',
      choices: [
        {
          id: '十位与个位互相交换',
          label: '十位与个位互相交换',
        },
        {
          id: '只交换两个数的书写顺序，数位不变',
          label: '只交换两个数的书写顺序，数位不变',
        },
        {
          id: '任何两数相加都不进位',
          label: '任何两数相加都不进位',
        },
      ],
    },
    {
      id: 'bnu-lower-interesting-find44',
      knowledge: 'bnu-lower-interesting',
      prompt:
        '填一组：两个两位加数互换十位与个位，和为44。第1、2项分别是两个加数。',
      rule: {
        kind: 'reversed-addends',
        result: 44,
        count: 1,
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '13+31、22+22、31+13都合法，接受全部。',
    },
    {
      id: 'bnu-lower-interesting-source44-examples',
      knowledge: 'bnu-lower-interesting',
      prompt: '原13+31与22+22，依次填两个和。',
      rule: {
        kind: 'steps',
        values: [44, 44],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '22反过来仍22，可以作为两个加数。',
    },
    {
      id: 'bnu-lower-interesting-repeated-addend',
      knowledge: 'bnu-lower-interesting',
      prompt: '22+22=44满足本课逆序加数条件吗？',
      rule: {
        kind: 'choice',
        value: '满足，22互换数位后仍是22',
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '这里没有规定两个加数一定不同。',
      choices: [
        {
          id: '满足，22互换数位后仍是22',
          label: '满足，22互换数位后仍是22',
        },
        {
          id: '不满足，同一个数不能再用',
          label: '不满足，同一个数不能再用',
        },
        {
          id: '不满足，和不是44',
          label: '不满足，和不是44',
        },
      ],
    },
    {
      id: 'bnu-lower-interesting-find99',
      knowledge: 'bnu-lower-interesting',
      prompt:
        '写三道不同的书写算式，两个两位加数数位互换且和为99。按第一道两个数、第二道两个数、第三道两个数共六项填。',
      rule: {
        kind: 'reversed-addends',
        result: 99,
        count: 3,
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation:
        '合法有序对18/81、27/72、36/63、45/54及四个逆序。每式两位、互换、和99，完全重复式不计不同。',
    },
    {
      id: 'bnu-lower-interesting-source99-examples',
      knowledge: 'bnu-lower-interesting',
      prompt: '原18+81、45+54、36+63依次填三个和。',
      rule: {
        kind: 'steps',
        values: [99, 99, 99],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '三式都得99。',
    },
    {
      id: 'bnu-lower-interesting-addition-all',
      knowledge: 'bnu-lower-interesting',
      prompt:
        '本站指定第一加数每行增1、第二加数互换数位。按八行从左到右填A～Q全部17空。',
      rule: {
        kind: 'steps',
        values: [
          22, 33, 44, 41, 55, 15, 51, 66, 16, 61, 77, 17, 71, 88, 18, 81, 99,
        ],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '八行11+11=22至18+81=99；第四行41/55、后四行三格都填。',
      visual: {
        kind: 'bnu-interesting',
        scene: 'addition',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-interesting-addition-increase',
      knowledge: 'bnu-lower-interesting',
      prompt: '按本站指定八行规律，后一行的和比前一行增加多少？',
      rule: {
        kind: 'number',
        value: 11,
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '第一加数增加1，第二增加10，和增加11。',
    },
    {
      id: 'bnu-lower-interesting-addition-place-increase',
      knowledge: 'bnu-lower-interesting',
      prompt:
        '按本站指定加法规律，两加数每行分别增加几？依次填第一、第二加数增加量。',
      rule: {
        kind: 'steps',
        values: [1, 10],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '1个一和1个十合11。',
    },
    {
      id: 'bnu-lower-interesting-subtraction-all',
      knowledge: 'bnu-lower-interesting',
      prompt:
        '本站指定被减数每行增11、减数每行增10。按八行从左到右填A～Q全部17空。',
      rule: {
        kind: 'steps',
        values: [
          11, 12, 13, 41, 14, 66, 51, 15, 77, 61, 16, 88, 71, 17, 99, 81, 18,
        ],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '22−11=11至99−81=18；第四行41/14，后四行全部填写。',
      visual: {
        kind: 'bnu-interesting',
        scene: 'subtraction',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-interesting-subtraction-increase',
      knowledge: 'bnu-lower-interesting',
      prompt: '按本站指定八行规律，后一行的差比前一行增加多少？',
      rule: {
        kind: 'number',
        value: 1,
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '被减数增11、减数增10，差增1。',
    },
    {
      id: 'bnu-lower-interesting-subtraction-place-increase',
      knowledge: 'bnu-lower-interesting',
      prompt: '按本站指定减法规律，依次填被减数与减数每行增加量。',
      rule: {
        kind: 'steps',
        values: [11, 10],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '增加量不同，差逐行增加1。',
    },
    {
      id: 'bnu-lower-interesting-eleven-all',
      knowledge: 'bnu-lower-interesting',
      prompt: '原八道缺数题，按行填A～H全部八个加数。',
      rule: {
        kind: 'steps',
        values: [11, 11, 11, 11, 11, 11, 11, 11],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '每道结果比已知加数多11，各独立核对。',
      visual: {
        kind: 'bnu-interesting',
        scene: 'eleven',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-interesting-eleven-places',
      knowledge: 'bnu-lower-interesting',
      prompt: '增加11，依次填增加几个十、几个一。',
      rule: {
        kind: 'steps',
        values: [1, 1],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '一个十和一个一，不是只加1。',
    },
    {
      id: 'bnu-lower-interesting-leading-zero',
      knowledge: 'bnu-lower-interesting',
      prompt: '40反过来写04，04能作为本课的两位加数吗？',
      rule: {
        kind: 'choice',
        value: '不能，04表示4，不是两位数',
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '十位不能为0，不能把4改写成两位数。',
      choices: [
        {
          id: '不能，04表示4，不是两位数',
          label: '不能，04表示4，不是两位数',
        },
        {
          id: '能，写了两位字符就是两位数',
          label: '能，写了两位字符就是两位数',
        },
        {
          id: '能，04和40同一个数',
          label: '能，04和40同一个数',
        },
      ],
    },
    {
      id: 'bnu-lower-interesting-site-zero',
      knowledge: 'bnu-lower-interesting',
      prompt: '本站另给11−11，差是多少？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '差是已知0，不是未填。',
    },
    {
      id: 'bnu-lower-interesting-actual-examples',
      knowledge: 'bnu-lower-interesting',
      prompt: '真实读并逐位比较12/21、23/32，解释两个原算式。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只有计划可跳过，实际做过才确认。',
      explanation: '实际纸笔或交流做过才确认，网页答对不能代替真实活动。',
    },
    {
      id: 'bnu-lower-interesting-actual-find44',
      knowledge: 'bnu-lower-interesting',
      prompt: '纸笔自己找和44的逆序两位加数，完整写式并解释，可以不同于示例。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只有计划可跳过，实际做过才确认。',
      explanation: '实际纸笔或交流做过才确认，网页答对不能代替真实活动。',
    },
    {
      id: 'bnu-lower-interesting-actual-find99',
      knowledge: 'bnu-lower-interesting',
      prompt: '纸笔实际写三道不同的和99算式，每式核对逆序两位加数。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只有计划可跳过，实际做过才确认。',
      explanation: '实际纸笔或交流做过才确认，网页答对不能代替真实活动。',
    },
    {
      id: 'bnu-lower-interesting-actual-addition',
      knowledge: 'bnu-lower-interesting',
      prompt: '回合法教材完整填写左组八行，包含后四行，说明采用的规律。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只有计划可跳过，实际做过才确认。',
      explanation: '实际纸笔或交流做过才确认，网页答对不能代替真实活动。',
    },
    {
      id: 'bnu-lower-interesting-actual-addition-discussion',
      knowledge: 'bnu-lower-interesting',
      prompt: '真实指八行加法说明两个加数和结果的变化，交流自己的发现。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只有计划可跳过，实际做过才确认。',
      explanation: '实际纸笔或交流做过才确认，网页答对不能代替真实活动。',
    },
    {
      id: 'bnu-lower-interesting-actual-subtraction',
      knowledge: 'bnu-lower-interesting',
      prompt: '回合法教材完整填写右组八行，包含后四行，说明采用的规律。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只有计划可跳过，实际做过才确认。',
      explanation: '实际纸笔或交流做过才确认，网页答对不能代替真实活动。',
    },
    {
      id: 'bnu-lower-interesting-actual-subtraction-discussion',
      knowledge: 'bnu-lower-interesting',
      prompt: '真实指八行减法说明被减数、减数和差分别怎样变化。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只有计划可跳过，实际做过才确认。',
      explanation: '实际纸笔或交流做过才确认，网页答对不能代替真实活动。',
    },
    {
      id: 'bnu-lower-interesting-actual-eleven',
      knowledge: 'bnu-lower-interesting',
      prompt: '回合法原书填写全部八个缺数，再逐式核对。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只有计划可跳过，实际做过才确认。',
      explanation: '实际纸笔或交流做过才确认，网页答对不能代替真实活动。',
    },
    {
      id: 'bnu-lower-interesting-actual-eleven-discussion',
      knowledge: 'bnu-lower-interesting',
      prompt: '真实解释八题增加11与一个十/一个一的关系并交流。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只有计划可跳过，实际做过才确认。',
      explanation: '实际纸笔或交流做过才确认，网页答对不能代替真实活动。',
    },
    {
      id: 'bnu-lower-interesting-actual-own',
      knowledge: 'bnu-lower-interesting',
      prompt:
        '实际自己提出另一组合法算式条件，完整写式并说明发现，不用购买材料。',
      rule: {
        kind: 'manual',
      },
      hint: '未做或只有计划可跳过，实际做过才确认。',
      explanation: '实际纸笔或交流做过才确认，网页答对不能代替真实活动。',
    },
    {
      id: 'bnu-lower-interesting-addition-discovery',
      knowledge: 'bnu-lower-interesting',
      prompt: '记录自己实际观察到的加法规律与采用的后四行条件。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记录，也可跳过。',
      explanation: '开放记录correct:null，真实操作与未来计划分记。',
    },
    {
      id: 'bnu-lower-interesting-subtraction-discovery',
      knowledge: 'bnu-lower-interesting',
      prompt: '记录自己实际观察到的减法规律，不统一判原话对错。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记录，也可跳过。',
      explanation: '开放记录correct:null，真实操作与未来计划分记。',
    },
    {
      id: 'bnu-lower-interesting-eleven-discovery',
      knowledge: 'bnu-lower-interesting',
      prompt: '记录八缺数题的实际发现和仍需帮助之处。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记录，也可跳过。',
      explanation: '开放记录correct:null，真实操作与未来计划分记。',
    },
    {
      id: 'bnu-lower-interesting-method-record',
      knowledge: 'bnu-lower-interesting',
      prompt: '记录自己实际找算式的办法与例子，允许不同合理答案。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记录，也可跳过。',
      explanation: '开放记录correct:null，真实操作与未来计划分记。',
    },
    {
      id: 'bnu-lower-interesting-plan',
      knowledge: 'bnu-lower-interesting',
      prompt: '单独记录下一次准备做的练习，未来计划不当已完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '如实记录，也可跳过。',
      explanation: '开放记录correct:null，真实操作与未来计划分记。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-interesting-review-find66',
      knowledge: 'bnu-lower-interesting',
      prompt: '本站新题：填一组互换数位的两位加数，和为66。',
      rule: {
        kind: 'reversed-addends',
        result: 66,
        count: 1,
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '15+51、24+42、33+33及逆序都合法。',
    },
    {
      id: 'bnu-lower-interesting-review-find77',
      knowledge: 'bnu-lower-interesting',
      prompt:
        '本站新题：填三道不同的书写算式，两个两位加数数位互换且和为77。六项按每道两个加数填。',
      rule: {
        kind: 'reversed-addends',
        result: 77,
        count: 3,
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '16/61、25/52、34/43及逆序均可，不能复制和99的式子。',
    },
    {
      id: 'bnu-lower-interesting-review-addition',
      knowledge: 'bnu-lower-interesting',
      prompt: '本站把八行加法改为从18+81向11+11倒排，逐行填A～H八个和。',
      rule: {
        kind: 'steps',
        values: [99, 88, 77, 66, 55, 44, 33, 22],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '按当前行序重新计算，不复制17空原答案。',
      visual: {
        kind: 'bnu-interesting',
        scene: 'addition',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-interesting-review-subtraction',
      knowledge: 'bnu-lower-interesting',
      prompt: '本站把八行减法从99−81倒排到22−11，逐行填A～H八个差。',
      rule: {
        kind: 'steps',
        values: [18, 17, 16, 15, 14, 13, 12, 11],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '差从18逐一减少到11。',
      visual: {
        kind: 'bnu-interesting',
        scene: 'subtraction',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-interesting-review-missing',
      knowledge: 'bnu-lower-interesting',
      prompt: '本站八道新缺数题，按行填A～H全部缺数。',
      rule: {
        kind: 'steps',
        values: [22, 22, 22, 22, 22, 22, 22, 22],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '2到24、12到34等各增加22，不复制原11。',
      visual: {
        kind: 'bnu-interesting',
        scene: 'eleven',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-interesting-review-example',
      knowledge: 'bnu-lower-interesting',
      prompt: '本站24+42，依次填第一数、第二数与和。',
      rule: {
        kind: 'steps',
        values: [24, 42, 66],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '24与42互换数位，和66。',
    },
    {
      id: 'bnu-lower-interesting-review-reverse',
      knowledge: 'bnu-lower-interesting',
      prompt: '本站把两位数27互换十位与个位，得到哪个数？',
      rule: {
        kind: 'number',
        value: 72,
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '个位7到十位、十位2到个位，得72。',
    },
    {
      id: 'bnu-lower-interesting-review-changes',
      knowledge: 'bnu-lower-interesting',
      prompt:
        '本站新规律第一加数每行增2，第二加数每行增20；依次填两增加量与和增加量。',
      rule: {
        kind: 'steps',
        values: [2, 20, 22],
      },
      hint: '先读十位与个位，两个加数互换数位；完整核对算式，再按当前题给出的规律逐行填。字母空格不是0。',
      explanation: '2个一与2个十合22，不能照搬1/10/11。',
    },
  ],
};
