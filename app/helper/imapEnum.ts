

export enum eSearchType {
  // 下面的不需要跟任何参数 （都是被标记为各种状态，如“已读”）
  'ALL',
  'ANSWERED',
  'DELETED',
  'DRAFT',
  'FLAGGED',
  'NEW',
  'SEEN',
  'RECENT',
  'OLD',  // 与'RECENT'相反
  'UNANSWERED',
  'UNDELETED',
  'UNDRAFT',
  'UNFLAGGED',
  'UNSEEN',
  // 下面的需要跟一个（或多个）字符串的查询值，如 ['FROM', 'foo@bar.com'] （都是用于查询特定信息包含某些字段）
  'BCC', // 密件抄送
  'CC', // 抄送
  'FROM', // 发件人
  'TO', // 收件人
  'SUBJECT', // 主题
  'BODY', // 正文
  'TEXT', // 邮件头或邮件正文
  'KEYWORD', // 关键字
  'HEADER', // 需要两个字符串值，第一个是标题名称，第二个是要搜索的值。如果第二个值为空，则将返回所有包含给定标头名称的消息。
  // 下面的需要跟 js 的 Date 对象，或能被 Date 解析的字符串 （都是用于时间范围的查询）
  'BEFORE',
  'ON',
  'SINCE',
  'SENTBEFORE',
  'SENTON',
  'SENTSINCE',
  // 下面的需要跟一个整数 （都是用于查询消息大小的，单位是字节）
  'LARGER',
  'SMALLER',
  // 需要跟一个或多个整数
  'UID',

  /*
  使用示例：
    从 2010-4-20 到现在，未读的邮件: [ 'UNSEEN', ['SINCE', 'April 20, 2010'] ]
    未读或者从 2010-4-20 到现在的邮件: [ ['OR', 'UNSEEN', ['SINCE', 'April 20, 2010'] ] ]
    主题标头中所有带有 "node-imap" 的消息: [ ['HEADER', 'SUBJECT', 'node-imap'] ]
    主题标头中没有 "node-imap" 的消息: [ ['!HEADER', 'SUBJECT', 'node-imap'] ]
   */
}

