// 文本治愈工具共享配置

export const sceneList = [
  {
    id: 'chat',
    name: '聊天回复',
    description: '让回复更得体、更有情商',
    example: '好吧',
    inputLimit: 2000,
  },
  {
    id: 'group_anouncement',
    name: '群内通知',
    description: '使用规范、温和的语言，称谓恰当，帮助接收方快速理解核心信息',
    example: '温馨提示',
    inputLimit: 500,
  },
  {
    id: 'email',
    name: '商务邮件',
    description: '优化邮件的专业性和礼貌程度',
    example: '请尽快回复我',
    inputLimit: 2000,
  },
  {
    id: 'social',
    name: '社交媒体',
    description: '让文案更吸引人、有亲和力',
    example: '今天天气不错',
    inputLimit: 2000,
  },
  {
    id: 'article',
    name: '文章写作',
    description: '提升文章的逻辑性和可读性',
    example: '这是一个很好的产品',
    inputLimit: 2000,
  },
  {
    id: 'review',
    name: '产品评价',
    description: '让评价更有说服力和帮助性',
    example: '这个产品还行',
    inputLimit: 2000,
  }
];

export function getSceneById(id) {
  return sceneList.find(scene => scene.id === id);
}
