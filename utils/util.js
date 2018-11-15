const formatTime = (date, types = 1) => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  if(types === 1){
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }else{
    return [hour, minute, second].map(formatNumber).join(':')
  }
 
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const numDate = (start, end) =>{
  let start_date = new Date(start)
  let end_date = new Date(end)
  let days = end_date.getTime() - start_date.getTime();
  let day = parseInt(days / (1000 * 60 * 60 * 24))
  return day
}

const isEmpty = n => {
  if (Object.prototype.toString.call(n) === '[object Object]'){
    if (JSON.stringify(n) !== '{}' || Object.keys(n).length > 0){
      return false
    }
  } else if (Object.prototype.toString.call(n) === '[object Array]'){
    if(n.length > 0){
      return false
    }
  }else{
    if (n != "" && n != null && n != undefined) {
      return false
    }
  } 
  return true;
}

//换算距离低于1000返回米，否则返回千米
const transDistance = len => {
  if(!len || Math.abs(len) <= 0.000001){
    return "0m"
  }
  if (len < 1000) {
    return len.toFixed(2) + 'm'
  } 
  else {
    return (Math.round(len/ 100) / 10).toFixed(1) + 'km'
  } 
}
// 时间转换
const transDate = date => {
  let tt = new Date(date);
  let days = parseInt((new Date().getTime() - tt) / 86400000);
  let today = new Date().getDate();
  let year = tt.getFullYear();
  let mouth = tt.getMonth() + 1;
  let day = tt.getDate();
  let time = tt.getHours() < 10 ? "0" + tt.getHours() : tt.getHours();
  let min = tt.getMinutes() < 10 ? "0" + tt.getMinutes() : tt.getMinutes();
  let result, offset;
  offset = Math.abs(today - day);
  if (days < 4 && offset < 4) {
    if (offset === 0) {
      result = "今天" + time + ":" + min;
    } else if (offset === 1) {
      result = "昨天" + time + ":" + min;
    } else if (offset === 2) {
      result = "前天" + time + ":" + min;
    }
  } else {
    result = year + "-" + mouth + "-" + day + " " + time + ":" + min;
  }
  return result
}

const getPageUrl = () => {
  let pages = getCurrentPages()
  let currentPage = pages[pages.length -1]
  return currentPage.route
}

const pageTitle = {
  home: "近邻生活",
  nbhd: {
    index: "近邻",
    list: "社区列表"
  },
  cart: "购物车",
  goods: {
    list: '商品列表',
    detail: '商品详情',
    catalog: '商品分类'
  },
  member: {
    index: "个人中心",
    setting: "设置",
    address: "地址信息"
  },
  search: "搜索",
  order: "我的订单",
  orderM: {
    detail: '订单详情',
    shopdetail: '门店商品清单',
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
  pageTitle: pageTitle,   
  isEmpty,
  numDate,
  transDistance,
  transDate,
  getPageUrl
}
