const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const pageTitle = {
  home: "首页",
  cart: "购物车",
  catalog: "分类目录",
  goods: "商品中心",
  goodsM: {
    list: '商品列表',
    detail: '宝贝详情',
    catalog: '商品分类'
  },
  member: "个人中心",
  search: "搜索",
  order: "订单中心",
  orderM: {
    detail: '订单详情',
    checkout: '检查订单',
    payment: '订单付款',
    s1: '待付款',
    s2: '待发货',
    s3: '待收货',
    s4: '待评价'
  },
  favorite: "收藏中心",
  notices: "公告中心",
  balance: "我的余额",
  balanceM: {
    history: "资金明细",
    s1: '全部',
    s2: '收入',
    s3: '支出'
  },
  login: "登录",
  forget: "找回密码",
  register: "注册",
  changePassword: "修改密码",
  comments: "商品评论",
  commentsM: {
    add: '评论添加',
    s1: '好评',
    s2: '中评',
    s3: '差评'
  },
  address: "我的地址",
  addressM: {
    add: '添加地址',
    edit: '更新地址'
  },
  withdraw: "提现记录",
  withdrawM: {
    success: '提现成功',
    fail: '提现失败'
  },
  coupon: "我的优惠券",
  bonus: "我的红包",
  bonusM: {
    s1: '未过期',
    s2: '已过期',
    s3: '已使用'
  },
  level: "特权中心",
  score: "积分中心",
  scoreM: {
    s1: '未过期',
    s2: '已过期',
    s3: '已使用'
  },
  userinfo: "用户信息",
  wechatLogin: "微信登录",
  wechatPay: "微信支付",
};
module.exports = {
  formatTime: formatTime,
  pageTitle: pageTitle
}
