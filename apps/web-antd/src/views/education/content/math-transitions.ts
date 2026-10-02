import type { Lesson, Question } from '../learning/types';

type Draft = Omit<Question, 'id'>;
function numeric(
  knowledge: string,
  prompt: string,
  value: number,
  hint: string,
  explanation: string,
): Draft {
  return {
    knowledge,
    prompt,
    rule: { kind: 'number', value },
    hint,
    explanation,
  };
}
function choice(
  knowledge: string,
  prompt: string,
  labels: string[],
  value: string,
  hint: string,
  explanation: string,
): Draft {
  return {
    knowledge,
    prompt,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint,
    explanation,
  };
}
function bridge(
  id: string,
  title: string,
  textbookTitle: string,
  page: number,
  goal: string,
  text: string,
  questions: Draft[],
): Lesson {
  return {
    id,
    title,
    textbookTitle,
    page,
    goal,
    prerequisite:
      '可以直接选择，不要求先完成上册。遇到困难可返回对应课包复习。',
    parentTip:
      '请先让孩子独立尝试。代读题目用“记录家长帮读题”单独记录，方法帮助用提示；手工操作仅由孩子或家长确认完成。',
    version: 1,
    status: 'available',
    steps: [
      { title: '上下册知识连接', text },
      {
        title: '先做一次，再说理由',
        text: '这组任务用于回顾上册基础并接触下册；结果只帮助选择要复习的知识点，不决定能否学习下册。',
        activity: '选一个问题，用纸片、小棒或自己的话说明理由。',
      },
    ],
    questions: questions.map((question, index) => ({
      ...question,
      id: `${id}-q${index + 1}`,
    })),
    review: {
      date: '2026-09-30',
      reviewer: '教材范围核验与原创题目程序校验',
      notes:
        '依据人教社2024六三学制数学上册U3/U4/U5与下册U1/U2/U3的已核定知识范围制作；这是平台原创衔接活动，不是教材新增单元或入学测评。',
    },
  };
}

export const mathTransitions: Lesson[] = [
  bridge(
    'mt-place',
    '数位衔接：一个十与几个一',
    '11～20的认识 → 100以内数的认识',
    23,
    '回顾十和一、数序与比较，为多个十的学习做好准备。',
    '先用小棒摆出10个一，再捆成1个十；数位中的数字表示有几个这样的单位。进入下册后，会接着学习多个十和100。',
    [
      numeric(
        'mu-twenty-place',
        '10个一合起来是几个十？',
        1,
        '把每10根小棒捆成一捆。',
        '10个一是1个十。',
      ),
      numeric(
        'mu-twenty-place',
        '1个十和4个一组成多少？',
        14,
        '一捆10根，再加4根。',
        '10+4=14。',
      ),
      numeric(
        'mu-twenty-place',
        '17的十位数字是几？',
        1,
        '最右边是个位，左边是十位。',
        '17有1个十和7个一，十位数字是1。',
      ),
      numeric(
        'mu-twenty-place',
        '2个十合起来是多少？',
        20,
        '每个十有10个一。',
        '10+10=20。',
      ),
      numeric(
        'ml-hundred-sequence',
        '19后面的一个数是多少？',
        20,
        '再增加一个一，满10个一合成一个十。',
        '19后面是20。',
      ),
      numeric(
        'mu-twenty-compare',
        '15比12多几？',
        3,
        '比较两排小棒，多出的一段是多少？',
        '15-12=3。',
      ),
    ],
  ),
  bridge(
    'mt-calculation',
    '计算衔接：分合、凑十与退位',
    '20以内的进位加法 → 20以内的退位减法',
    8,
    '联系分与合、凑十加法和想加算减。',
    '凑十加法与退位减法都能用数的分合帮助理解。比如知道9加4是13，就可以想13减9是4。计算方法可以不同，要说清每一步的数量。',
    [
      {
        knowledge: 'mu-ten-partition',
        prompt: '把10分成两个正整数，依次填写两个数。',
        rule: { kind: 'partition', total: 10, parts: 2, minimum: 1 },
        hint: '两个数的和要是10，每个至少1。',
        explanation: '1和9、2和8、3和7等分法都正确。',
      },
      numeric(
        'mu-carry-eight',
        '8加几等于17？',
        9,
        '想一想8加上哪个数得到17。',
        '8+9=17，填9。',
      ),
      numeric(
        'mu-twenty-addsub',
        '13-3等于多少？',
        10,
        '13分成10和3。',
        '13-3=10。',
      ),
      {
        knowledge: 'mu-carry-nine',
        prompt:
          '用凑十法算9+6：依次填9还差几凑十、6分出这部分后还剩几、最终和。',
        rule: { kind: 'steps', values: [1, 5, 15] },
        hint: '把6分成1和5，先算9+1。',
        explanation: '9差1凑十，6分成1和5，10+5=15。',
        visual: { kind: 'ten-frame', left: 9, right: 6 },
      },
      numeric(
        'ml-borrow-nine',
        '13-9等于多少？',
        4,
        '想9加几等于13，也可以先算10-9再加3。',
        '9+4=13，所以13-9=4。',
      ),
      numeric(
        'mu-carry-eight',
        '6块积木和7块积木合起来有几块？',
        13,
        '可以把7分成4和3，让6先凑十。',
        '6+4=10，10+3=13块。',
      ),
    ],
  ),
  bridge(
    'mt-shapes',
    '图形衔接：立体的面与平面图形',
    '认识立体图形 → 认识平面图形',
    1,
    '区分立体与平面，联系物体表面和描出的轮廓。',
    '立体物体有厚度，平面图形是描下的轮廓。球与圆要分清：球是立体，圆是平面图形。转动纸片不会改变图形的种类。',
    [
      choice(
        'ml-flat',
        '把正方体的一个面沿边描下来，得到什么平面图形？',
        ['圆', '正方形', '三角形'],
        '正方形',
        '观察正方体的每个面。',
        '正方体的每个面都是正方形。',
      ),
      choice(
        'ml-flat',
        '把圆柱的一个底面沿边描下来，得到什么平面图形？',
        ['圆', '长方形', '三角形'],
        '圆',
        '观察圆柱两个平平的底面。',
        '圆柱的底面是圆。',
      ),
      choice(
        'mu-solid',
        '球有可以平稳贴在纸上、沿边描圆的平平的面吗？',
        ['有', '没有'],
        '没有',
        '球的表面都是弯曲的。',
        '球没有平平的面，不能把球和圆混称。',
      ),
      choice(
        'ml-flat',
        '正方形纸片转一个方向后，还是正方形吗？',
        ['是', '不是'],
        '是',
        '观察边和角是否改变。',
        '只改变摆放方向，图形种类不变。',
      ),
      {
        knowledge: 'ml-flat',
        prompt: '选择所有平面图形。',
        choices: ['球', '圆', '正方体', '三角形'].map((label) => ({
          id: label,
          label,
        })),
        rule: { kind: 'set', values: ['圆', '三角形'] },
        hint: '区分有厚度的立体物体和纸上平面轮廓。',
        explanation: '圆和三角形是平面图形，球和正方体是立体图形。',
      },
      {
        knowledge: 'ml-flat',
        prompt:
          '找一个盒子，把一个面沿边描在纸上，说说描出的平面图形。由孩子或家长确认完成。',
        rule: { kind: 'manual' },
        hint: '可以选面是长方形的纸盒；不使用尖锐工具。',
        explanation:
          '这是一项实物操作记录，不自动评价描线质量或口头表达是否正确。',
      },
    ],
  ),
];
