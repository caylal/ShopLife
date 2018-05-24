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
  home: "近邻生活",
  cart: "购物车",
  goods: {
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
 
  address: "我的地址",
  addressM: {
    add: '添加地址',
    edit: '更新地址'
  },
  userinfo: "用户信息",
  wechatLogin: "微信登录",
  wechatPay: "微信支付",
};
module.exports = {
  formatTime: formatTime,
  pageTitle: pageTitle
}
