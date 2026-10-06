import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { englishQihangSource } from './english-qihang-source';

/** Original preparatory content. Not registered as an available textbook.
 * page refers to the checked teacher chapter, not a verified student-book page.
 */
function task(
  lesson: string,
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
): Question {
  return {
    id: `${lesson}-${suffix}`,
    knowledge: lesson,
    prompt,
    rule,
    explanation,
    hint: '先理解交际情境或逐个点数，再选词；字形答对不证明听懂、读准或实际交流。',
  };
}
function choose(
  lesson: string,
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
): Question {
  return {
    ...task(lesson, suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(lesson: string, suffix: string, prompt: string) {
  return task(
    lesson,
    suffix,
    prompt,
    { kind: 'manual' },
    '孩子与陪学者实际完成后再确认；没做可跳过。文字练习不能自动确认发音、听辨、绘画或对话。',
  );
}
function record(lesson: string, suffix: string, prompt: string) {
  return task(
    lesson,
    suffix,
    prompt,
    { kind: 'reflection' },
    '按实际情况保留原话，不判对错；未做、实际收获与以后计划分开记录。',
  );
}
function draft(
  id: string,
  title: string,
  page: number,
  goal: string,
  prerequisite: string,
  steps: Lesson['steps'],
  questions: Question[],
  reviewQuestions: Question[],
): Lesson {
  return {
    id,
    textbookTitle: '新启航英语教师资源对应原创教学草稿',
    title,
    page,
    version: 1,
    status: 'preparing',
    goal,
    prerequisite,
    parentTip:
      '依据官方教师资源上册前两单元的已读范围制作。page为教师分章印刷页起点，学生教材身份尚待核齐。情境、练习和圆点图均为原创，不复制原故事、插画、韵文或录音。可用中文帮读任务；不要求写单词、取英文名、上传实名或个人照片。读音请用合法规范示范，本稿无音频，不以选择题评口语。不是苏州译林一年级正式教材，也不证明任何地区统一选用。',
    review: {
      date: englishQihangSource.checkedAt,
      reviewer: '官方教师资源上册前两单元逐页核对范围',
      notes:
        '原创基础草稿；整单元故事与所有活动未完整映射，学生用书身份和最终教学验收继续。',
    },
    steps,
    questions,
    reviewQuestions,
  };
}

const greeting = 'english-qihang-upper-greetings-draft';
const name = 'english-qihang-upper-name-draft';
const numbers = 'english-qihang-upper-number-words-draft';
const counting = 'english-qihang-upper-counting-draft';
const words = ['one', 'two', 'three', 'four', 'five', 'six'];

export const englishQihangDraftLessons: Lesson[] = [
  draft(
    greeting,
    '见面问好与友好邀请',
    1,
    '在见面、初次认识和邀请游戏三个情境中理解简单用语，并尝试与陪学者交流。',
    '不要求已会英语；能在中文帮读下理解见面与邀请。',
    [
      {
        title: '见面先问好',
        text: '小安在活动室遇到新朋友，先说Hello!，朋友可以回应Hi!。Hello和Hi都能用于问好，不给它们虚构不同的标准答案。本课看见文字认意思，实际听音要另用规范示范。',
        activity: '陪学者先示范，小朋友轮流用Hello或Hi问好；没实际练习不确认。',
      },
      {
        title: '第一次认识',
        text: '初次认识时可以说Nice to meet you.，意思是很高兴认识你。这里练理解整句话，不要求拆语法或抄写，也不把一次选对当作已经能流利说出。',
      },
      {
        title: '邀请一起玩',
        text: '小安邀请朋友做桌面卡片游戏：Let’s play!。朋友愿意参加，可以回应OK!。邀请与自我介绍是不同意思；不想参加时可以说明自己的意愿，不强迫说OK。',
        activity: '与陪学者交换邀请者和应答者；实际交流时尊重对方是否愿意。',
      },
      {
        title: '自己安排短对话',
        text: '先见面问好，再说初次认识的友好话，最后在合适时提出游戏邀请。你可以只练两句，也可以多练；交流次数由实际做过决定，网页不会自动代你完成。',
      },
    ],
    [
      choose(
        greeting,
        'hello',
        'Hello!通常用来做什么？',
        '问好',
        ['问好', '数数', '介绍名字'],
        'Hello是问好用语。',
      ),
      choose(
        greeting,
        'hi',
        'Hi!通常用来做什么？',
        '问好',
        ['介绍名字', '问好', '数数'],
        'Hi也能问好。',
      ),
      choose(
        greeting,
        'meet',
        'Nice to meet you.表达哪种意思？',
        '很高兴认识你',
        ['我叫小安', '一起玩吧', '很高兴认识你'],
        '这句话表达认识新朋友的高兴。',
      ),
      choose(
        greeting,
        'invite',
        '想邀请朋友一起玩，可以说哪句？',
        'Let’s play!',
        ['My name is An.', 'Let’s play!', 'Nice to meet you.'],
        'Let’s play是游戏邀请；其它两句意思不同。',
      ),
      choose(
        greeting,
        'ok',
        '朋友邀请游戏，你愿意参加，可回应什么？',
        'OK!',
        ['OK!', 'My name is An.', 'six'],
        '在这个情境下，OK表示同意。',
      ),
      choose(
        greeting,
        'both',
        '关于Hello和Hi，哪句正确？',
        '两句都能问好',
        ['只有Hello能问好', '两句都能问好', '两句都是名字'],
        '不能把Hi当作错误问候。',
      ),
      actual(
        greeting,
        'say',
        '听陪学者的规范示范，再尝试说Hello、Hi和Nice to meet you；实际尝试后确认。',
      ),
      actual(
        greeting,
        'dialogue',
        '与陪学者实际轮换问好、邀请与应答两个角色；没有进行可跳过。',
      ),
      record(
        greeting,
        'today',
        '记录今天实际说过哪句、哪里需要帮助；没练过如实写未做。',
      ),
      record(greeting, 'plan', '另记以后想怎样练习；计划不当作今天已完成。'),
    ],
    [
      choose(
        greeting,
        'review-meet',
        '第一次认识小伙伴，哪句表达很高兴认识你？',
        'Nice to meet you.',
        ['Let’s play!', 'Nice to meet you.', 'My name is Bo.'],
        '新情境仍是初次认识。',
      ),
      choose(
        greeting,
        'review-invite',
        '哪句是在邀请一起玩？',
        'Let’s play!',
        ['Let’s play!', 'Hi!', 'Hello!'],
        '问好与邀请的作用分开。',
      ),
      actual(
        greeting,
        'review-say',
        '在新的原创活动室情境中实际练一轮问好与邀请；未做可跳过。',
      ),
    ],
  ),
  draft(
    name,
    '介绍自己的名字',
    1,
    '理解I’m与My name is两种自我介绍用法，使用自选昵称进行真实交流。',
    '知道Hello和Hi可问好；能区分自己和对方。',
    [
      {
        title: '说自己叫什么',
        text: '示例昵称An：I’m An.可以表示我叫An；My name is An.也可以介绍同一个名字。两种表达都可以，不把一种固定成唯一正确说法。昵称可以用自己的选择，不要求另取英文名。',
      },
      {
        title: '听是谁在介绍',
        text: '新朋友说My name is Bo.，这里Bo是新朋友的名字。自己再介绍时可以说自己的昵称，不需要把对方的名字照搬到自己身上。',
        activity: '陪学者与孩子各用一个虚构昵称，轮流介绍，再指出说话者是谁。',
      },
      {
        title: '制作不公开的昵称卡',
        text: '在纸上画自己的标记，昵称不会写可以请陪学者代写；用名字卡辅助说I’m…或My name is…，不把代写认作孩子会拼写。卡片留在本地，不需要学校、住址、电话或上传照片。',
        activity: '实际制作卡片并用它介绍；只看示例不等于已制作。',
      },
      {
        title: '问好之后介绍',
        text: '先Hello!，再用一种自我介绍方式，接着说Nice to meet you.。这是原创短对话支架，可以按实际能力只练其中两句，不要求固定背诵整段。',
      },
    ],
    [
      choose(
        name,
        'im',
        'I’m An.在名字介绍中是什么意思？',
        '我叫An',
        ['我叫An', '一起玩吧', '你叫An'],
        'I’m在这个名字情境里介绍自己。',
      ),
      choose(
        name,
        'my-name',
        'My name is Bo.介绍的是谁的名字？',
        '说话者',
        ['听话者', '说话者', '桌子'],
        'My name指说话者自己的名字。',
      ),
      choose(
        name,
        'two-forms',
        '哪组都能介绍自己的名字？',
        'I’m An.／My name is An.',
        ['Hello!／Let’s play!', 'I’m An.／My name is An.', 'Hi!／OK!'],
        '两种形式都能用于同一个名字介绍。',
      ),
      choose(
        name,
        'speaker',
        '示例：小安说I’m An.，小波说I’m Bo.。小波介绍什么名字？',
        'Bo',
        ['An', 'Bo', '不知道谁说了话'],
        '题干已经明确谁说哪句，按说话者判断。',
      ),
      choose(
        name,
        'privacy',
        '名字卡必须上传真实姓名、住址和电话吗？',
        '不需要',
        ['必须全部上传', '只要上传电话', '不需要'],
        '练习可以用自选昵称，不需要上传个人信息。',
      ),
      actual(
        name,
        'say-name',
        '用自选昵称实际尝试I’m…和My name is…两种表达；需要帮助可以记录。',
      ),
      actual(
        name,
        'card',
        '在纸上画一个标记并制作昵称卡，再借它介绍；未制作可跳过。',
      ),
      actual(
        name,
        'exchange',
        '与陪学者轮流问好和介绍，辨认两位说话者各是谁；实际做过再确认。',
      ),
      record(
        name,
        'today',
        '记录已尝试哪种表达、是否需要示范或帮读；不要填写住址或电话。',
      ),
      record(name, 'plan', '另记下次想练哪一句，不把未来安排记为已做。'),
    ],
    [
      choose(
        name,
        'review-name',
        '新的示例说话者说My name is Lin.，介绍的名字是哪一个？',
        'Lin',
        ['An', 'Lin', 'Bo'],
        '判断来自本次的新名字，不背旧答案。',
      ),
      choose(
        name,
        'review-im',
        '想介绍自己叫Lin，哪句合适？',
        'I’m Lin.',
        ['OK!', 'Let’s play!', 'I’m Lin.'],
        'I’m加自己的名字可用于自我介绍。',
      ),
      actual(
        name,
        'review-dialogue',
        '换一个虚构昵称，再实际问好和自我介绍；练习结果由陪学者观察。',
      ),
    ],
  ),
  draft(
    numbers,
    '英文数字one到six',
    17,
    '将one、two、three、four、five、six与1～6数量对应，区分看词、听音与实际口说。',
    '能逐一数出1～6个物件；不会英语也能在帮读下开始。',
    [
      {
        title: '一个对象对应一个数',
        text: '本站用圆点表示数量，每个点代表一个。one对应1，two对应2，three对应3。先指点数中文数量，再观察英文词，不把字母个数当物件数。',
        visual: { kind: 'count', count: 3 },
      },
      {
        title: '继续认识四到六',
        text: 'four对应4，five对应5，six对应6。four和five都以f开头，却表示不同数量；要看完整词，不仅凭首字母。先理解词与数量，不要求一年级孩子拼写整词。',
        visual: { kind: 'count', count: 6 },
      },
      {
        title: '点数后选完整词',
        text: '数过一个就指向下一个，不重复、不漏数。最后一个数说明这组共有几个；圆点的颜色、行列和间距改变，不会改变它们的总个数。',
        activity: '实际摆1～6张纸片，依次点数；自己摆了多少要自己核对。',
      },
      {
        title: '听和说另练',
        text: '本稿没有示范录音，文字选对只记录词义或数量对应。陪学者使用规范示范后，孩子可以跟读，再听陪学者说词并指向相应数量；没有示范时如实跳过听说。',
        activity:
          '分别进行实际跟读与听词指数量，记录需要帮助的词，不自动给口语满分。',
      },
    ],
    [
      ...words.map((word, index) => ({
        ...choose(
          numbers,
          `word-${index + 1}`,
          `下图有几个圆点？选对应英文词。`,
          word,
          ['three', 'six', 'one', 'five', 'two', 'four'],
          `${index + 1}个对应${word}，逐个点数再核对词。`,
        ),
        visual: { kind: 'count' as const, count: index + 1 },
      })),
      ...words.map((word, index) =>
        task(
          numbers,
          `meaning-${index + 1}`,
          `英文数字词${word}表示几个？填写数字。`,
          { kind: 'number', value: index + 1 },
          `${word}对应${index + 1}。字母数量不是物件数量。`,
        ),
      ),
      actual(
        numbers,
        'say',
        '听规范示范后实际尝试读one到six；未进行听说可以跳过。',
      ),
      actual(
        numbers,
        'point',
        '陪学者实际说一个1～6英文数字词，孩子指向相应纸片数量，换词再练；确认实际做过，不自动认全答对。',
      ),
      record(
        numbers,
        'today',
        '分别记录看词与听说的实际情况；哪些尚未尝试、哪些需要帮助？',
      ),
      record(numbers, 'plan', '另记以后想练哪个词，计划不是已学会。'),
    ],
    [
      ...[4, 1, 6, 2, 5, 3].map((count) => ({
        ...choose(
          numbers,
          `review-${count}`,
          '复习：先数圆点，再选对应词。',
          required(words[count - 1]),
          ['five', 'one', 'four', 'two', 'six', 'three'],
          `${count}个对应${words[count - 1]}，本次换顺序仍要按数量选。`,
        ),
        visual: { kind: 'count' as const, count },
      })),
    ],
  ),
  draft(
    counting,
    '用数字词表达实际数量',
    17,
    '读懂原创数量卡，区分给定样例与自己的真实数量，制作1～6卡片并交流。',
    '已认识one到six的词与数量对应。',
    [
      {
        title: '给定的数量卡',
        text: '本站卡片A上有2个圆点，对应two；卡片B上有5个圆点，对应five。这是本次给定的样例，不代表孩子手里的实物数量。没有数过自己的物件，就不能自动填two或five。',
      },
      {
        title: '判断词和数量是否相配',
        text: 'three配3个，six配6个。对不上的卡片先重新数点，再检查完整词；调整点数或换正确词都可以修正卡片，网页题目按它明确给出的条件作答。',
      },
      {
        title: '自己制作六张卡',
        text: '用六张小纸片分别画1、2、3、4、5、6个点，陪学者可代写相应英文词。指每一张解释数量，检查漏点或重复；不用购买材料或上传作品。',
        activity:
          '实际绘制六张数量卡并检查各张点数；不会写英文可以由陪学者标注。',
      },
      {
        title: '交流和自我观察',
        text: '陪学者出一张卡，孩子数后尝试说数字词；交换角色，再尝试另一张。分别观察能看词对应、能跟读、能听辨或能自主说，不把一项选择正确扩成全会。实际数量超过6时，本课可以选其中1～6个练，不伪称全堆数量。',
      },
    ],
    [
      choose(
        counting,
        'card-a',
        '给定卡片A有2个圆点，应配哪个词？',
        'two',
        ['one', 'two', 'six'],
        '按给定2个选择two。',
      ),
      choose(
        counting,
        'card-b',
        '给定卡片B有5个圆点，应配哪个词？',
        'five',
        ['five', 'four', 'three'],
        '按给定5个选择five。',
      ),
      choose(
        counting,
        'mismatch',
        'three旁画了4个点，这张卡相配吗？',
        '不相配',
        ['相配', '不相配', 'three表示所有数量'],
        'three是3，给定却有4个。',
      ),
      choose(
        counting,
        'correct-card',
        'six应配哪种数量卡？',
        '6个点',
        ['5个点', '1个点', '6个点'],
        'six对应6个。',
      ),
      choose(
        counting,
        'unknown',
        '没有数过自己手里的纸片，能照抄样例的two吗？',
        '不能，先实际数',
        ['能，样例就是自己的数量', '不能，先实际数', '不知道就填0'],
        '未数过是未知，不是样例数量，也不是0。',
      ),
      choose(
        counting,
        'support',
        '不会写five但理解5个，可以怎样做数量卡？',
        '请陪学者代写，再自己核对5个点',
        ['不允许参加', '请陪学者代写，再自己核对5个点', '必须先会拼写才能数'],
        '本课理解数量，不把英文拼写作为门槛。',
      ),
      actual(
        counting,
        'draw',
        '实际制作1～6六张点数卡，逐张核对，不把看过本页当作已经画完。',
      ),
      actual(
        counting,
        'count-own',
        '从自己的物件中选1～6个，实际数并尝试说对应英文词；没数过可跳过。',
      ),
      actual(
        counting,
        'exchange',
        '与陪学者实际交换出卡、数数量和说词两个角色；确认只记实际活动。',
      ),
      record(
        counting,
        'today',
        '分别写今天实际画卡、数数、看词、听说的情况，尚未进行的项目如实说明。',
      ),
      record(
        counting,
        'plan',
        '另记下次想补哪项活动；计划与本次已做分别记录。',
      ),
    ],
    [
      choose(
        counting,
        'review-three',
        '新卡片画了3个点，配哪个词？',
        'three',
        ['six', 'three', 'five'],
        '新给定3个对应three。',
      ),
      choose(
        counting,
        'review-four',
        'four旁画4个点，相配吗？',
        '相配',
        ['相配', '不相配', 'four只表示4个字母'],
        'four对应数量4，不是按字母个数判断。',
      ),
      choose(
        counting,
        'review-own',
        '样例有6个，你还没有数自己的物件，该怎样记录自己的数量？',
        '待实际数，不填样例',
        ['自动填6', '自动填0', '待实际数，不填样例'],
        '未知与0分开，给定卡不是实际持有数。',
      ),
      actual(
        counting,
        'review-exchange',
        '换一组卡片，实际与陪学者交流数量；未做可跳过。',
      ),
    ],
  ),
];
